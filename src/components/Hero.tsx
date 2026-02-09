'use client';

import { useRef } from 'react';
import { Search } from 'lucide-react';
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
        name: 'Bali',
        country: 'Indonesia',
        query: 'Bali, Indonesia, 5 Days',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
    },
    {
        name: 'Dubai',
        country: 'UAE',
        query: 'Dubai, UAE, 4 Days',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop',
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
        <div className="relative bg-white py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
                >
                    Plan your next adventure
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-600 mb-12"
                >
                    AI-powered itineraries in seconds
                </motion.p>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative max-w-2xl mx-auto mb-16"
                >
                    <div className="flex items-center bg-white border-2 border-gray-300 rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-shadow focus-within:border-primary">
                        <Search className="w-6 h-6 text-gray-400 mr-3" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-lg"
                            placeholder="Where to? (e.g., Paris, 3 days)"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={() => handleSearch()}
                            className="ml-4 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </motion.div>

                {/* Featured Destinations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Popular destinations</h2>

                    {/* Horizontal Scroll */}
                    <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                        {FEATURED_CITIES.map((city, idx) => (
                            <motion.button
                                key={city.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + idx * 0.05 }}
                                onClick={() => handleSearch(city.query)}
                                className="flex-shrink-0 w-64 snap-start group"
                            >
                                <div className="relative h-80 rounded-2xl overflow-hidden card-shadow-hover transition-smooth">
                                    <img
                                        src={city.image}
                                        alt={city.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-left">
                                        <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                                        <p className="text-white/80 text-sm">{city.country}</p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
