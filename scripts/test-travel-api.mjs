import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Manually load env since dotenv might behave differently in ESM
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function testAPI() {
    console.log('🚀 Starting API Diagnosis (ESM)...');

    // 1. Check Keys
    const keys = {
        GEMINI: process.env.NEXT_PUBLIC_GEMINI_KEY,
        GEO: process.env.GEOAPIFY_KEY,
        AMADEUS_ID: process.env.AMADEUS_CLIENT_ID,
        AMADEUS_SECRET: process.env.AMADEUS_CLIENT_SECRET,
    };

    console.log('🔑 Key Check:', Object.entries(keys).map(([k, v]) => `${k}: ${v ? 'OK' : 'MISSING'}`).join(', '));

    if (Object.values(keys).some(k => !k)) {
        console.error('❌ Missing API Keys! Check .env.local');
        // Proceed anyway to see what fails
    }

    // 2. Test Geoapify
    console.log('\n🌍 Testing Geoapify (Paris)...');
    const geoStart = Date.now();
    try {
        const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=Paris&apiKey=${keys.GEO}`);
        const geoData = await geoRes.json();
        if (geoData.features?.length > 0) {
            console.log(`✅ Geo Success: ${geoData.features[0].properties.formatted} in ${Date.now() - geoStart}ms`);
        } else {
            console.error('❌ Geo Failed: No results');
        }
    } catch (e) {
        console.error('❌ Geo Error:', e);
    }

    // 3. Test Amadeus
    console.log('\n🏨 Testing Amadeus Auth...');
    const amadeusStart = Date.now();
    try {
        const authRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${keys.AMADEUS_ID}&client_secret=${keys.AMADEUS_SECRET}`
        });
        const authData = await authRes.json();
        if (authData.access_token) {
            console.log(`✅ Amadeus Auth Success in ${Date.now() - amadeusStart}ms`);
        } else {
            console.error('❌ Amadeus Auth Failed:', JSON.stringify(authData));
        }
    } catch (e) {
        console.error('❌ Amadeus Error:', e);
    }

    // 4. Test Gemini
    console.log('\n🤖 Testing Gemini Generation...');
    const geminiStart = Date.now();
    try {
        const genAI = new GoogleGenerativeAI(keys.GEMINI || '');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Use the EXACT simplified prompt from route.ts
        const prompt = `Create a 3-day trip itinerary for "Paris".
Return ONLY valid JSON (no markdown, no text):
{
  "destination": "Paris",
  "itinerary": []
}
Include 3 days.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`✅ Gemini Response received in ${Date.now() - geminiStart}ms`);

        // Parse Check
        try {
            const cleanJson = text.replace(/```json|```/g, '').trim();
            JSON.parse(cleanJson);
            console.log('✅ JSON Parse Success');
        } catch (e) {
            console.error('❌ JSON Parse Failed:', e.message);
            console.log('Preview:', text.substring(0, 100));
        }

    } catch (e) {
        console.error('❌ Gemini Error:', e);
    }

    console.log('\n🏁 Diagnosis Complete');
}

testAPI();
