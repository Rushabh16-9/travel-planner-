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
            className="glass-card-elevated rounded-[2rem] p-6 sm:p-8 h-full min-h-[500px] border border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6 sm:mb-8">The Journey</h2>

            <div className="space-y-4">
                {itinerary?.map((day: any, idx: number) => (
                    <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-white/5 transition-all hover-lift">
                        <button
                            onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-white/5 transition-all focus-ring-inset"
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <span className="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-lg text-xs sm:text-sm uppercase tracking-wider">Day {day.day}</span>
                                <span className="text-white font-medium text-base sm:text-lg">Exploration</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${expandedDay === idx ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {expandedDay === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 space-y-4 border-t border-white/5 relative">
                                        {/* Animated connector line background */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: '100%' }}
                                            transition={{ duration: 0.8, ease: "easeInOut" }}
                                            className="absolute left-[2.25rem] top-0 w-px bg-gradient-to-b from-emerald-500/50 to-transparent z-0"
                                        />

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
                                                        whileHover={{ scale: 1.5, borderColor: "rgba(16, 185, 129, 0.8)" }}
                                                        className="w-3 h-3 rounded-full bg-black border-2 border-emerald-500 mt-2 z-10 box-border transition-colors"
                                                    />
                                                </div>
                                                <div className="pb-4 group-hover/activity:translate-x-1 transition-transform duration-300">
                                                    <div className="flex items-center gap-3 text-white/50 text-xs mb-1">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> {act.time}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {act.price ? `$${act.price}` : 'Free'}</span>
                                                    </div>
                                                    <h4 className="text-white font-medium mb-1 group-hover/activity:text-emerald-300 transition-colors">{act.title}</h4>
                                                    <p className="text-white/60 text-sm leading-relaxed">{act.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
