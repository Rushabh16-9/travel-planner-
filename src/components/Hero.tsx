'use client';

import { useRef, useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface HeroProps {
    onSearch?: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        if (onSearch && inputRef.current?.value) {
            setIsLoading(true);
            onSearch(inputRef.current.value);
            setTimeout(() => setIsLoading(false), 2000);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">AI-Powered Travel Planning</span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight mb-6">
                    Design Your Next
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                        Adventure
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                    Enter your destination and let AI craft the perfect itinerary with real-time weather, flights, and local insights.
                </p>

                {/* Glassmorphic Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <div
                        className={cn(
                            'relative glass rounded-2xl p-2 transition-all duration-300',
                            isFocused && 'glow-emerald border-emerald-500/50'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="pl-4">
                                <Search className={cn(
                                    "w-5 h-5 transition-colors",
                                    isFocused ? "text-emerald-400" : "text-white/40"
                                )} />
                            </div>

                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Where to? (e.g., Tokyo, 5 days)"
                                className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none py-4 text-lg"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                disabled={isLoading}
                            />

                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Plan Trip</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    {isFocused && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl -z-10" />
                    )}
                </div>

                {/* Quick Suggestions */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <span className="text-sm text-white/40">Try:</span>
                    {['Paris, 3 days', 'Tokyo, 1 week', 'Bali, 5 days'].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => {
                                if (inputRef.current) {
                                    inputRef.current.value = suggestion;
                                    handleSearch();
                                }
                            }}
                            className="px-4 py-2 glass glass-hover rounded-full text-sm font-medium"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
