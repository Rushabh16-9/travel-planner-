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
      <div className="min-h-screen bg-[#020617] text-white">

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
        {isLoading && (
          <div className="min-h-screen flex flex-col items-center justify-center aurora-gradient">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Loader2 className="w-20 h-20 text-white opacity-80" />
            </motion.div>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Dreaming up your trip...</h2>
            <p className="text-white/60 text-lg">AI is finding the best spots for you.</p>
          </div>
        )}

        {/* State: Results (Bento Grid) */}
        {tripData && !isLoading && (
          <div className="relative min-h-screen pb-20">

            {/* Header / Banner Image */}
            <div className="relative h-[60vh] w-full overflow-hidden">
              {tripData.image ? (
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 2 }}
                  src={tripData.image}
                  className="w-full h-full object-cover"
                  alt="Destination"
                />
              ) : (
                <div className="w-full h-full bg-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#020617]" />

              <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-6">
                <button
                  onClick={() => setTripData(null)}
                  className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-2 rounded-full w-fit hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4" /> New Search
                </button>
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-7xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 mb-6"
                >
                  {tripData.destination}
                </motion.h1>
                <div className="flex flex-wrap items-center gap-8 text-white/90 text-xl font-light">
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Calendar className="w-6 h-6 text-primary" />
                    <span>{tripData.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span>Curated Itinerary</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left: Itinerary (Bento Grid) */}
                <div className="lg:col-span-3 space-y-12">
                  {tripData.itinerary?.map((day: any, dayIdx: number) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dayIdx * 0.1 }}
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl font-serif border border-primary/30">
                          {day.day}
                        </div>
                        <h3 className="text-3xl font-serif text-white">Day {day.day}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {day.activities.map((activity: any, idx: number) => {
                          // Bento Logic: Every 3rd item spans 2 columns
                          const isWide = (idx % 3 === 0);
                          return (
                            <div key={idx} className={`${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}>
                              <ItineraryCard activity={activity} index={idx} />
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Right: Sticky Sidebar */}
                <div className="space-y-6">
                  <div className="sticky top-24 space-y-6">
                    <BudgetTracker totalCost={tripData.totalCost} />

                    <div className="aurora-gradient rounded-3xl p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                      <div className="relative z-10">
                        <h4 className="font-serif text-2xl mb-4 font-bold">Pro Tips</h4>
                        <p className="text-white/80 leading-relaxed font-light">
                          Ensure you have offline maps downloaded. The best experiences are often found when you get a little lost.
                        </p>
                      </div>
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
