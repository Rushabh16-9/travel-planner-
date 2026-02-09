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

    if (!query) {
      return NextResponse.json({ error: "Destination required" }, { status: 400 });
    }

    // 1. Parallel Data Fetching
    const geoData = await getCoordinates(query);
    if (!geoData) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const [weatherData, destinationImage, amadeusData] = await Promise.all([
      getWeather(geoData.lat, geoData.lon),
      getDestinationImage(query),
      getAmadeusData(geoData.lat, geoData.lon)
    ]);

    // 2. Prepare Context
    let context = `Destination: ${geoData.formatted}\n\n`;

    if (weatherData) {
      const temp = weatherData.current.temperature;
      const condition = getWeatherLabel(weatherData.current.weathercode);
      context += `Current Weather: ${temp}°C, ${condition}\n`;
    }

    if (amadeusData && amadeusData.length > 0) {
      context += `Real Local Attractions (incorporate these): ${amadeusData.map((poi: any) => poi.name).join(', ')}\n`;
    }

    // 3. Generate Itinerary (Kimi / Gemini Switch)
    let tripData;
    const kimiKey = process.env.KIMI_API_KEY;

    if (kimiKey) {
      // --- Use Kimi (Moonshot AI) ---
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
  "destination": "${geoData.formatted || query}",
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

    } else {
      // --- Use Gemini (Fallback) ---
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Create a ${days}-day trip itinerary for "${query}".

Context: ${context}

Return ONLY valid JSON (no markdown, no text):
{
  "destination": "${geoData.formatted || query}",
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
    tripData.coordinates = { lat: geoData.lat, lon: geoData.lon };

    return NextResponse.json(tripData);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
