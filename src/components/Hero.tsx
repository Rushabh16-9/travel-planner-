'use client';

import { useRef } from 'react';
import { Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import { motion } from '@/lib/motion';

interface HeroProps {
    onSearch?: (query: string) => void;
}

const FEATURED_CITIES = [
    {
        name: 'Paris',
        country: 'France',
        query: 'Paris, France, 3 Days',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
    },
    {
        name: 'Tokyo',
        country: 'Japan',
        query: 'Tokyo, Japan, 5 Days',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop',
    },
    {
        name: 'New York',
        country: 'USA',
        query: 'New York City, USA, 4 Days',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop',
    },
    {
        name: 'Santorini',
        country: 'Greece',
        query: 'Santorini, Greece, 5 Days',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=600&auto=format&fit=crop',
    },
];

export default function Hero({ onSearch }: HeroProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (query?: string) => {
        // If a pre-defined query (from popular cards) is passed, use it directly
        if (query) {
            if (onSearch) onSearch(query);
            return;
        }

        const destination = inputRef.current?.value;
        const days = (document.getElementById('days-select') as HTMLSelectElement)?.value;
        const budget = (document.getElementById('budget-select') as HTMLSelectElement)?.value;

        if (onSearch && destination) {
            // Construct a natural language query for the AI
            const finalQuery = `${destination}, ${days} Days, ${budget} Budget`;
            onSearch(finalQuery);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* Background Image with Parallax-like fix */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl px-6 pt-20 text-center">

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl"
                >
                    Wanderlust, <span className="text-primary italic">Reimagined.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-xl md:text-2xl text-white/90 mb-12 font-light tracking-wide max-w-2xl mx-auto"
                >
                    Let AI craft your perfect escape in seconds.
                </motion.p>

                {/* Glass Search Form "The Cockpit" */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-dark p-6 rounded-3xl max-w-4xl mx-auto mb-20 shadow-2xl border border-white/10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

                        {/* Destination Input */}
                        <div className="md:col-span-5 flex flex-col gap-2">
                            <label className="text-white/90 text-xs font-bold tracking-[0.2em] ml-1 uppercase">Destination</label>
                            <div className="relative group">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6 transition-colors group-hover:text-primary/80" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full bg-white/95 backdrop-blur-sm text-slate-900 pl-14 pr-4 py-5 rounded-2xl font-bold text-xl placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-xl transition-all hover:bg-white"
                                    placeholder="e.g. Kyoto, Japan"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>

                        {/* Days Input */}
                        {/* Days Input */}
                        <div className="md:col-span-3 flex flex-col gap-2">
                            <label className="text-white/90 text-xs font-bold tracking-[0.2em] ml-1 uppercase">Duration</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6 z-10 pointer-events-none">
                                    <Calendar className="w-full h-full" />
                                </div>
                                <select
                                    id="days-select"
                                    defaultValue="5"
                                    className="w-full bg-white/95 backdrop-blur-sm text-slate-900 pl-14 pr-10 py-5 rounded-2xl font-bold text-xl appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-xl transition-all hover:bg-white"
                                >
                                    <option value="3">3 Days</option>
                                    <option value="5">5 Days</option>
                                    <option value="7">7 Days</option>
                                    <option value="10">10 Days</option>
                                    <option value="14">14 Days</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Budget Input */}
                        <div className="md:col-span-4 flex flex-col gap-2">
                            <label className="text-white/90 text-xs font-bold tracking-[0.2em] ml-1 uppercase">Budget & Vibe</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-primary w-6 h-6 z-10 pointer-events-none" />
                                <select
                                    id="budget-select"
                                    defaultValue="Moderate"
                                    className="w-full bg-white/95 backdrop-blur-sm text-slate-900 pl-14 pr-10 py-5 rounded-2xl font-bold text-xl appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-xl transition-all hover:bg-white"
                                >
                                    <option value="Cheap">Budget (Backpacker)</option>
                                    <option value="Moderate">Moderate (Standard)</option>
                                    <option value="Luxury">Luxury (High End)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-12 mt-2">
                            <button
                                onClick={() => handleSearch()}
                                className="w-full bg-gradient-to-r from-primary via-red-500 to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white py-5 rounded-2xl font-black text-xl tracking-wide uppercase shadow-2xl hover:shadow-primary/50 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                Plan My Ultimate Trip
                            </button>
                        </div>

                    </div>
                </motion.div>

                {/* Popular Destinations (Floating Cards) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-white/70 text-sm tracking-widest uppercase mb-6 font-semibold">Popular Destinations</p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        {FEATURED_CITIES.map((city, idx) => (
                            <button
                                key={city.name}
                                onClick={() => handleSearch(city.query)}
                                className="group relative w-40 h-56 rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-transform hover:-translate-y-2"
                            >
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-4 left-0 right-0 p-2">
                                    <h3 className="text-white font-serif text-lg">{city.name}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
