export async function getWeather(lat: number, lon: number) {
    // Open-Meteo doesn't require an API key
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&current_weather=true&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather");

        const data = await response.json();
        return {
            current: data.current_weather,
            daily: data.daily
        };
    } catch (error) {
        console.error("Open-Meteo Error:", error);
        return null;
    }
}

// Helper to interpret WMO Weather codes
export function getWeatherLabel(code: number): string {
    const codes: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        95: "Thunderstorm",
    };
    return codes[code] || "Variable";
}
