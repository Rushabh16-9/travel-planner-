'use client';

import { useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
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
        const finalQuery = query || inputRef.current?.value;
        if (onSearch && finalQuery) {
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

                {/* Glass Search Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-dark p-2 rounded-full max-w-2xl mx-auto flex items-center mb-20"
                >
                    <div className="pl-6 text-white/50">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent text-white px-4 py-4 text-lg placeholder:text-white/50 focus:outline-none"
                        placeholder="Where do you want to go? (e.g., Bali)"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={() => handleSearch()}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/50"
                    >
                        Plan Trip
                    </button>
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
