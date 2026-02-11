'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Clock, MapPin } from 'lucide-react';

export default function TimelineTile({ itinerary }: { itinerary: any[] }) {
    const [expandedDay, setExpandedDay] = useState<number | null>(0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated rounded-[2rem] p-6 sm:p-8 h-full min-h-[500px] relative overflow-hidden"
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 sm:mb-8">The Journey</h2>

            {/* Timeline container with glowing vertical line */}
            <div className="relative pl-6">
                {/* Glowing vertical timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500/80 via-emerald-500/40 to-transparent rounded-full">
                    <div className="absolute inset-0 bg-emerald-500/50 blur-sm" />
                    <div className="absolute inset-0 bg-emerald-400/30 blur-md" />
                </div>

                <div className="space-y-4">
                    {itinerary?.map((day: any, idx: number) => (
                        <div key={idx} className="relative">
                            {/* Timeline dot */}
                            <motion.div 
                                className="absolute -left-6 top-5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white z-10"
                                whileHover={{ scale: 1.5 }}
                                style={{
                                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.4)'
                                }}
                            />
                            
                            <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500/30 transition-all duration-300">
                                <button
                                    onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-slate-50 transition-all focus-ring-inset"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <span className="bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1.5 rounded-lg text-xs sm:text-sm uppercase tracking-wider border border-emerald-500/20">Day {day.day}</span>
                                        <span className="text-slate-800 font-medium text-base sm:text-lg">Exploration</span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expandedDay === idx ? 'rotate-180 text-emerald-500' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedDay === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 space-y-4 border-t border-slate-200 relative">
                                                {/* Inner timeline line for activities */}
                                                <div className="absolute left-[2.25rem] top-4 bottom-4 w-[1px] bg-gradient-to-b from-emerald-500/30 via-emerald-500/20 to-transparent" />

                                                {day.activities.map((act: any, actIdx: number) => (
                                                    <motion.div
                                                        key={actIdx}
                                                        className="flex gap-4 group/activity relative z-10"
                                                        initial={{ x: -10, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: actIdx * 0.1 }}
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <motion.div
                                                                whileHover={{ scale: 1.5, boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' }}
                                                                className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 mt-2 z-10 transition-all"
                                                            />
                                                        </div>
                                                        <div className="pb-4 group-hover/activity:translate-x-1 transition-transform duration-300">
                                                            <div className="flex items-center gap-3 text-slate-400 text-xs mb-1.5">
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-500" /> {act.time}</span>
                                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-500" /> {act.price ? `$${act.price}` : 'Free'}</span>
                                                            </div>
                                                            <h4 className="text-slate-800 font-medium mb-1 group-hover/activity:text-emerald-600 transition-colors">{act.title}</h4>
                                                            <p className="text-slate-500 text-sm leading-relaxed">{act.description}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
