import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCoordinates } from '@/lib/geoapify';
import { getWeather, getWeatherLabel } from '@/lib/weather';
import { getDestinationImage } from '@/lib/unsplash';
import { getAmadeusData } from '@/lib/amadeus';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');

export async function POST(req: Request) {
  try {
    const { query, days = 3 } = await req.json();
    console.log("🚀 API Received Query:", query, "Days:", days);

    if (!query) {
      return NextResponse.json({ error: "Destination required" }, { status: 400 });
    }

    // 1. Parallel Data Fetching
    // 1. Parallel Data Fetching
    let geoData = await getCoordinates(query);
    let weatherData = null;
    let amadeusData: any[] = [];
    let destinationImage = null;

    if (!geoData) {
      console.warn("⚠️ Geoapify failed or returned no results. Proceeding without location data.");
      // Fallback: Proceed with just the query, skip location-dependent services
      destinationImage = await getDestinationImage(query);
    } else {
      console.log("✅ Geoapify Success:", geoData);
      try {
        [weatherData, destinationImage, amadeusData] = await Promise.all([
          getWeather(geoData.lat, geoData.lon).catch(e => { console.error("Weather Failed:", e); return null; }),
          getDestinationImage(query).catch(e => { console.error("Image Failed:", e); return null; }),
          getAmadeusData(geoData.lat, geoData.lon).catch(e => { console.error("Amadeus Failed:", e); return []; })
        ]);
      } catch (e) {
        console.error("Context Fetching Partial Failure:", e);
      }
    }

    // 2. Prepare Context
    let context = `Destination: ${geoData?.formatted || query}\n\n`;

    if (weatherData) {
      const temp = weatherData.current.temperature;
      const condition = getWeatherLabel(weatherData.current.weathercode);
      context += `Current Weather: ${temp}°C, ${condition}\n`;
    }

    if (amadeusData && amadeusData.length > 0) {
      context += `Real Local Attractions (incorporate these): ${amadeusData.map((poi: any) => poi.name).join(', ')}\n`;
    }

    // 3. Generate Itinerary (Ollama / Kimi / Gemini)
    let tripData;
    const ollamaModel = process.env.OLLAMA_MODEL; // e.g., "kimi-k2.5"
    const kimiKey = process.env.KIMI_API_KEY;

    // --- Priority 1: Ollama (Local / Cloud Native) ---
    if (ollamaModel) {
      try {
        const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
        console.log(`🔌 Connecting to Ollama: ${baseUrl} Model: ${ollamaModel}`);

        const requestBody = {
          model: ollamaModel,
          messages: [
            { role: "system", content: "You are a travel assistant. Return ONLY valid JSON." },
            {
              role: "user", content: `Create a ${days}-day trip itinerary for "${query}".
Context: ${context}

Output format:
{
  "destination": "${geoData?.formatted || query}",
  "duration": ${days},
  "totalCost": 2000,
  "itinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Brief description",
          "type": "Adventure",
          "price": 50,
          "importance": "High"
        }
      ]
    }
  ]
}
Include ${days} days.`
            }
          ],
          stream: true, // Enable streaming for "Thinking" effect
          options: { temperature: 0.3 }
        };

        console.log("Sending to Ollama:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        if (response.status === 401) {
          throw new Error("Ollama 401 Unauthorized: Check your public key (id_ed25519.pub) on ollama.com");
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
          const jsonString = fullContent.replace(/```json|```/g, '').trim();
          tripData = JSON.parse(jsonString);
        } catch (e) {
          console.error("JSON Parse Failed. Raw:", fullContent);
          throw new Error("Ollama returned invalid JSON");
        }

      } catch (ollamaError: any) {
        console.error("Ollama Failed:", ollamaError.message);
        // Fallthrough if not 401?
        if (ollamaError.message.includes("401")) {
          // For now just log, execution continues to Priority 2
        }
      }
    }



    if (!tripData && kimiKey) {
      // --- Priority 2: Kimi (Moonshot Cloud) ---
      const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${kimiKey}`
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            {
              role: "system",
              content: "You are a travel assistant. Return ONLY valid JSON. No markdown."
            },
            {
              role: "user",
              content: `Create a ${days}-day trip itinerary for "${query}".
Context: ${context}

Output format:
{
  "destination": "${geoData?.formatted || query}",
  "duration": ${days},
  "totalCost": 2000,
  "itinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Brief description",
          "type": "Adventure",
          "price": 50,
          "importance": "High"
        }
      ]
    }
  ]
}
Include ${days} days.`
            }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Kimi API Error");

      const content = data.choices[0].message.content;
      const jsonString = content.replace(/```json|```/g, '').trim();
      tripData = JSON.parse(jsonString);

    }

    if (!tripData) {
      // --- Priority 3: Gemini (Fallback) ---
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Create a ${days}-day trip itinerary for "${query}".

Context: ${context}

Return ONLY valid JSON (no markdown, no text):
{
  "destination": "${geoData?.formatted || query}",
  "duration": ${days},
  "totalCost": 2000,
  "itinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Brief description",
          "type": "Adventure",
          "price": 50,
          "importance": "High"
        }
      ]
    }
  ]
}

Include ${days} days with 4-5 activities per day. Keep descriptions concise.`;

      const result = await model.generateContent(prompt);
      const jsonString = result.response.text().replace(/```json|```/g, '').trim();
      tripData = JSON.parse(jsonString);
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
