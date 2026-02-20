import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { destination, fromDate, toDate } = await req.json();

        if (!destination || !fromDate || !toDate) {
            return NextResponse.json({ verdict: 'neutral', message: 'Enter your destination and travel dates to get an AI advisory.' });
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        const month = from.toLocaleString('en-US', { month: 'long' });
        const year = from.getFullYear();
        const nights = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

        const prompt = `You are a travel advisor AI. Give a brief travel advisory for visiting ${destination} from ${fromDate} to ${toDate} (${nights} nights, arriving in ${month} ${year}).

Consider: weather, peak/off-season, local events, festivals, monsoon/hurricane season, extreme temperatures, crowd levels, prices.

Respond with ONLY a JSON object like this:
{
  "verdict": "good" | "warning" | "poor",
  "message": "One sentence (max 20 words) explaining why it's good/warning/poor to visit."
}

Be honest and specific. Examples:
- good: "Perfect timing — warm, dry weather and fewer crowds than summer peak."
- warning: "Monsoon season begins mid-month; expect rain and high humidity."
- poor: "Peak cyclone season — most resorts close and travel advisories are active."`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON in response');

        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);

    } catch (err) {
        console.error('Travel advisory error:', err);
        // Return a graceful fallback
        return NextResponse.json({
            verdict: 'neutral',
            message: 'AI advisory unavailable right now. Check local travel guides for current conditions.',
        });
    }
}
