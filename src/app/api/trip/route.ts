import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCoordinates } from '@/lib/geoapify';
import { getWeather, getWeatherLabel } from '@/lib/weather';
import { getDestinationImage } from '@/lib/unsplash';
import { getAmadeusData } from '@/lib/amadeus';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');

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
    // Smart budget defaults based on destination tier
    const LUXURY_CITIES = ['dubai', 'maldives', 'singapore', 'monaco', 'santorini', 'mykonos', 'bora bora', 'st barts', 'aspen', 'zurich', 'geneva', 'london', 'paris', 'new york', 'tokyo', 'hong kong', 'sydney', 'amalfi', 'positano'];
    const MIDRANGE_CITIES = ['bali', 'barcelona', 'rome', 'amsterdam', 'prague', 'lisbon', 'istanbul', 'bangkok', 'kyoto', 'osaka', 'seoul', 'kuala lumpur', 'mexico city', 'buenos aires', 'rio', 'cape town', 'marrakech', 'cairo'];
    const destLower = (query || '').toLowerCase();
    const isLuxury = LUXURY_CITIES.some(c => destLower.includes(c));
    const isMidrange = MIDRANGE_CITIES.some(c => destLower.includes(c));
    // Per person per night baseline
    const ppn = isLuxury ? 350 : isMidrange ? 180 : 90;
    const smartDefault = ppn * (guests || 2) * (days || 3);
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
    const currencyFinal = reqCurrency || currencyCode;
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
      throw new Error("All AI models failed to generate itinerary.");
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
