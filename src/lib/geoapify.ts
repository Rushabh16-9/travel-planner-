export async function getCoordinates(location: string) {
    const apiKey = process.env.GEOAPIFY_KEY;
    if (!apiKey) throw new Error("GEOAPIFY_KEY is not set");

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch coordinates");

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
