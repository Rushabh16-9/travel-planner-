'use client';

import { useRef, useState } from 'react';
import { Search, MapPin, Calendar, DollarSign, Euro, PoundSterling, JapaneseYen, IndianRupee, CalendarDays } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

interface HeroProps {
    onSearch?: (query: string, days: number) => void;
}

const FEATURED_CITIES = [
    {
        name: 'Paris',
        country: 'France',
        query: 'Paris, France, 3 Days',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
        size: 'large',
    },
    {
        name: 'Tokyo',
        country: 'Japan',
        query: 'Tokyo, Japan, 5 Days',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
        size: 'small',
    },
    {
        name: 'New York',
        country: 'USA',
        query: 'New York City, USA, 4 Days',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
        size: 'small',
    },
    {
        name: 'Santorini',
        country: 'Greece',
        query: 'Santorini, Greece, 5 Days',
        image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop',
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
    const [currency, setCurrency] = useState('USD');

    const currencyIcon = {
        USD: DollarSign,
        EUR: Euro,
        GBP: PoundSterling,
        JPY: JapaneseYen,
        INR: IndianRupee,
    }[currency] || DollarSign;

    const handleSearch = (query?: string) => {
        // Calculate days from date pickers
        let days = 5; // Default
        const dateFrom = document.getElementById('date-from') as HTMLInputElement;
        const dateTo = document.getElementById('date-to') as HTMLInputElement;
        
        if (dateFrom?.value && dateTo?.value) {
            const from = new Date(dateFrom.value);
            const to = new Date(dateTo.value);
            const diffTime = Math.abs(to.getTime() - from.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            days = diffDays > 0 ? diffDays : 5;
        }

        if (query) {
            // Extract days from query if possible, otherwise use default
            if (onSearch) onSearch(query, days);
            return;
        }

        const destination = inputRef.current?.value;
        const currency = (document.getElementById('currency-select') as HTMLSelectElement)?.value;
        const amount = (document.getElementById('budget-amount') as HTMLInputElement)?.value;

        if (onSearch && destination) {
            const budgetString = amount ? `${currency} ${amount}` : 'Flexible';
            const finalQuery = `${destination}, ${budgetString} Budget`;
            onSearch(finalQuery, days);
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
                    unoptimized
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

                {/* Floating 3D Icons */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-[10%] opacity-20 hidden md:block"
                >
                    <Search className="w-24 h-24 text-emerald-400" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 right-[15%] opacity-20 hidden md:block"
                >
                    <MapPin className="w-32 h-32 text-cyan-400" />
                </motion.div>

                {/* Heading with Split Text Animation */}
                <motion.h1
                    className="text-6xl md:text-8xl font-serif font-bold text-white/95 mb-6 drop-shadow-2xl tracking-tight text-center mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {Array.from("Wanderlust").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 50, rotateX: -90 },
                                show: { opacity: 1, y: 0, rotateX: 0 }
                            }}
                            className="inline-block origin-bottom"
                        >
                            {char}
                        </motion.span>
                    ))}
                    <span className="inline-block">,</span>{' '}
                    <motion.span
                        className="text-white italic inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                    >
                        Reimagined.
                    </motion.span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg md:text-2xl text-white/80 mb-14 font-light tracking-wide max-w-3xl mx-auto leading-relaxed text-center">
                    AI-powered itineraries crafted for the modern explorer.
                </motion.p>

                {/* Command Center (Glass Input Grid) */}
                <motion.div variants={itemVariants} className="glass-dark-premium p-2 rounded-[2rem] max-w-6xl mx-auto mb-20 md:mb-24 relative overflow-visible glow-emerald-soft">
                    {/* Glow effect behind the panel */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2.2rem] blur-xl -z-10" />

                    <div className="bg-black/40 backdrop-blur-xl rounded-[1.8rem] p-8 sm:p-12 flex flex-col md:flex-row md:items-end gap-8 md:gap-0">

                        {/* Destination */}
                        <div className="flex-1 flex flex-col gap-4 text-left hover-lift md:pr-8 md:border-r md:border-white/10">
                            <label className="inline-flex items-center gap-2 text-white/90 text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-white/15 w-fit self-start">
                                Destination
                            </label>
                            <div className="field-shell group">
                                <MapPin className="field-icon w-5 h-5 transition-transform group-hover:scale-110 group-focus-within:scale-110" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="field-input"
                                    placeholder="Where to next?"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>

                        {/* Travel Dates */}
                        <div className="flex-1 flex flex-col gap-4 text-left hover-lift md:px-8 md:border-r md:border-white/10">
                            <label className="inline-flex items-center gap-2 text-white/90 text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-white/15 w-fit self-start">
                                Travel Dates
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="field-shell field-shell-sm group">
                                    <Calendar className="field-icon w-4 h-4 pointer-events-none text-cyan-300" />
                                    <input
                                        id="date-from"
                                        type="date"
                                        className="field-input text-sm"
                                        placeholder="From"
                                    />
                                </div>
                                <div className="field-shell field-shell-sm group">
                                    <CalendarDays className="field-icon w-4 h-4 pointer-events-none text-cyan-300" />
                                    <input
                                        id="date-to"
                                        type="date"
                                        className="field-input text-sm"
                                        placeholder="To"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="flex-1 flex flex-col gap-4 text-left hover-lift md:pl-8">
                            <label className="inline-flex items-center gap-2 text-white/90 text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-white/15 w-fit self-start">
                                Budget
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                                <div className="field-shell field-shell-sm">
                                    <select
                                        id="currency-select"
                                        defaultValue="USD"
                                        className="field-select field-input-noicon"
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        <option value="USD" className="bg-slate-900 text-white">USD</option>
                                        <option value="INR" className="bg-slate-900 text-white">INR</option>
                                        <option value="EUR" className="bg-slate-900 text-white">EUR</option>
                                        <option value="GBP" className="bg-slate-900 text-white">GBP</option>
                                        <option value="JPY" className="bg-slate-900 text-white">JPY</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-sm">▼</div>
                                </div>

                                <div className="field-shell field-shell-sm group">
                                    {(() => {
                                        const Icon = currencyIcon;
                                        return <Icon className="field-icon w-5 h-5" />;
                                    })()}
                                    <input
                                        id="budget-amount"
                                        type="number"
                                        placeholder="2000"
                                        className="field-input"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                </motion.div>

                {/* Liquid Search Button (Below Search Bar) */}
                <div className="mt-16 flex justify-center px-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSearch()}
                        className="text-white py-5 px-12 rounded-full font-bold text-base md:text-lg uppercase tracking-[0.28em] glow-emerald-strong flex items-center gap-4 group min-w-[240px] btn-primary btn-hero pulse-ring"
                    >
                        <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Plan Itinerary
                    </motion.button>
                </div>

                {/* Bento Grid 2.0: Destinations (Masonry) */}
                <motion.div variants={itemVariants} className="pt-12 md:pt-16">
                    <p className="text-white/85 text-xs tracking-[0.3em] uppercase mb-8 font-semibold text-center">Trending This Week</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto h-auto md:h-[420px]">
                        {FEATURED_CITIES.map((city, idx) => (
                            <motion.button
                                key={city.name}
                                onClick={() => handleSearch(city.query)}
                                className={`relative rounded-3xl overflow-hidden cursor-pointer group border border-white/10 shadow-xl transition-all hover:shadow-2xl hover-lift bg-white/5 ${city.size === 'large' ? 'sm:col-span-2 sm:row-span-2 h-[300px] sm:h-auto' : 'h-[200px] sm:h-auto'
                                    }`}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Image
                                    src={city.image}
                                    alt={city.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                {city.size === 'large' && (
                                    <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm shadow-lg z-10 group-hover:bg-emerald-400 transition-colors">
                                        Featured
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col items-start transform translate-y-2 group-hover:translate-y-0 transition-transform z-20">
                                    <h3 className={`font-serif text-white leading-none mb-1 whitespace-nowrap ${city.size === 'large' ? 'text-3xl sm:text-4xl' : 'text-lg sm:text-xl'}`}>
                                        {city.name}
                                    </h3>
                                    <span className="text-white/70 text-xs uppercase tracking-wider group-hover:text-emerald-300 transition-all">
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
