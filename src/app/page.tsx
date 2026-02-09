'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ItineraryCard from '@/components/ItineraryCard';
import BudgetTracker from '@/components/BudgetTracker';
import { generateTripAction } from './actions';
import { motion } from '@/lib/motion';
import { MapPin, Cloud, Loader2, Calendar, Map } from 'lucide-react';

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
        body: JSON.stringify({ query, days: 3 }), // Default 3 days for now
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate trip');
      } else {
        setTripData(data);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout demoMode={demoMode} onToggleDemoMode={() => setDemoMode(!demoMode)}>
      {!tripData && !isLoading && <Hero onSearch={handleSearch} />}

      {/* Loading State */}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-12 text-center max-w-md"
          >
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Crafting Your Journey</h3>
            <p className="text-white/60">AI is analyzing destinations, weather, and creating your perfect itinerary...</p>
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass rounded-2xl p-8 max-w-md border-red-500/20">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Bento Grid Dashboard */}
      {tripData && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Your AI-Generated Itinerary</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-2">
                {tripData.destination}
              </h2>
              <p className="text-white/60">{tripData.duration} days of adventure</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Hero Image - 8 columns */}
              <div className="lg:col-span-8 h-[400px] glass rounded-2xl overflow-hidden relative group">
                {tripData.image ? (
                  <>
                    <img
                      src={tripData.image}
                      alt={tripData.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="glass rounded-xl p-4 inline-flex items-center gap-3">
                        <Cloud className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-white/60">Current Weather</p>
                          <p className="font-semibold">22°C, Partly Cloudy</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Map className="w-16 h-16 text-white/20" />
                  </div>
                )}
              </div>

              {/* Budget Tracker - 4 columns */}
              <div className="lg:col-span-4">
                <BudgetTracker totalCost={tripData.totalCost} />
              </div>

              {/* Itinerary - 8 columns */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-xl font-semibold">Day-by-Day Plan</h3>
                </div>

                {tripData.itinerary?.map((day: any, dayIndex: number) => (
                  <div key={dayIndex} className="space-y-3">
                    <div className="glass rounded-xl p-4">
                      <h4 className="font-semibold text-emerald-400">Day {day.day}</h4>
                    </div>
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <ItineraryCard
                        key={actIndex}
                        activity={activity}
                        index={actIndex}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Map Placeholder - 4 columns */}
              <div className="lg:col-span-4 h-[400px] glass rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Interactive Map</p>
                  <p className="text-white/20 text-xs">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setTripData(null)}
              className="mt-8 px-6 py-3 glass glass-hover rounded-xl font-medium"
            >
              ← Plan Another Trip
            </button>
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
