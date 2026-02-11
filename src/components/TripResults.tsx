'use client';

import { motion, Variants } from 'framer-motion';
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

// Stagger animation variants for Bento Grid
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
};

export default function TripResults({ tripData, onBack }: TripResultsProps) {
    return (
        <motion.div 
            className="relative min-h-screen bg-white pb-24"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >

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
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
                    {/* Gradient Mesh Overlay */}
                    <div className="absolute inset-0 gradient-mesh" />
                </motion.div>

                <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-6 z-10">
                    <motion.button
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 text-emerald-600 transition-all text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:scale-105 focus-ring btn-ghost hover-lift"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <ArrowLeft className="w-4 h-4" /> New Search
                    </motion.button>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-2 bg-gradient-to-b from-slate-800 to-slate-500 bg-clip-text text-transparent"
                    >
                        {tripData.destination}
                    </motion.h1>
                    <motion.p 
                        className="text-slate-500 text-lg sm:text-xl font-light tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {tripData.duration} Days • {tripData.itinerary?.length || 0} Experiences
                    </motion.p>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <motion.div 
                className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-20"
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 perspective-1000">

                    {/* Top Row - Timeline */}
                    <motion.div
                        className="md:col-span-8 glass-card-elevated rounded-3xl overflow-hidden group relative border border-slate-200 hover:border-emerald-500/30 transition-colors duration-300"
                        variants={itemVariants}
                        whileHover={{ y: -5, rotateX: 2, rotateY: 2, scale: 1.01 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <TimelineTile itinerary={tripData.itinerary} />
                    </motion.div>

                    {/* Right Column - Weather & Budget */}
                    <div className="md:col-span-4 flex flex-col gap-6 sm:gap-8">
                        <motion.div
                            className="glass-card-elevated rounded-3xl overflow-hidden group relative border border-slate-200 hover:border-cyan-500/30 transition-colors duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -5, rotateX: 2, rotateY: -2, scale: 1.02 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <WeatherTile coordinates={tripData.coordinates} />
                        </motion.div>
                        <motion.div
                            className="glass-card-elevated rounded-3xl overflow-hidden group relative border border-slate-200 hover:border-emerald-500/30 transition-colors duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -5, rotateX: 2, rotateY: -2, scale: 1.02 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <BudgetTile totalCost={tripData.totalCost} />
                        </motion.div>
                    </div>

                    {/* Bottom Row - Gallery */}
                    <motion.div
                        className="md:col-span-12 glass-card-elevated rounded-3xl overflow-hidden group relative border border-slate-200 hover:border-emerald-500/30 transition-colors duration-300"
                        variants={itemVariants}
                        whileHover={{ y: -5, scale: 1.005 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <GalleryTile destination={tripData.destination} />
                    </motion.div>
                </div>
            </motion.div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
                <motion.div
                    className="glass-dark-premium px-6 py-4 rounded-full flex items-center justify-center gap-6 shadow-xl border border-slate-200"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 30 }}
                >
                    <button className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-all text-sm font-medium hover:scale-110 focus-ring-inset rounded-full px-4 py-2 btn-ghost">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                    <div className="w-px h-5 bg-slate-200" />
                    <button className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-all text-sm font-medium hover:scale-110 focus-ring-inset rounded-full px-4 py-2 btn-ghost">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                </motion.div>
            </div>

        </motion.div>
    );
}
