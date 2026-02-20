'use client';

import { Activity } from '@/lib/mockData';
import { Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface ItineraryCardProps {
    activity: Activity;
    index: number;
}

export default function ItineraryCard({ activity, index }: ItineraryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                            {activity.type || activity.vibe}
                        </span>
                        {activity.importance === 'High' && (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-red-200">
                                Must-see
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {activity.title || activity.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {activity.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-900 text-sm">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>{typeof activity.price === 'number' ? activity.price : activity.estimatedCost || 0}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
