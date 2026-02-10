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
            className="glass-card rounded-[2rem] p-8 h-full min-h-[500px] border border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
            <h2 className="text-3xl font-serif font-bold text-white mb-8">The Journey</h2>

            <div className="space-y-4">
                {itinerary?.map((day: any, idx: number) => (
                    <div key={idx} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                        <button
                            onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <div className="flex items-center gap-4">
                                <span className="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-lg text-sm uppercase tracking-wider">Day {day.day}</span>
                                <span className="text-white font-medium text-lg">Exploration</span>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${expandedDay === idx ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {expandedDay === idx && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 space-y-4 border-t border-white/5">
                                        {day.activities.map((act: any, actIdx: number) => (
                                            <div key={actIdx} className="flex gap-4 group">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                                                    <div className="w-px h-full bg-white/10 group-last:hidden" />
                                                </div>
                                                <div className="pb-4">
                                                    <div className="flex items-center gap-3 text-white/50 text-xs mb-1">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.time}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {act.price ? `$${act.price}` : 'Free'}</span>
                                                    </div>
                                                    <h4 className="text-white font-medium mb-1">{act.title}</h4>
                                                    <p className="text-white/60 text-sm leading-relaxed">{act.description}</p>
                                                </div>
                                            </div>
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
