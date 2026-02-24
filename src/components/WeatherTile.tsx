'use client';

import { CloudSun, Sun, CloudRain, Cloud } from 'lucide-react';

export default function WeatherTile() {
    // Extended 7-day forecast mock
    const forecast = [
        { day: 'Mon', icon: Sun, temp: 24, color: 'text-amber-500' },
        { day: 'Tue', icon: CloudSun, temp: 22, color: 'text-amber-500' },
        { day: 'Wed', icon: CloudRain, temp: 19, color: 'text-blue-500' },
        { day: 'Thu', icon: Cloud, temp: 18, color: 'text-slate-500' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                Local Weather
            </h3>

            <div className="grid grid-cols-4 gap-2">
                {forecast.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="text-xs font-bold text-slate-400 uppercase mb-2">{day.day}</span>
                        <day.icon className={`w-6 h-6 mb-2 ${day.color}`} />
                        <span className="text-sm font-bold text-slate-700">{day.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
