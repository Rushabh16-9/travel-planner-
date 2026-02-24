'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCoordinates } from '@/lib/geoapify';
import { getWeather, getWeatherLabel } from '@/lib/weather';
import { getDestinationImage } from '@/lib/unsplash';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || '');

export async function generateTripAction(userQuery: string, duration: string = "3 Days") {
  try {
    // 1. Get Coordinates & Weather
    const geoData = await getCoordinates(userQuery);
    let weatherContext = "";
    let destinationName = userQuery;
    let coordinates = null;

    if (geoData) {
      destinationName = geoData.formatted;
      coordinates = { lat: geoData.lat, lon: geoData.lon };
      const weatherData = await getWeather(geoData.lat, geoData.lon);
      if (weatherData) {
        const currentTemp = weatherData.current.temperature;
        const condition = getWeatherLabel(weatherData.current.weathercode);
        weatherContext = `Current weather in ${destinationName} is ${currentTemp}°C and ${condition}.`;
      }
    }

    // 2. Get Image (Parallel-ish with AI if we wanted, but sequential is fine for now)
    const destinationImage = await getDestinationImage(userQuery);

    // 3. Generate Itinerary with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Act as an expert luxury travel planner. Create a detailed ${duration} trip itinerary for: "${destinationName}".
      
      Context: ${weatherContext}
      
      Requirements:
      1. RETURN ONLY VALID JSON. No markdown formatting.
      2. The JSON must strictly match this structure:
      {
        "destination": "City, Country",
        "duration": ${duration === "3 Days" ? 3 : 3}, 
        "totalCost": 1500,
        "itinerary": [
          {
            "day": 1,
            "date": "Day 1",
            "activities": [
              {
                "time": "09:00 AM",
                "title": "Activity Name",
                "description": "Short engaging description.",
                "type": "Adventure|Relax|Food|Culture",
                "price": 50,
                "period": "Morning",
                "importance": "High"
              },
               {
                "time": "02:00 PM",
                "title": "Activity Name",
                "description": "Description.",
                "type": "Culture",
                "price": 30,
                "period": "Afternoon",
                "importance": "Medium"
              },
              {
                "time": "07:00 PM",
                "title": "Activity Name",
                "description": "Description.",
                "type": "Food",
                "price": 100,
                "period": "Evening",
                "importance": "Low"
              }
            ]
          }
        ]
      }
      
      NOTES:
      - "duration" must be a NUMBER (e.g., 3).
      - "totalCost" must be a NUMBER (e.g., 1500).
      - "price" in each activity must be a NUMBER (estimated cost per person).
      - "importance" must be exactly "High", "Medium", or "Low".
      - "period" must be exactly "Morning", "Afternoon", or "Evening".
      
      Make the activities unique, specific to the location, and consider the weather.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let cleanJson = text;
    if (cleanJson.includes('```json')) {
      cleanJson = cleanJson.split('```json')[1].split('```')[0];
    } else if (cleanJson.includes('```')) {
      cleanJson = cleanJson.split('```')[1].split('```')[0];
    }

    cleanJson = cleanJson.trim();

    try {
      const tripData = JSON.parse(cleanJson);
      // Inject the fetched image
      tripData.image = destinationImage;
      return { success: true, data: tripData };
    } catch (e) {
      console.error("JSON Parse Error", e);
      return { error: "Failed to parse itinerary." };
    }

  } catch (error) {
    console.error("Trip Gen Error:", error);
    return { error: "Failed to generate trip." };
  }
}
