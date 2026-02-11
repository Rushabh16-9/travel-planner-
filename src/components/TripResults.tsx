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
                    {/* Gradient Mesh Overlay */}
                    <div className="absolute inset-0 gradient-mesh" />
                </motion.div>

                <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-6 z-10">
                    <button
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 text-emerald-200 transition-all text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:scale-105 focus-ring btn-ghost hover-lift"
                    >
                        <ArrowLeft className="w-4 h-4" /> New Search
                    </button>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-white mb-2 tracking-tighter"
                    >
                        {tripData.destination}
                    </motion.h1>
                    <p className="text-white/60 text-lg sm:text-xl font-light tracking-wide">
                        {tripData.duration} Days • {tripData.itinerary?.length || 0} Experiences
                    </p>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 perspective-1000">

                    {/* Top Row */}
                    <motion.div
                        className="md:col-span-8 glass-card-elevated rounded-3xl overflow-hidden group relative hover-lift"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5, rotateX: 2, rotateY: 2, scale: 1.01 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <TimelineTile itinerary={tripData.itinerary} />
                    </motion.div>

                    <div className="md:col-span-4 flex flex-col gap-6 sm:gap-8">
                        <motion.div
                            className="glass-card-elevated rounded-3xl overflow-hidden group relative hover-lift"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -5, rotateX: 2, rotateY: -2, scale: 1.02 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <WeatherTile coordinates={tripData.coordinates} />
                        </motion.div>
                        <motion.div
                            className="glass-card-elevated rounded-3xl overflow-hidden group relative hover-lift"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -5, rotateX: 2, rotateY: -2, scale: 1.02 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <BudgetTile totalCost={tripData.totalCost} />
                        </motion.div>
                    </div>

                    {/* Bottom Row */}
                    <motion.div
                        className="md:col-span-12 glass-card-elevated rounded-3xl overflow-hidden group relative hover-lift"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ y: -5, scale: 1.005 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <GalleryTile destination={tripData.destination} />
                    </motion.div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
                <motion.div
                    className="glass-dark-premium px-6 py-3 rounded-full flex items-center justify-center gap-6 glow-emerald-soft hover-lift"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
                >
                    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-all text-sm font-medium hover:scale-110 focus-ring-inset rounded-full px-3 py-1 btn-ghost">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                    <div className="w-px h-4 bg-white/10" />
                    <button className="flex items-center gap-2 text-white/80 hover:text-white transition-all text-sm font-medium hover:scale-110 focus-ring-inset rounded-full px-3 py-1 btn-ghost">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </motion.div>
            </div>

        </div>
    );
}
