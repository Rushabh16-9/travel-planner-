'use client';

import { useRef, useState } from 'react';
import { Search, MapPin, Calendar, DollarSign, Euro, PoundSterling, JapaneseYen, IndianRupee, CalendarDays, ChevronDown } from 'lucide-react';
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
                    className="object-cover opacity-40"
                    unoptimized
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white" />
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
                    className="absolute top-20 left-[10%] opacity-30 hidden md:block"
                >
                    <Search className="w-24 h-24 text-emerald-500" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 right-[15%] opacity-30 hidden md:block"
                >
                    <MapPin className="w-32 h-32 text-cyan-500" />
                </motion.div>

                {/* Heading with Split Text Animation */}
                <motion.h1
                    className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 drop-shadow-sm text-center mx-auto"
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
                            className="inline-block origin-bottom bg-gradient-to-b from-slate-800 to-slate-600 bg-clip-text text-transparent"
                        >
                            {char}
                        </motion.span>
                    ))}
                    <span className="inline-block bg-gradient-to-b from-slate-800 to-slate-600 bg-clip-text text-transparent">,</span>{' '}
                    <motion.span
                        className="bg-gradient-to-b from-emerald-500 to-cyan-500 bg-clip-text text-transparent italic inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                    >
                        Reimagined.
                    </motion.span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-600 mb-14 font-light tracking-wide max-w-3xl mx-auto leading-relaxed text-center">
                    AI-powered itineraries crafted for the modern explorer.
                </motion.p>

                {/* Command Center (Glass Input Grid) */}
                <motion.div variants={itemVariants} className="glass-dark-premium p-3 rounded-[2rem] max-w-6xl mx-auto relative overflow-visible shadow-xl">
                    {/* Glow effect behind the panel */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-[2.2rem] blur-xl -z-10" />

                    <div className="bg-white/60 backdrop-blur-xl rounded-[1.8rem] p-8 sm:p-10 flex flex-col md:flex-row md:items-end gap-8 md:gap-0">

                        {/* Destination */}
                        <div className="flex-1 flex flex-col gap-4 text-left hover-lift md:pr-8">
                            <label className="inline-flex items-center gap-2 text-slate-700 text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-slate-100 w-fit self-start">
                                Destination
                            </label>
                            <div className="field-shell-enhanced group">
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
                        <div className="flex-1 flex flex-col gap-4 text-left hover-lift md:px-8">
                            <label className="inline-flex items-center gap-2 text-slate-700 text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-slate-100 w-fit self-start">
                                Travel Dates
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="field-shell-enhanced field-shell-sm group">
                                    <Calendar className="field-icon w-4 h-4 pointer-events-none text-cyan-500" />
                                    <input
                                        id="date-from"
                                        type="date"
                                        className="field-input text-sm"
                                        placeholder="From"
                                    />
                                </div>
                                <div className="field-shell-enhanced field-shell-sm group">
                                    <CalendarDays className="field-icon w-4 h-4 pointer-events-none text-cyan-500" />
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
                            <label className="inline-flex items-center gap-2 text-slate-700 text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-slate-100 w-fit self-start">
                                Budget
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                                <div className="field-shell-enhanced field-shell-sm relative">
                                    <select
                                        id="currency-select"
                                        defaultValue="USD"
                                        className="field-select field-input-noicon pr-10"
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        <option value="USD" className="bg-white text-slate-900">USD</option>
                                        <option value="INR" className="bg-white text-slate-900">INR</option>
                                        <option value="EUR" className="bg-white text-slate-900">EUR</option>
                                        <option value="GBP" className="bg-white text-slate-900">GBP</option>
                                        <option value="JPY" className="bg-white text-slate-900">JPY</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
                                </div>

                                <div className="field-shell-enhanced field-shell-sm group">
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

                {/* Plan Itinerary Button */}
                <motion.div 
                    variants={itemVariants}
                    className="flex justify-center px-4 mt-48 mb-32"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSearch()}
                        className="text-white py-8 px-16 rounded-full font-bold text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 btn-primary btn-hero shadow-2xl border border-white/20 relative overflow-hidden group transform scale-150"
                        style={{ transformOrigin: 'center' }}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Search className="w-6 h-6 group-hover:rotate-12 transition-transform relative z-10" />
                        <span className="relative z-10">Plan Itinerary</span>
                    </motion.button>
                </motion.div>

                {/* Trending Destinations */}
                <motion.div variants={itemVariants} className="mt-8">
                    <p className="text-slate-600 text-xs tracking-[0.3em] uppercase mb-8 font-semibold text-center">Trending This Week</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {FEATURED_CITIES.map((city, idx) => (
                            <motion.button
                                key={city.name}
                                onClick={() => handleSearch(city.query)}
                                className={`relative overflow-hidden cursor-pointer group border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/50 bg-white rounded-2xl ${city.size === 'large' ? 'sm:col-span-2 sm:row-span-2 h-[280px] sm:h-[380px]' : 'h-[280px]'
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
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                    unoptimized
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                
                                {/* Glass Overlay on bottom 30% */}
                                <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-[1px]" />
                                
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {city.size === 'large' && (
                                    <div className="absolute top-3 left-3 bg-emerald-500/95 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm shadow-lg z-10 group-hover:bg-emerald-400 transition-colors border border-emerald-400/40">
                                        Featured
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col items-start transform translate-y-1 group-hover:translate-y-0 transition-transform z-20">
                                    <h3 className={`font-serif text-white leading-tight mb-1 drop-shadow-lg ${city.size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                                        {city.name}
                                    </h3>
                                    <span className="text-white/75 text-xs uppercase tracking-wider group-hover:text-emerald-300 transition-all font-medium">
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
