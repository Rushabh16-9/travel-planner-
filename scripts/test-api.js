
async function test() {
    console.log('Testing http://localhost:3005/api/trip...');
    try {
        const res = await fetch('http://localhost:3005/api/trip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destination: 'Rome',
                days: 4,
                budget: 'USD 3000'
            })
        });

        if (!res.ok) {
            console.error('Status:', res.status, res.statusText);
            const text = await res.text();
            console.error('Body:', text);
            return;
        }

        const data = await res.json();
        console.log('✅ Success!');
        console.log('Destination:', data.destination);
        console.log('Total Cost:', data.totalCost);
        console.log('Currency:', data.currency);
        console.log('Itinerary Items:', data.itinerary?.length);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
