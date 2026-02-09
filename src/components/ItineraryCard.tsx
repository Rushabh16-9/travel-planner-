import { Activity } from '@/lib/mockData';
import { Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/lib/motion';

interface ItineraryCardProps {
    activity: Activity;
    index: number;
}

export default function ItineraryCard({ activity, index }: ItineraryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-6 mb-4 flex flex-col md:flex-row gap-6 items-start md:items-center group"
        >
            {/* Time & Indicator */}
            <div className="flex-shrink-0 flex md:flex-col items-center gap-4 md:w-24 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 border-white/5">
                <span className="font-serif text-2xl text-white/20 font-bold group-hover:text-white transition-colors">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                        "text-[10px] uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 text-white/60 border border-white/5",
                    )}>
                        {activity.type || activity.vibe}
                    </span>
                </div>
                <h3 className="text-xl font-serif text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {activity.title || activity.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                    {activity.description}
                </p>
            </div>

            {/* Meta/Price */}
            <div className="flex-shrink-0 flex items-center md:flex-col gap-2 md:items-end pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0">
                <span className="text-lg font-medium text-white">
                    {typeof activity.price === 'number' ? `$${activity.price}` : activity.estimatedCost}
                </span>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={cn("w-1 h-1 rounded-full", i <= (activity.importance === 'High' ? 3 : 2) ? "bg-white" : "bg-white/20")} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
