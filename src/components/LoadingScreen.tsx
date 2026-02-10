'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Aurora Background */}
            <div className="absolute inset-0 pointer-events-none aurora-gradient opacity-20" />

            <div className="z-10 text-center mb-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mb-6 inline-block"
                >
                    <Loader2 className="w-16 h-16 text-emerald-400 opacity-80" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
                    Scanning the Globe...
                </h2>
                <p className="text-white/60 text-lg font-light tracking-wide">
                    Curating hidden gems and local secrets just for you.
                </p>
            </div>

            {/* Skeleton Bento Grid */}
            <div className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-12 gap-6 opacity-30">
                {/* Timeline Skeleton */}
                <div className="md:col-span-8 bg-white/5 rounded-[2rem] h-[300px] animate-pulse border border-white/5" />

                {/* Right Column Skeletons */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className="bg-white/5 rounded-[2rem] h-[140px] animate-pulse border border-white/5" />
                    <div className="bg-white/5 rounded-[2rem] h-[140px] animate-pulse border border-white/5" />
                </div>
            </div>

        </div>
    );
}
