'use client';

import { useRef, useState } from 'react';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { motion } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface HeroProps {
    onSearch?: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        if (onSearch && inputRef.current?.value) {
            setIsLoading(true);
            onSearch(inputRef.current.value);
        }
    };

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6">

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-4xl mx-auto z-10"
            >
                <span className="block text-xs font-medium tracking-[0.2em] text-white/60 mb-8 uppercase">
                    The Future of Travel
                </span>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1]">
                    Curating the <br />
                    <span className="italic opacity-80">Unforgettable.</span>
                </h1>

                <p className="text-lg text-white/50 max-w-lg mx-auto mb-12 font-light leading-relaxed">
                    AI-powered itineraries designed for the modern explorer.
                    Experience the world with precision and elegance.
                </p>

                {/* Elegant Search Bar */}
                <div className="relative max-w-md mx-auto w-full group">
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />

                    <div className="relative flex items-center glass-panel rounded-full px-2 py-2 transition-transform duration-300 focus-within:scale-105">
                        <div className="pl-4 pr-3 text-white/40">
                            <MapPin className="w-5 h-5" />
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            disabled={isLoading}
                            className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-base h-12"
                            placeholder="e.g. Kyoto, 5 Days"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />

                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
