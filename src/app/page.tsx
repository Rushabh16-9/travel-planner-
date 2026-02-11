'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import TripResults from '@/components/TripResults';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (destination: string, days: number, budget?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Use destination as the query for geocoding purposes
      const response = await fetch('/api/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setTripData(data);
    } catch (err) {
      setError('Failed to plan trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white text-slate-900">

        {/* State: Hero / Search */}
        {!tripData && !isLoading && (
          <>
            {error && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-dark px-8 py-4 text-red-300 rounded-full flex items-center gap-4 border border-red-500/30">
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="bg-red-500/20 hover:bg-red-500/30 p-1 rounded-full px-3 text-xs font-bold text-red-200"
                >
                  Dismiss
                </button>
              </div>
            )}
            <Hero onSearch={handleSearch} />
          </>
        )}

        {/* State: Loading */}
        {isLoading && <LoadingScreen />}

        {/* State: Results (Bento Grid) */}
        {tripData && !isLoading && (
          <TripResults
            tripData={tripData}
            onBack={() => setTripData(null)}
          />
        )}
      </div>
    </Layout>
  );
}
