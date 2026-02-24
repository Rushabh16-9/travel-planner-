import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCoordinates } from '@/lib/geoapify';
import { getWeather, getWeatherLabel } from '@/lib/weather';
import { getDestinationImage } from '@/lib/unsplash';
import { getAmadeusData } from '@/lib/amadeus';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');

// ── Static itinerary fallback (no API key required) ──────────────────────────
function buildStaticItinerary(destination: string, days: number, budget: number, currency: string, origin: string, guests: number, fxRate: number = 1) {
  const dest = destination;
  const vibes = ['Culture', 'Foodie', 'Adventure', 'Chill'];
  const fx = (usd: number) => Math.round(usd * fxRate);
  const transports = [
    { mode: 'Metro', cost: fx(3) },
    { mode: 'Bus', cost: fx(2) },
    { mode: 'Walk', cost: 0 },
    { mode: 'Taxi', cost: fx(12) },
  ];

  const activityTemplates = [
    { time: '09:00 AM', title: `Morning City Tour of ${dest}`, description: `Start your adventure with a guided walk through the historic heart of ${dest}, taking in iconic landmarks and local culture.`, vibe: 'Culture', cost: fx(25) },
    { time: '11:30 AM', title: 'Local Market Exploration', description: `Wander through a bustling local market in ${dest}, sample street food, and pick up unique souvenirs.`, vibe: 'Foodie', cost: fx(15) },
    { time: '01:00 PM', title: 'Lunch at a Top-Rated Restaurant', description: `Enjoy a leisurely lunch at one of ${dest}'s most celebrated eateries, savoring regional specialties.`, vibe: 'Foodie', cost: fx(35) },
    { time: '03:00 PM', title: 'Museum & Cultural Heritage Visit', description: `Explore a world-class museum showcasing the art, history, and heritage of ${dest}.`, vibe: 'Culture', cost: fx(20) },
    { time: '05:30 PM', title: 'Sunset Viewpoint', description: `Catch breathtaking golden-hour views from the most popular scenic spot in ${dest}.`, vibe: 'Chill', cost: 0 },
    { time: '08:00 PM', title: 'Dinner & Local Entertainment', description: `Dine at a lively restaurant and experience the vibrant nightlife and entertainment of ${dest}.`, vibe: 'Foodie', cost: fx(50) },
    { time: '10:00 AM', title: 'Day Trip to Nearby Attraction', description: `Venture outside the city to discover a stunning natural or historical landmark near ${dest}.`, vibe: 'Adventure', cost: fx(40) },
    { time: '02:00 PM', title: 'Spa & Wellness Experience', description: `Recharge with a traditional local wellness treatment — a perfect mid-trip indulgence.`, vibe: 'Chill', cost: fx(60) },
    { time: '10:30 AM', title: 'Cooking Class', description: `Learn to prepare authentic local dishes in a hands-on cooking class with a professional chef from ${dest}.`, vibe: 'Foodie', cost: fx(55) },
    { time: '04:00 PM', title: 'Neighbourhood Walking Tour', description: `Explore a charming local neighbourhood, discovering hidden cafés, street art, and authentic daily life.`, vibe: 'Culture', cost: fx(10) },
  ];

  const itinerary = Array.from({ length: days }, (_, dayIdx) => {
    const activitiesForDay = [
      activityTemplates[(dayIdx * 4) % activityTemplates.length],
      activityTemplates[(dayIdx * 4 + 1) % activityTemplates.length],
      activityTemplates[(dayIdx * 4 + 2) % activityTemplates.length],
      activityTemplates[(dayIdx * 4 + 3) % activityTemplates.length],
    ].map((act, idx) => ({
      time: act.time,
      title: act.title,
      description: act.description,
      vibe: vibes[idx % vibes.length],
      estimatedCost: act.cost,
      importance: idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low',
      transportFromPrevious: idx === 0 ? null : transports[idx % transports.length],
    }));

    return {
      day: dayIdx + 1,
      date: `Day ${dayIdx + 1}`,
      activities: activitiesForDay,
    };
  });

  // Realistic round-trip economy flight estimate (USD base * fx)
  const destLow = dest.toLowerCase();
  const isLongHaul = ['paris', 'london', 'new york', 'tokyo', 'dubai', 'singapore', 'sydney', 'maldives', 'europe', 'usa'].some(d => destLow.includes(d));
  const flightUSD = isLongHaul ? 850 : 500;

  return {
    destination: dest,
    duration: days,
    totalCost: budget,
    currency,
    flightEstimate: { economy: fx(flightUSD), business: fx(Math.round(flightUSD * 2.8)), currency },
    itinerary,
    _isFallback: true,
  };
}


export async function POST(req: Request) {
  try {
    const { destination, days = 3, budget, origin, fromDate, toDate, guests, currency: reqCurrency, adjustedBudget } = await req.json();
    console.log("🚀 API Received:", destination, "Days:", days, "Origin:", origin, "Currency:", reqCurrency);

    const query = destination;

    if (!query) {
      return NextResponse.json({ error: "Destination required" }, { status: 400 });
    }

    // 1. Parallel Data Fetching
    const geoData = await getCoordinates(query);
    let weatherData = null;
    let amadeusData: any[] = [];
    let destinationImage = null;

    if (!geoData) {
      console.warn("⚠️ Geoapify failed. Proceeding without location data.");
      destinationImage = await getDestinationImage(query);
    } else {
      try {
        [weatherData, destinationImage, amadeusData] = await Promise.all([
          getWeather(geoData.lat, geoData.lon).catch(e => null),
          getDestinationImage(query).catch(e => null),
          getAmadeusData(geoData.lat, geoData.lon).catch(e => [])
        ]);
      } catch (e) {
        console.error("Context Fetching Partial Failure:", e);
      }
    }

    // 2. Prepare Context
    // Extract currency from budget string (e.g. "USD 2000") -> "USD"
    const currencyCode = budget?.split(' ')[0] || 'USD';
    const currencyFinal = reqCurrency || currencyCode;

    // Approximate USD → local currency conversion rates for smart budget defaults
    const CURRENCY_RATES: Record<string, number> = {
      USD: 1, EUR: 0.92, GBP: 0.79, INR: 83, AUD: 1.52, JPY: 149,
      AED: 3.67, CAD: 1.36, CHF: 0.90, SGD: 1.34, THB: 35, MYR: 4.7,
      IDR: 15700, KES: 130, ZAR: 18.5, BRL: 4.97, MXN: 17.2, TRY: 31.8,
      NOK: 10.6, SEK: 10.4,
    };
    const fxRate = CURRENCY_RATES[currencyFinal] ?? 1;

    // Smart budget defaults based on destination tier (USD base × fx rate)
    const LUXURY_CITIES = ['dubai', 'maldives', 'singapore', 'monaco', 'santorini', 'mykonos', 'bora bora', 'st barts', 'aspen', 'zurich', 'geneva', 'london', 'paris', 'new york', 'tokyo', 'hong kong', 'sydney', 'amalfi', 'positano'];
    const MIDRANGE_CITIES = ['bali', 'barcelona', 'rome', 'amsterdam', 'prague', 'lisbon', 'istanbul', 'bangkok', 'kyoto', 'osaka', 'seoul', 'kuala lumpur', 'mexico city', 'buenos aires', 'rio', 'cape town', 'marrakech', 'cairo'];
    const destLower = (query || '').toLowerCase();
    const isLuxury = LUXURY_CITIES.some(c => destLower.includes(c));
    const isMidrange = MIDRANGE_CITIES.some(c => destLower.includes(c));
    // Per person per night baseline in USD, then converted to chosen currency
    const ppnUSD = isLuxury ? 350 : isMidrange ? 180 : 90;
    const ppn = Math.round(ppnUSD * fxRate);
    const safeDays = (days && days > 0 && days < 365) ? days : 7;
    const smartDefault = ppn * (guests || 2) * safeDays;
    const budgetAmount = adjustedBudget || parseInt(budget?.replace(/\D/g, '') || '0') || smartDefault;

    let context = `Destination: ${geoData?.formatted || query}\n`;
    if (budget) context += `Budget Constraint: ${budget}\n`;

    if (weatherData) {
      const temp = weatherData.current.temperature;
      const condition = getWeatherLabel(weatherData.current.weathercode);
      context += `Current Weather: ${temp}°C, ${condition}\n`;
    }

    if (amadeusData && amadeusData.length > 0) {
      context += `Real Local Attractions: ${amadeusData.map((poi: { name: string }) => poi.name).join(', ')}\n`;
    }


    // 3. Generate Itinerary
    let tripData;
    const ollamaModel = process.env.OLLAMA_MODEL;
    const kimiKey = process.env.KIMI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const guestsFinal = guests || 2;
    // Support budget re-planning from TripResults
    const budgetFinal = budgetAmount;

    // Prompt Template
    const systemPrompt = "You are a travel assistant. Return ONLY valid JSON. No markdown, no code fences.";
    const userPrompt = `Create a ${days}-day trip itinerary for "${query}".
Context: ${context}
${origin ? `Travelling from: ${origin}` : ''}
Guests: ${guestsFinal}
Currency: ${currencyFinal}
Budget: ${budgetFinal} ${currencyFinal}
${fromDate ? `Travel dates: ${fromDate} to ${toDate}` : ''}

Output ONLY this JSON (no extra text):
{
  "destination": "${geoData?.formatted || query}",
  "duration": ${days},
  "totalCost": ${budgetFinal},
  "currency": "${currencyFinal}",
  "flightEstimate": {
    "economy": 650,
    "business": 1800,
    "currency": "${currencyFinal}"
  },
  "itinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Brief engaging description",
          "vibe": "Culture",
          "estimatedCost": 50,
          "importance": "High",
          "transportFromPrevious": null
        },
        {
          "time": "11:30 AM",
          "title": "Second Activity",
          "description": "Brief engaging description",
          "vibe": "Foodie",
          "estimatedCost": 30,
          "importance": "Medium",
          "transportFromPrevious": { "mode": "Metro", "cost": 3 }
        }
      ]
    }
  ]
}

Rules:
- Include ${days} days, 4-5 activities each
- Vibe options: Adventure, Foodie, Culture, Chill
- transportFromPrevious is null for the first activity of each day; for subsequent activities use realistic local transport (Walk/Metro/Bus/Taxi) with realistic cost in ${currencyFinal}
- flightEstimate should reflect realistic round-trip prices from ${origin || 'a major hub'} to ${query}
- Fit activities to the ${budgetFinal} ${currencyFinal} budget
- Descriptions concise but engaging (1-2 sentences)`;

    // --- Priority 1: Groq (Fast & Free) ---
    if (groqKey) {
      try {
        console.log("🚀 Trying Groq: llama-3.3-70b-versatile");
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 4096,
          }),
        });

        const groqData = await groqRes.json();
        if (!groqRes.ok) throw new Error(groqData.error?.message || 'Groq API error');

        const text = groqData.choices[0].message.content.trim();
        const firstOpen = text.indexOf('{');
        const lastClose = text.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose > firstOpen) {
          tripData = JSON.parse(text.substring(firstOpen, lastClose + 1));
          console.log("✅ Groq succeeded");
        } else {
          throw new Error('Groq returned no JSON');
        }
      } catch (groqError) {
        console.error("Groq Failed:", groqError instanceof Error ? groqError.message : groqError);
      }
    }

    // --- Priority 2: Ollama (Local / Cloud Native) ---
    if (ollamaModel) {
      try {
        const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
        console.log(`🔌 Connecting to Ollama: ${baseUrl} Model: ${ollamaModel}`);

        const requestBody = {
          model: ollamaModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          stream: true,
          options: { temperature: 0.3 }
        };

        console.log("Sending to Ollama:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        if (response.status === 401) {
          throw new Error("Ollama 401 Unauthorized");
        }

        if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);

        // Handle Stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                if (json.message?.content) fullContent += json.message.content;
                if (json.done) break;
              } catch (e) { /* ignore partials */ }
            }
          }
        }

        if (!fullContent) throw new Error("Ollama - No content received");
        console.log("Ollama Raw Output:", fullContent);

        try {
          // Robust JSON Extraction: Find first { and last }
          const firstOpen = fullContent.indexOf('{');
          const lastClose = fullContent.lastIndexOf('}');

          if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            const jsonString = fullContent.substring(firstOpen, lastClose + 1);
            tripData = JSON.parse(jsonString);
          } else {
            throw new Error("No JSON structure found in response");
          }
        } catch (e) {
          console.error("JSON Parse Failed for Ollama output");
          throw new Error("Ollama returned invalid JSON");
        }

      } catch (ollamaError) {
        console.error("Ollama Failed:", ollamaError instanceof Error ? ollamaError.message : String(ollamaError));
      }

    }

    if (!tripData && kimiKey) {
      // --- Priority 2: Kimi (Moonshot Cloud) ---
      try {
        const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${kimiKey}`
          },
          body: JSON.stringify({
            model: "moonshot-v1-8k",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.3
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Kimi API Error");

        const content = data.choices[0].message.content;
        const firstOpen = content.indexOf('{');
        const lastClose = content.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
          tripData = JSON.parse(content.substring(firstOpen, lastClose + 1));
        } else {
          throw new Error("Invalid Kimi JSON");
        }
      } catch (e) {
        console.error("Kimi Failed:", e);
      }
    }

    if (!tripData) {
      // --- Priority 3: Gemini (Fallback) ---
      try {
        // Fallback to gemini-pro which is generally available
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(userPrompt);
        const text = result.response.text();

        const firstOpen = text.indexOf('{');
        const lastClose = text.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
          tripData = JSON.parse(text.substring(firstOpen, lastClose + 1));
        } else {
          throw new Error("Invalid Gemini JSON");
        }
      } catch (e) {
        console.error("Gemini Failed:", e);
      }
    }

    if (!tripData) {
      console.warn('⚠️ All AI providers failed — using static itinerary fallback');
      tripData = buildStaticItinerary(
        geoData?.formatted || query,
        safeDays,
        budgetFinal,
        currencyFinal,
        origin || 'your city',
        guestsFinal,
        fxRate,
      );
    }

    // Inject real image
    tripData.image = destinationImage;
    if (geoData) {
      tripData.coordinates = { lat: geoData.lat, lon: geoData.lon };
    }

    return NextResponse.json(tripData);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
