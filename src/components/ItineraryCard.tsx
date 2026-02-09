import { Activity } from '@/lib/mockData';
import { Clock, MapPin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/lib/motion';

interface ItineraryCardProps {
    activity: Activity;
    index: number;
}

export default function ItineraryCard({ activity, index }: ItineraryCardProps) {
    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            adventure: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            food: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
            culture: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
            relax: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        };
        return colors[type.toLowerCase()] || 'text-white/60 bg-white/5 border-white/10';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass glass-hover rounded-2xl p-6 group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 font-bold">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {activity.title || activity.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{activity.time}</span>
                        </div>
                    </div>
                </div>

                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    getTypeColor(activity.type || activity.vibe || 'default')
                )}>
                    {activity.type || activity.vibe}
                </span>
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-4">
                {activity.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/80">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">{activity.price || activity.estimatedCost}</span>
                </div>

                <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                i <= (activity.importance === 'High' ? 3 : activity.importance === 'Medium' ? 2 : 1)
                                    ? "bg-emerald-400"
                                    : "bg-white/20"
                            )}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
