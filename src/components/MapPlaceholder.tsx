'use client';

import { MapPin } from 'lucide-react';

export default function MapPlaceholder() {
    return (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-center p-4 relative">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-slate-300">Interactive Map</p>
            <p className="text-xs text-slate-500">Coming Soon</p>
        </div>
    );
}
