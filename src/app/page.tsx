'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Hero, { SearchParams } from '@/components/Hero';
import TripResults from '@/components/TripResults';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [tripData, setTripData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (params: SearchParams) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: params.destination,
                    origin: params.origin,
                    days: params.nights,
                    fromDate: params.fromDate,
                    toDate: params.toDate,
                    guests: params.guests,
                    currency: params.currency,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unexpected error');
            setTripData({ ...data, guests: params.guests, currency: params.currency });
        } catch {
            setError('Could not plan your trip. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            {/* Error toast */}
            {error && (
                <div style={{
                    position: 'fixed', top: '5.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 200,
                    background: 'white', border: '1px solid rgba(255,107,107,0.3)', borderLeft: '4px solid #FF6B6B',
                    borderRadius: '0.75rem', padding: '0.875rem 1.25rem',
                    boxShadow: '0 8px 32px rgba(26,35,64,0.14)',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    maxWidth: '480px', width: '90vw',
                }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#1A2340', fontWeight: 500, flex: 1 }}>
                        {error}
                    </p>
                    <button
                        onClick={() => setError(null)}
                        style={{ background: 'rgba(255,107,107,0.1)', border: 'none', borderRadius: '100px', padding: '0.25rem 0.75rem', color: '#FF6B6B', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer' }}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {!tripData && !isLoading && <Hero onSearch={handleSearch} />}
            {isLoading && <LoadingScreen />}
            {tripData && !isLoading && (
                <TripResults tripData={tripData} onBack={() => setTripData(null)} />
            )}
        </Layout>
    );
}
