export async function getAmadeusToken() {
    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.warn("Amadeus Credentials Missing");
        return null;
    }

    try {
        const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
        });

        if (!res.ok) throw new Error("Failed to fetch Amadeus token");
        const data = await res.json();
        return data.access_token;
    } catch (error) {
        console.error("Amadeus Token Error:", error);
        return null;
    }
}

export async function getAmadeusData(lat: number, lon: number) {
    const token = await getAmadeusToken();
    if (!token) return null;

    try {
        // Fetch Points of Interest (Activities)
        const res = await fetch(
            `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${lat}&longitude=${lon}&radius=5&page[limit]=5`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!res.ok) return null;
        const data = await res.json();
        return data.data; // List of POIs
    } catch (error) {
        console.error("Amadeus Data Error:", error);
        return null;
    }
}
