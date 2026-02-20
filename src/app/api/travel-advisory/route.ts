import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { destination, fromDate, toDate } = await req.json();

        if (!destination || !fromDate || !toDate) {
            return NextResponse.json({ verdict: 'neutral', message: 'Enter your destination and travel dates to get an AI advisory.' });
        }

        const nights = Math.round((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24));
        const month = new Date(fromDate).toLocaleString('en-US', { month: 'long' });
        const year = new Date(fromDate).getFullYear();

        const prompt = `You are a travel advisor AI. Give a detailed travel advisory for visiting ${destination} from ${fromDate} to ${toDate} (${nights} nights, arriving in ${month} ${year}).

Consider: weather, temperature, peak/off-season, local events, festivals, monsoon/hurricane/storm season, crowd levels, value for money.

Respond with ONLY a JSON object — no markdown, no code fences:
{
  "verdict": "good" | "warning" | "poor",
  "headline": "Short punchy title max 8 words",
  "message": "1-2 sentences explaining the conditions in detail.",
  "temp": "e.g. 28°C / 82°F",
  "season": "e.g. Dry Season or Peak Season"
}

Examples:
- good:    {"verdict":"good",    "headline":"Perfect weather for sightseeing",      "message":"It's dry season with clear skies and warm temperatures. Crowds are moderate and prices are reasonable.", "temp":"28°C / 82°F", "season":"Dry Season"}
- warning: {"verdict":"warning", "headline":"Monsoon season starts mid-month",       "message":"Expect heavy afternoon rain and high humidity. Indoor activities are still enjoyable but outdoor excursions may be disrupted.", "temp":"31°C / 88°F", "season":"Monsoon Season"}
- poor:    {"verdict":"poor",    "headline":"Peak cyclone season — avoid if possible","message":"Active storm advisories are in place and many resorts close during this period. Consider rescheduling.", "temp":"30°C / 86°F", "season":"Cyclone Season"}`;

        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) throw new Error('GROQ_API_KEY not set');

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

    } catch (err) {
        console.error('Travel advisory error:', err);
        return NextResponse.json({
            verdict: 'neutral',
            headline: 'Advisory unavailable',
            message: 'Could not fetch AI travel advisory right now. Check local travel guides for current conditions.',
        });
    }
}
