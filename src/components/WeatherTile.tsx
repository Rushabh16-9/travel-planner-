'use client';

import { motion } from 'framer-motion';
import { CloudSun, Sun, CloudRain } from 'lucide-react';

export default function WeatherTile({ coordinates }: { coordinates: any }) {
    // Mock Forecast for now, integrated with real data later
    const forecast = [
        { day: 'Mon', icon: Sun, temp: 24 },
        { day: 'Tue', icon: CloudSun, temp: 22 },
        { day: 'Wed', icon: CloudRain, temp: 19 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[2rem] p-6 border border-white/5 h-[200px] flex flex-col justify-between"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-lg">Weather Watch</h3>
                    <p className="text-white/50 text-xs uppercase tracking-wider">7-Day Forecast</p>
                </div>
                <Sun className="text-amber-400 w-6 h-6" />
            </div>

            <div className="flex justify-between items-end mt-4">
                {forecast.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                        <span className="text-white/40 text-xs font-bold">{day.day}</span>
                        <day.icon className="w-6 h-6 text-white/80" />
                        <span className="text-white font-medium">{day.temp}°</span>
                    </div>
                ))}
                <div className="text-white/20 text-xs">+4 days</div>
            </div>
        </motion.div>
    );
}
