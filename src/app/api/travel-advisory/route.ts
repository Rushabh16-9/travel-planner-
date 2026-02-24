import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ── Static fallback: month + destination heuristics ──────────────────────────

type SeasonInfo = { verdict: 'good' | 'warning' | 'poor'; headline: string; message: string; temp: string; season: string };

const MONSOON_DESTINATIONS = ['bali', 'thailand', 'bangkok', 'phuket', 'chiang mai', 'vietnam', 'hanoi', 'ho chi minh', 'mumbai', 'goa', 'india', 'kerala', 'sri lanka', 'maldives', 'philippines', 'manila', 'cambodia', 'myanmar'];
const HURRICANE_DESTINATIONS = ['cancun', 'caribbean', 'bahamas', 'mexico', 'cuba', 'jamaica', 'barbados', 'florida', 'miami', 'new orleans'];
const HOT_DESERT_DESTINATIONS = ['dubai', 'abu dhabi', 'doha', 'qatar', 'riyadh', 'saudi', 'oman', 'muscat', 'kuwait', 'bahrain', 'egypt', 'cairo', 'marrakech', 'morocco'];
const COLD_DESTINATIONS = ['iceland', 'norway', 'sweden', 'finland', 'alaska', 'canada', 'montreal', 'toronto', 'moscow', 'russia', 'lapland'];

const MONSOON_MONTHS = [6, 7, 8, 9];          // Jun-Sep
const HURRICANE_MONTHS = [8, 9, 10];          // Aug-Oct
const HOT_SUMMER_MONTHS = [6, 7, 8];          // Jun-Aug
const COLD_WINTER_MONTHS = [12, 1, 2];        // Dec-Feb

function getStaticAdvisory(destination: string, fromDate: string): SeasonInfo {
    const dest = destination.toLowerCase();
    const month = new Date(fromDate).getMonth() + 1; // 1-12
    const monthName = new Date(fromDate).toLocaleString('en-US', { month: 'long' });

    const isMonsoon = MONSOON_DESTINATIONS.some(d => dest.includes(d));
    const isHurricane = HURRICANE_DESTINATIONS.some(d => dest.includes(d));
    const isHotDesert = HOT_DESERT_DESTINATIONS.some(d => dest.includes(d));
    const isCold = COLD_DESTINATIONS.some(d => dest.includes(d));

    // Monsoon regions during monsoon months
    if (isMonsoon && MONSOON_MONTHS.includes(month)) {
        return {
            verdict: 'warning',
            headline: 'Monsoon season — expect heavy rain',
            message: `${monthName} brings heavy afternoon showers and high humidity to ${destination}. Indoor activities and cultural sites are still great, but outdoor plans may be disrupted.`,
            temp: '30°C / 86°F',
            season: 'Monsoon Season',
        };
    }

    // Monsoon regions in dry/peak season
    if (isMonsoon && [11, 12, 1, 2, 3, 4].includes(month)) {
        return {
            verdict: 'good',
            headline: 'Dry season — ideal conditions',
            message: `${monthName} is one of the best months to visit ${destination}. Expect clear skies, comfortable temperatures, and vibrant local life.`,
            temp: '28°C / 82°F',
            season: 'Dry Season',
        };
    }

    // Hurricane belt during peak season
    if (isHurricane && HURRICANE_MONTHS.includes(month)) {
        return {
            verdict: 'warning',
            headline: 'Hurricane season — monitor forecasts',
            message: `${monthName} falls within hurricane season for ${destination}. Weather can be unpredictable — monitor local forecasts and consider travel insurance.`,
            temp: '29°C / 84°F',
            season: 'Hurricane Season',
        };
    }

    // Desert destinations in peak summer
    if (isHotDesert && HOT_SUMMER_MONTHS.includes(month)) {
        return {
            verdict: 'warning',
            headline: 'Extreme heat — plan indoor activities',
            message: `Temperatures in ${destination} can exceed 42°C (108°F) in ${monthName}. Outdoor sightseeing is best done early morning or evening. Many indoor attractions are excellent.`,
            temp: '42°C / 108°F',
            season: 'Peak Summer',
        };
    }

    // Desert destinations in cool season
    if (isHotDesert && [11, 12, 1, 2, 3].includes(month)) {
        return {
            verdict: 'good',
            headline: 'Perfect weather for sightseeing',
            message: `${monthName} is the best time to visit ${destination} — warm, sunny days with cool evenings. Ideal for outdoor attractions and exploring the city.`,
            temp: '25°C / 77°F',
            season: 'Cool Season',
        };
    }

    // Cold destinations in winter
    if (isCold && COLD_WINTER_MONTHS.includes(month)) {
        return {
            verdict: 'warning',
            headline: 'Cold & dark winter months',
            message: `${destination} in ${monthName} brings sub-zero temperatures and limited daylight. Pack heavy layers — but it's magical for Northern Lights and snow activities!`,
            temp: '-5°C / 23°F',
            season: 'Winter',
        };
    }

    // Northern hemisphere summer (general good travel)
    if ([5, 6, 7, 8, 9].includes(month)) {
        return {
            verdict: 'good',
            headline: 'Great time to visit',
            message: `${monthName} offers pleasant weather and long days in ${destination}. Popular with tourists — book accommodation and popular attractions in advance.`,
            temp: '24°C / 75°F',
            season: 'Summer',
        };
    }

    // Shoulder seasons — generally good value
    if ([3, 4, 10, 11].includes(month)) {
        return {
            verdict: 'good',
            headline: 'Shoulder season — great value',
            message: `${monthName} is a smart time to visit ${destination} — fewer crowds, lower prices, and comfortable temperatures. A solid choice for budget-conscious travellers.`,
            temp: '20°C / 68°F',
            season: 'Shoulder Season',
        };
    }

    // Default winter (Dec-Feb, non-cold destinations)
    return {
        verdict: 'good',
        headline: 'Mild winter — pleasant to explore',
        message: `${monthName} brings cooler, comfortable temperatures to ${destination}. A quieter time with fewer tourists and good value on accommodation.`,
        temp: '18°C / 64°F',
        season: 'Winter',
    };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const { destination, fromDate, toDate } = await req.json();

        if (!destination || !fromDate || !toDate) {
            return NextResponse.json({ verdict: 'neutral', message: 'Enter your destination and travel dates to get an AI advisory.' });
        }

        const nights = Math.round((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24));
        const month = new Date(fromDate).toLocaleString('en-US', { month: 'long' });
        const year = new Date(fromDate).getFullYear();

        // Try Groq first if API key is available
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey) {
            try {
                const prompt = `You are a travel advisor AI. Give a detailed travel advisory for visiting ${destination} from ${fromDate} to ${toDate} (${nights} nights, arriving in ${month} ${year}).

Consider: weather, temperature, peak/off-season, local events, festivals, monsoon/hurricane/storm season, crowd levels, value for money.

Respond with ONLY a JSON object — no markdown, no code fences:
{
  "verdict": "good" | "warning" | "poor",
  "headline": "Short punchy title max 8 words",
  "message": "1-2 sentences explaining the conditions in detail.",
  "temp": "e.g. 28°C / 82°F",
  "season": "e.g. Dry Season or Peak Season"
}`;

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${groqKey}`,
                    },
                    body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
                        messages: [
                            { role: 'system', content: 'You are a travel advisor. Return ONLY valid JSON. No markdown, no extra text.' },
                            { role: 'user', content: prompt },
                        ],
                        temperature: 0.3,
                        max_tokens: 200,
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || 'Groq API error');

                const text = data.choices[0].message.content.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error('No JSON in response');

                const parsed = JSON.parse(jsonMatch[0]);
                console.log(`✅ Groq Advisory [${parsed.verdict}]:`, parsed.headline);
                return NextResponse.json(parsed);
            } catch (groqErr) {
                console.warn('Groq advisory failed, falling back to static:', groqErr instanceof Error ? groqErr.message : groqErr);
            }
        }

        // Smart static fallback — always works without any API key
        const advisory = getStaticAdvisory(destination, fromDate);
        console.log(`📋 Static Advisory [${advisory.verdict}] for ${destination} in ${month}:`, advisory.headline);
        return NextResponse.json(advisory);

    } catch (err) {
        console.error('Travel advisory error:', err);
        return NextResponse.json({
            verdict: 'neutral',
            headline: 'Advisory unavailable',
            message: 'Could not fetch AI travel advisory right now. Check local travel guides for current conditions.',
        });
    }
}
