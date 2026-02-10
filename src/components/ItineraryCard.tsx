import { Activity } from '@/lib/mockData';
import { Clock, DollarSign } from 'lucide-react';
import { motion } from '@/lib/motion';

interface ItineraryCardProps {
    activity: Activity;
    index: number;
}

const getTypeColor = (type?: string) => {
    // Simplified for Dark Mode: All use white/glass variants
    return 'bg-white/10 text-white/90 border-white/20';
};

export default function ItineraryCard({ activity, index }: ItineraryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-dark rounded-2xl p-6 transition-smooth hover:bg-white/5 border border-white/10 h-full flex flex-col justify-between"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(activity.type || activity.vibe)} backdrop-blur-sm`}>
                            {activity.type || activity.vibe}
                        </span>
                        {activity.importance === 'High' && (
                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded border border-primary/30">
                                Must-see
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {activity.title || activity.name}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                        {activity.description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/50 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-white">
                        {typeof activity.price === 'number' ? `$${activity.price}` : `$${activity.estimatedCost || 0}`}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
        </motion.div >
    );
}
