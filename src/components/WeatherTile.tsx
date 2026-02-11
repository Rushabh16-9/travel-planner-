'use client';

import { motion } from 'framer-motion';
import { CloudSun, Sun, CloudRain, Cloud, Snowflake, Wind, Droplets } from 'lucide-react';

export default function WeatherTile({ coordinates }: { coordinates: any }) {
    // Extended 7-day forecast
    const forecast = [
        { day: 'Mon', icon: Sun, temp: 24, color: 'text-amber-400' },
        { day: 'Tue', icon: CloudSun, temp: 22, color: 'text-orange-300' },
        { day: 'Wed', icon: CloudRain, temp: 19, color: 'text-blue-400' },
        { day: 'Thu', icon: Cloud, temp: 18, color: 'text-slate-400' },
        { day: 'Fri', icon: Sun, temp: 25, color: 'text-amber-400' },
        { day: 'Sat', icon: CloudSun, temp: 23, color: 'text-orange-300' },
        { day: 'Sun', icon: Sun, temp: 26, color: 'text-amber-400' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card-elevated rounded-[2rem] p-6 h-[220px] flex flex-col justify-between group relative overflow-hidden"
        >
            {/* Frosted glass accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl" />
            
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-slate-800 font-extrabold text-lg tracking-tight">Weather Watch</h3>
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">7-Day Forecast</p>
                </div>
                <div className="relative">
                    <Sun className="text-amber-400 w-7 h-7 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-amber-400/30 blur-lg" />
                </div>
            </div>

            <div className="flex justify-between items-end mt-4 relative z-10">
                {forecast.map((day, idx) => (
                    <motion.div 
                        key={idx} 
                        className="flex flex-col items-center gap-1.5 group/day"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <span className="text-slate-400 text-[10px] font-bold uppercase">{day.day}</span>
                        <day.icon className={`w-5 h-5 ${day.color} transition-transform group-hover/day:scale-110`} />
                        <span className="text-slate-700 font-semibold text-sm">{day.temp}°</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
