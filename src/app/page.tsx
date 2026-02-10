'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ItineraryCard from '@/components/ItineraryCard';
import BudgetTracker from '@/components/BudgetTracker';
import { motion } from '@/lib/motion';
import { MapPin, Calendar, ArrowLeft, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen">

        {/* State: Hero / Search */}
        {!tripData && !isLoading && (
          <>
            {error && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-card px-8 py-4 text-red-600 rounded-full flex items-center gap-4">
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="bg-red-100 hover:bg-red-200 p-1 rounded-full px-3 text-xs font-bold"
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
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Loader2 className="w-16 h-16 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Crafting your escape...</h2>
            <p className="text-gray-500">Checking flights, hotels, and hidden gems.</p>
          </div>
        )}

        {/* State: Results (Modernized) */}
        {tripData && !isLoading && (
          <div className="relative min-h-screen bg-gray-50">

            {/* Header / Banner Image */}
            <div className="relative h-[50vh] w-full overflow-hidden">
              {tripData.image ? (
                <img src={tripData.image} className="w-full h-full object-cover" alt="Destination" />
              ) : (
                <div className="w-full h-full bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/20 to-black/40" />

              <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                <button
                  onClick={() => setTripData(null)}
                  className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm uppercase tracking-widest bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Search
                </button>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-6xl md:text-8xl font-serif font-bold text-white mb-2 drop-shadow-xl"
                >
                  {tripData.destination}
                </motion.h1>
                <div className="flex items-center gap-6 text-white/90 text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{tripData.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>Verified Itinerary</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Itinerary Timeline */}
                <div className="lg:col-span-2 space-y-8">
                  {tripData.itinerary?.map((day: any, i: number) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-baseline justify-between mb-8 border-b border-gray-100 pb-4">
                        <h3 className="text-3xl font-serif text-gray-900">Day {day.day}</h3>
                        <span className="text-gray-400 font-medium">Explore & Discover</span>
                      </div>
                      <div className="space-y-6">
                        {day.activities.map((activity: any, idx: number) => (
                          <ItineraryCard key={idx} activity={activity} index={idx} />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Right: Sticky Sidebar */}
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <BudgetTracker totalCost={tripData.totalCost} />

                    <div className="mt-6 bg-gradient-to-br from-primary to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                      <h4 className="font-serif text-xl mb-4 font-bold">Travel Tips</h4>
                      <p className="text-white/90 text-sm leading-relaxed opacity-90">
                        Don't forget to check local visa requirements and enable international payments on your cards.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
