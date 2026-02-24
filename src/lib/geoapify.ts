export async function getCoordinates(location: string) {
    const apiKey = process.env.GEOAPIFY_KEY;
    if (!apiKey) { console.warn("GEOAPIFY_KEY is not set — skipping geocoding"); return null; }

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Geoapify Failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Geoapify Response:", text);
            throw new Error(`Failed to fetch coordinates: ${response.status}`);
        }

        const data = await response.json();
        if (!data.features || data.features.length === 0) {
            return null;
        }

        const { lat, lon } = data.features[0].properties;
        return { lat, lon, formatted: data.features[0].properties.formatted };
    } catch (error) {
        console.error("Geoapify Error:", error);
        return null;
    }
}
