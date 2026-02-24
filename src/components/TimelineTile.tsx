'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Clock, MapPin } from 'lucide-react';

interface Activity {
    time: string;
    price?: number;
    title: string;
    description: string;
}

interface ItineraryDay {
    day: number;
    title?: string;
    activities: Activity[];
}

export default function TimelineTile({ itinerary }: { itinerary: ItineraryDay[] }) {
    const [expandedDay, setExpandedDay] = useState<number | null>(0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full" />
                Trip Itinerary
            </h2>

            <div className="space-y-4">
                {itinerary?.map((day: ItineraryDay, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-md text-sm">
                                    Day {day.day}
                                </span>
                                <span className="text-slate-700 font-semibold">
                                    {day.title || `Day ${day.day} Exploration`}
                                </span>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-slate-500 transition-transform ${expandedDay === idx ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <AnimatePresence>
                            {expandedDay === idx && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden bg-white"
                                >
                                    <div className="p-4 space-y-6 relative ml-4 border-l-2 border-slate-100">
                                        {day.activities.map((act: Activity, actIdx: number) => (
                                            <div key={actIdx} className="relative pl-6">
                                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />

                                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {act.time}
                                                    </span>
                                                    {act.price && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> ${act.price}
                                                        </span>
                                                    )}
                                                </div>

                                                <h4 className="text-sm font-bold text-slate-900 mb-1">
                                                    {act.title}
                                                </h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                    {act.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
