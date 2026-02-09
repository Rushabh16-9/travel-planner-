'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ItineraryCard from '@/components/ItineraryCard';
import BudgetTracker from '@/components/BudgetTracker';
import { motion } from '@/lib/motion';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [demoMode, setDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, days: 3 }),
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
    <Layout demoMode={demoMode} onToggleDemoMode={() => setDemoMode(!demoMode)}>
      <div className="min-h-screen pb-20">

        {/* State: Hero / Search */}
        {!tripData && !isLoading && (
          <>
            {error && (
              <div className="max-w-md mx-auto mt-6 mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            )}
            <Hero onSearch={handleSearch} />
          </>
        )}

        {/* State: Loading */}
        {isLoading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating your itinerary</h2>
            <p className="text-gray-600">This may take a few seconds...</p>
          </div>
        )}

        {/* State: Results */}
        {tripData && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-24 px-6 max-w-5xl mx-auto"
          >
            <button
              onClick={() => setTripData(null)}
              className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-sm uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </button>

            {/* Destination Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-end">
              <div>
                <h1 className="text-6xl md:text-7xl font-serif text-white mb-4 leading-none">
                  {tripData.destination}
                </h1>
                <div className="flex items-center gap-6 text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{tripData.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Europe</span>
                  </div>
                </div>
              </div>

              {tripData.image && (
                <div className="h-[300px] rounded-2xl overflow-hidden relative shadow-2xl">
                  <img src={tripData.image} className="w-full h-full object-cover grayscale-[0.2]" alt="Destination" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1121] to-transparent opacity-60" />
                </div>
              )}
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left: Itinerary (2 cols) */}
              <div className="lg:col-span-2 space-y-12">
                {tripData.itinerary?.map((day: any) => (
                  <div key={day.day}>
                    <h3 className="text-2xl font-serif text-white mb-6 border-l-2 border-white/20 pl-4">
                      Day {day.day}
                    </h3>
                    <div className="space-y-4">
                      {day.activities.map((activity: any, i: number) => (
                        <ItineraryCard key={i} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Budget & Summary (1 col) */}
              <div className="space-y-6">
                <div className="sticky top-24">
                  <BudgetTracker totalCost={tripData.totalCost} />

                  <div className="mt-8 p-6 glass-panel rounded-xl">
                    <h4 className="font-serif text-lg mb-4">Travel Notes</h4>
                    <p className="text-white/40 text-sm leading-relaxed">
                      This itinerary is optimized for a balanced mix of culture and relaxation.
                      Weather conditions are favorable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
