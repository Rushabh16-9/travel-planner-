import { Activity } from '@/lib/mockData';
import { Clock, DollarSign } from 'lucide-react';
import { motion } from '@/lib/motion';

interface ItineraryCardProps {
    activity: Activity;
    index: number;
}

const getTypeColor = (type?: string) => {
    const typeMap: Record<string, string> = {
        'Adventure': 'bg-orange-100 text-orange-700 border-orange-200',
        'relax': 'bg-blue-100 text-blue-700 border-blue-200',
        'Chill': 'bg-blue-100 text-blue-700 border-blue-200',
        'food': 'bg-green-100 text-green-700 border-green-200',
        'Foodie': 'bg-green-100 text-green-700 border-green-200',
        'culture': 'bg-purple-100 text-purple-700 border-purple-200',
        'Culture': 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return typeMap[type || ''] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function ItineraryCard({ activity, index }: ItineraryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-6 card-shadow hover:card-shadow-lg transition-smooth border border-gray-100"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(activity.type || activity.vibe)}`}>
                            {activity.type || activity.vibe}
                        </span>
                        {activity.importance === 'High' && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                                Must-see
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {activity.title || activity.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        {activity.description}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                        {typeof activity.price === 'number' ? `$${activity.price}` : `$${activity.estimatedCost || 0}`}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
