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

        const prompt = `You are a travel advisor AI. Give a brief travel advisory for visiting ${destination} from ${fromDate} to ${toDate} (${nights} nights, arriving in ${month} ${year}).

Consider: weather, peak/off-season, local events, festivals, monsoon/hurricane season, extreme temperatures, crowd levels, and value for money.

Respond with ONLY a JSON object — no markdown, no code fences:
{"verdict":"good","message":"One sentence max 20 words explaining conditions."}

verdict must be exactly one of: "good", "warning", "poor"

Examples:
- good: Perfect timing — warm dry weather and fewer crowds than peak summer.
- warning: Monsoon season begins mid-month; expect heavy rain and high humidity.
- poor: Peak cyclone season — most resorts close and advisories are active.`;

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
                    { role: 'system', content: 'You are a travel advisor. Return ONLY valid JSON. No markdown. No explanation.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.3,
                max_tokens: 120,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Groq API error');

        const text = data.choices[0].message.content.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');

        const parsed = JSON.parse(jsonMatch[0]);
        console.log(`✅ Groq Advisory [${parsed.verdict}]: ${parsed.message}`);
        return NextResponse.json(parsed);

    } catch (err) {
        console.error('Travel advisory error:', err);
        return NextResponse.json({
            verdict: 'neutral',
            message: 'AI advisory unavailable right now. Check local travel guides for conditions.',
        });
    }
}
