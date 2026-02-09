export async function getDestinationImage(query: string) {
    const apiKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!apiKey) {
        console.warn("Unsplash API Key missing");
        return null;
    }

    const url = `https://api.unsplash.com/search/photos?page=1&per_page=1&orientation=landscape&query=${encodeURIComponent(query)}&client_id=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Unsplash Fetch Failed");

        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular; // Use 'regular' size for balance
        }
        return null;
    } catch (error) {
        console.error("Unsplash Error:", error);
        return null;
    }
}
