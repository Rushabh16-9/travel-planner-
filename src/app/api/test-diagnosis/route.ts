import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    interface DiagnosisResults {
        timestamp: string;
        keys: Record<string, string>;
        services: Record<string, any>;
    }

    const results: DiagnosisResults = {
        timestamp: new Date().toISOString(),
        keys: {},
        services: {}
    };



    // 1. Check Keys
    const keys = {
        GEMINI: process.env.NEXT_PUBLIC_GEMINI_KEY,
        GEO: process.env.GEOAPIFY_KEY,
        AMADEUS_ID: process.env.AMADEUS_CLIENT_ID,
        AMADEUS_SECRET: process.env.AMADEUS_CLIENT_SECRET,
    };

    results.keys = Object.fromEntries(
        Object.entries(keys).map(([k, v]) => [k, v ? 'OK' : 'MISSING'])
    );

    if (Object.values(keys).some(k => !k)) {
        return NextResponse.json({ error: "Missing Keys", details: results }, { status: 500 });
    }

    // 2. Test Geoapify
    const geoStart = Date.now();
    try {
        const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=Paris&apiKey=${keys.GEO}`);
        const geoData = await geoRes.json();
        results.services.geoapify = {
            status: geoRes.ok ? 'OK' : 'FAILED',
            latency: `${Date.now() - geoStart}ms`,
            sample: geoData.features?.[0]?.properties?.formatted || 'No results'
        };
    } catch (e) {
        results.services.geoapify = { status: 'ERROR', error: e instanceof Error ? e.message : String(e) };
    }


    // 3. Test Amadeus
    const amadeusStart = Date.now();
    try {
        const authRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${keys.AMADEUS_ID}&client_secret=${keys.AMADEUS_SECRET}`
        });
        const authData = await authRes.json();
        results.services.amadeus = {
            status: authData.access_token ? 'OK' : 'FAILED',
            latency: `${Date.now() - amadeusStart}ms`,
            token_received: !!authData.access_token
        };
    } catch (e) {
        results.services.amadeus = { status: 'ERROR', error: e instanceof Error ? e.message : String(e) };
    }


    // 4. Test Gemini
    const geminiStart = Date.now();
    try {
        const genAI = new GoogleGenerativeAI(keys.GEMINI || '');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Return JSON: {"hello": "world"}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        results.services.gemini = {
            status: 'OK',
            latency: `${Date.now() - geminiStart}ms`,
            output_preview: text.substring(0, 50)
        };
    } catch (e) {
        results.services.gemini = { status: 'ERROR', error: e instanceof Error ? e.message : String(e) };
    }


    return NextResponse.json(results);
}
