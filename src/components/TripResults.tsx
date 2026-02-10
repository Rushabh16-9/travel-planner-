'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Image from 'next/image';
import TimelineTile from './TimelineTile';
import WeatherTile from './WeatherTile';
import BudgetTile from './BudgetTile';
import GalleryTile from './GalleryTile';

interface TripResultsProps {
    tripData: any;
    onBack: () => void;
}

export default function TripResults({ tripData, onBack }: TripResultsProps) {
    return (
        <div className="relative min-h-screen bg-[#020617] pb-24">

            {/* Header / Hero Image */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={tripData.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"}
                        alt={tripData.destination}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
                </motion.div>

                <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-6 z-10">
                    <button
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-bold uppercase tracking-widest bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" /> New Search
                    </button>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-8xl font-serif font-bold text-white mb-2 tracking-tighter"
                    >
                        {tripData.destination}
                    </motion.h1>
                    <p className="text-white/60 text-xl font-light tracking-wide">
                        {tripData.duration} Days • {tripData.itinerary?.length || 0} Experiences
                    </p>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Top Row */}
                    <div className="md:col-span-8">
                        <TimelineTile itinerary={tripData.itinerary} />
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-6">
                        <WeatherTile coordinates={tripData.coordinates} />
                        <BudgetTile totalCost={tripData.totalCost} />
                    </div>

                    {/* Bottom Row */}
                    <div className="md:col-span-12">
                        <GalleryTile destination={tripData.destination} />
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-6 shadow-glow-soft">
                    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </div>
            </div>

        </div>
    );
}
