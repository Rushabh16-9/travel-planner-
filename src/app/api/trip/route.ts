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

    // 3. Generate Itinerary with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Act as an expert luxury travel planner. Create a detailed ${days}-day trip itinerary for: "${query}".
      
      DATA CONTEXT:
      ${context}
      
      Requirements:
      1. RETURN ONLY VALID JSON. No text, no markdown.
      2. The structure must match this EXACTLY:
      {
        "destination": "${geoData.formatted || query}",
        "duration": ${days}, 
        "totalCost": 2500,
        "itinerary": [
          {
            "day": 1,
            "date": "Day 1",
            "activities": [
              {
                "time": "09:00 AM",
                "title": "Activity Name",
                "description": "Engaging description.",
                "type": "Adventure|relax|food|culture",
                "price": 50,
                "importance": "High"
              }
            ]
          }
        ]
      }
      
      Ensure valid JSON. Do not include \`\`\`json blocks. Just the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const jsonString = result.response.text().replace(/```json|```/g, '').trim();

    const tripData = JSON.parse(jsonString);

    // Inject real image
    tripData.image = destinationImage;
    tripData.coordinates = { lat: geoData.lat, lon: geoData.lon };

    return NextResponse.json(tripData);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
