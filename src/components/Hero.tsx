'use client';

import { useRef } from 'react';
import { Search, MapPin, Calendar, DollarSign } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
    onSearch?: (query: string) => void;
}

const FEATURED_CITIES = [
    {
        name: 'Paris',
        country: 'France',
        query: 'Paris, France, 3 Days',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
        size: 'large',
    },
    {
        name: 'Tokyo',
        country: 'Japan',
        query: 'Tokyo, Japan, 5 Days',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop',
        size: 'small',
    },
    {
        name: 'New York',
        country: 'USA',
        query: 'New York City, USA, 4 Days',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop',
        size: 'small',
    },
    {
        name: 'Santorini',
        country: 'Greece',
        query: 'Santorini, Greece, 5 Days',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4c79e4284?q=80&w=600&auto=format&fit=crop',
        size: 'small',
    },
];

// Stagger container for smooth entry
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 50 }
    },
};

export default function Hero({ onSearch }: HeroProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (query?: string) => {
        if (query) {
            if (onSearch) onSearch(query);
            return;
        }

        const destination = inputRef.current?.value;
        const days = (document.getElementById('days-select') as HTMLSelectElement)?.value;
        const budget = (document.getElementById('budget-select') as HTMLSelectElement)?.value;

        if (onSearch && destination) {
            const finalQuery = `${destination}, ${days} Days, ${budget} Budget`;
            onSearch(finalQuery);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">

            {/* Background Image with optimized layout */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#020617]" />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-6xl px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >

                {/* Heading */}
                <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
                    Wanderlust, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic">Reimagined.</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/80 mb-12 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                    AI-powered itineraries crafted for the modern explorer.
                </motion.p>

                {/* Command Center (Glass Input Grid) */}
                <motion.div variants={itemVariants} className="glass-panel p-2 rounded-[2rem] max-w-5xl mx-auto mb-20 relative overflow-visible">
                    {/* Glow effect behind the panel */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.2rem] blur-xl -z-10" />

                    <div className="bg-black/40 backdrop-blur-xl rounded-[1.8rem] p-6 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                        {/* Destination */}
                        <div className="md:col-span-5 flex flex-col gap-2 text-left">
                            <label className="text-emerald-400/90 text-xs font-bold tracking-[0.2em] ml-2 uppercase">Destination</label>
                            <div className="relative group">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5 transition-transform group-hover:scale-110" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full bg-white/5 text-white pl-12 pr-4 py-4 rounded-2xl font-medium text-lg placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50 transition-all border border-white/5 hover:border-white/20 emerald-glow"
                                    placeholder="Where to next?"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="md:col-span-3 flex flex-col gap-2 text-left">
                            <label className="text-cyan-400/90 text-xs font-bold tracking-[0.2em] ml-2 uppercase">Duration</label>
                            <div className="relative group">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 pointer-events-none" />
                                <select
                                    id="days-select"
                                    defaultValue="5"
                                    className="w-full bg-white/5 text-white pl-12 pr-8 py-4 rounded-2xl font-medium text-lg appearance-none cursor-pointer focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/50 transition-all border border-white/5 hover:border-white/20"
                                >
                                    <option value="3" className="bg-slate-900 text-white">3 Days</option>
                                    <option value="5" className="bg-slate-900 text-white">5 Days</option>
                                    <option value="7" className="bg-slate-900 text-white">7 Days</option>
                                    <option value="10" className="bg-slate-900 text-white">10 Days</option>
                                    <option value="14" className="bg-slate-900 text-white">14 Days</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">▼</div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="md:col-span-4 flex flex-col gap-2 text-left">
                            <label className="text-emerald-400/90 text-xs font-bold tracking-[0.2em] ml-2 uppercase">Budget</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5 pointer-events-none" />
                                <select
                                    id="budget-select"
                                    defaultValue="Moderate"
                                    className="w-full bg-white/5 text-white pl-12 pr-8 py-4 rounded-2xl font-medium text-lg appearance-none cursor-pointer focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-emerald-500/50 transition-all border border-white/5 hover:border-white/20"
                                >
                                    <option value="Cheap" className="bg-slate-900 text-white">Backpacker</option>
                                    <option value="Moderate" className="bg-slate-900 text-white">Moderate</option>
                                    <option value="Luxury" className="bg-slate-900 text-white">Luxury</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">▼</div>
                            </div>
                        </div>

                    </div>

                    {/* Liquid Search Button (Overlapping) */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSearch()}
                            className="w-full liquid-gradient text-white py-5 rounded-2xl font-bold text-xl uppercase tracking-widest shadow-2xl emerald-glow border border-white/20 flex items-center justify-center gap-3 group"
                        >
                            <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            Plan Itinerary
                        </motion.button>
                    </div>
                </motion.div>

                {/* Bento Grid 2.0: Destinations (Masonry) */}
                <motion.div variants={itemVariants} className="pt-8">
                    <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-8 font-semibold">Trending This Week</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto h-[400px]">
                        {FEATURED_CITIES.map((city, idx) => (
                            <motion.button
                                key={city.name}
                                onClick={() => handleSearch(city.query)}
                                className={`relative rounded-3xl overflow-hidden cursor-pointer group border border-white/10 shadow-lg ${city.size === 'large' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Image
                                    src={city.image}
                                    alt={city.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h3 className={`font-serif text-white leading-none mb-1 ${city.size === 'large' ? 'text-4xl' : 'text-xl'}`}>
                                        {city.name}
                                    </h3>
                                    <span className="text-white/60 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                        {city.country}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
