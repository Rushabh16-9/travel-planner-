import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testAPI() {
    console.log('🚀 Starting API Diagnosis...');

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
        return;
    }

    // 2. Test Geoapify
    console.log('\n🌍 Testing Geoapify (Paris)...');
    const geoStart = Date.now();
    let lat = 0, lon = 0, formatted = '';
    try {
        const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=Paris&apiKey=${keys.GEO}`);
        const geoData = await geoRes.json();
        if (geoData.features?.length > 0) {
            lat = geoData.features[0].properties.lat;
            lon = geoData.features[0].properties.lon;
            formatted = geoData.features[0].properties.formatted;
            console.log(`✅ Geo Success: ${formatted} (${lat}, ${lon}) in ${Date.now() - geoStart}ms`);
        } else {
            console.error('❌ Geo Failed: No results');
        }
    } catch (e) {
        console.error('❌ Geo Error:', e);
    }

    // 3. Test Amadeus
    console.log('\n🏨 Testing Amadeus Auth...');
    const amadeusStart = Date.now();
    let amadeusToken = '';
    try {
        const authRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${keys.AMADEUS_ID}&client_secret=${keys.AMADEUS_SECRET}`
        });
        const authData = await authRes.json();
        if (authData.access_token) {
            amadeusToken = authData.access_token;
            console.log(`✅ Amadeus Auth Success in ${Date.now() - amadeusStart}ms`);
        } else {
            console.error('❌ Amadeus Auth Failed:', authData);
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

        const prompt = `Create a 3-day trip itinerary for "Paris". Return ONLY valid JSON.
{
  "destination": "Paris",
  "itinerary": []
}
Keep it short.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`✅ Gemini Response received in ${Date.now() - geminiStart}ms`);
        console.log('Preview:', text.substring(0, 100) + '...');

        // Parse Check
        try {
            const json = JSON.parse(text.replace(/```json|```/g, '').trim());
            console.log('✅ JSON Valid');
        } catch (e) {
            console.error('❌ JSON Parse Failed:', e);
        }

    } catch (e) {
        console.error('❌ Gemini Error:', e);
    }

    console.log('\n🏁 Diagnosis Complete');
}

testAPI();
