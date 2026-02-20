'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
    Search, MapPin, Users, DollarSign,
    Star, ArrowRight, TrendingUp, Shield, Zap,
    CheckCircle, AlertTriangle, XCircle, Loader2,
    Navigation, Calendar, Thermometer, Cloud,
} from 'lucide-react';
import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
export interface SearchParams {
    origin: string;
    destination: string;
    fromDate: string;
    toDate: string;
    nights: number;
    guests: number;
    currency: string;
}

interface Advisory {
    verdict: 'good' | 'warning' | 'poor' | 'neutral';
    headline?: string;
    message: string;
    temp?: string;
    season?: string;
}

interface PlaceSuggestion {
    formatted: string;
    city?: string;
    country?: string;
    country_code?: string;
}

interface HeroProps {
    onSearch?: (params: SearchParams) => void;
}

/* ─────────────────────────────────────────────────────────────
   CURRENCIES — 20 options
───────────────────────────────────────────────────────────── */
const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
    { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
    { code: 'THB', symbol: '฿', label: 'Thai Baht' },
    { code: 'MYR', symbol: 'RM', label: 'Malaysian Ringgit' },
    { code: 'IDR', symbol: 'Rp', label: 'Indonesian Rupiah' },
    { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
    { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
    { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
    { code: 'MXN', symbol: '$', label: 'Mexican Peso' },
    { code: 'TRY', symbol: '₺', label: 'Turkish Lira' },
    { code: 'NOK', symbol: 'kr', label: 'Norwegian Krone' },
    { code: 'SEK', symbol: 'kr', label: 'Swedish Krona' },
];

/* Country code → currency code */
const COUNTRY_CURRENCY: Record<string, string> = {
    us: 'USD', gb: 'GBP', in: 'INR', au: 'AUD', jp: 'JPY',
    ae: 'AED', ca: 'CAD', ch: 'CHF', sg: 'SGD', th: 'THB',
    my: 'MYR', id: 'IDR', ke: 'KES', za: 'ZAR', br: 'BRL',
    mx: 'MXN', tr: 'TRY', no: 'NOK', se: 'SEK',
    de: 'EUR', fr: 'EUR', it: 'EUR', es: 'EUR', nl: 'EUR',
    pt: 'EUR', at: 'EUR', be: 'EUR', fi: 'EUR', gr: 'EUR',
    pl: 'EUR', cz: 'EUR',
};

/* ─────────────────────────────────────────────────────────────
   DESTINATIONS DATA
───────────────────────────────────────────────────────────── */
const DESTINATIONS = [
    { name: 'Santorini', country: 'Greece', tag: 'Top Pick', stat: '4.97', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop' },
    { name: 'Kyoto', country: 'Japan', tag: 'Cultural', stat: '4.94', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop' },
    { name: 'Bali', country: 'Indonesia', tag: 'Trending', stat: '4.92', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop' },
    { name: 'Maldives', country: 'Maldives', tag: 'Luxury', stat: '4.98', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600&auto=format&fit=crop' },
    { name: 'Amalfi Coast', country: 'Italy', tag: 'Romantic', stat: '4.95', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=600&auto=format&fit=crop' },
    { name: 'Prague', country: 'Czechia', tag: 'Hidden Gem', stat: '4.91', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=600&auto=format&fit=crop' },
    { name: 'New York', country: 'USA', tag: 'City Life', stat: '4.89', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=600&auto=format&fit=crop' },
    { name: 'Marrakech', country: 'Morocco', tag: 'Exotic', stat: '4.90', image: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?q=80&w=600&auto=format&fit=crop' },
];

const QUICK_PICKS = ['Paris', 'Tokyo', 'Bali', 'New York', 'Amalfi', 'Marrakech', 'Dubai', 'London'];

const ADVISORY_STYLES = {
    good: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', text: '#15803d', icon: CheckCircle },
    warning: { bg: 'rgba(234,179,8,0.09)', border: 'rgba(234,179,8,0.35)', text: '#b45309', icon: AlertTriangle },
    poor: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#dc2626', icon: XCircle },
    neutral: { bg: 'rgba(26,35,64,0.05)', border: 'rgba(26,35,64,0.12)', text: '#4A5568', icon: Cloud },
};

/* ─────────────────────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────────────────────── */
export default function Hero({ onSearch }: HeroProps) {
    const today = new Date().toISOString().split('T')[0];
    const defaultTo = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(defaultTo);
    const [guests, setGuests] = useState(2);
    const [currency, setCurrency] = useState('USD');
    const [autoDetected, setAutoDetected] = useState(false);

    const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
    const [currencySearch, setCurrencySearch] = useState('');

    const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>([]);
    const [destSuggestions, setDestSuggestions] = useState<PlaceSuggestion[]>([]);
    const [showOriginSug, setShowOriginSug] = useState(false);
    const [showDestSug, setShowDestSug] = useState(false);

    const [advisory, setAdvisory] = useState<Advisory | null>(null);
    const [advLoading, setAdvLoading] = useState(false);
    const advisoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const nights = Math.max(1, Math.round(
        (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000
    ));

    /* ── Geoapify autocomplete ── */
    const fetchPlaces = useCallback(async (query: string): Promise<PlaceSuggestion[]> => {
        if (query.length < 2) return [];
        try {
            const key = process.env.NEXT_PUBLIC_GEOAPIFY_KEY || '9a78b45300b14db981cacc20c9c11d21';
            const res = await fetch(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&limit=6&apiKey=${key}`
            );
            const data = await res.json();
            return (data.features || []).map((f: any) => ({
                formatted: f.properties.formatted,
                city: f.properties.city || f.properties.name,
                country: f.properties.country,
                country_code: f.properties.country_code,
            }));
        } catch { return []; }
    }, []);

    /* Origin autocomplete + currency detection */
    const originTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleOriginChange = (val: string) => {
        setOrigin(val);
        setShowOriginSug(true);
        if (originTimer.current) clearTimeout(originTimer.current);
        originTimer.current = setTimeout(async () => {
            const sug = await fetchPlaces(val);
            setOriginSuggestions(sug);
        }, 300);
    };

    /* Destination autocomplete */
    const destTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleDestChange = (val: string) => {
        setDest(val);
        setShowDestSug(true);
        if (destTimer.current) clearTimeout(destTimer.current);
        destTimer.current = setTimeout(async () => {
            const sug = await fetchPlaces(val);
            setDestSuggestions(sug);
        }, 300);
    };

    /* Select origin suggestion */
    const selectOrigin = (sug: PlaceSuggestion) => {
        setOrigin(sug.formatted);
        setShowOriginSug(false);
        // Auto-detect currency
        if (sug.country_code) {
            const cc = COUNTRY_CURRENCY[sug.country_code.toLowerCase()];
            if (cc) { setCurrency(cc); setAutoDetected(true); }
        }
    };

    /* Select destination suggestion */
    const selectDest = (sug: PlaceSuggestion) => {
        setDest(sug.formatted);
        setShowDestSug(false);
    };

    /* Advisory fetch */
    const fetchAdvisory = useCallback(async (destination: string, fd: string, td: string) => {
        if (!destination || !fd || !td) return;
        setAdvLoading(true);
        try {
            const res = await fetch('/api/travel-advisory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, fromDate: fd, toDate: td }),
            });
            const data = await res.json();
            setAdvisory(data);
        } catch {
            setAdvisory({ verdict: 'neutral', message: 'Advisory unavailable.' });
        } finally { setAdvLoading(false); }
    }, []);

    useEffect(() => {
        if (advisoryTimer.current) clearTimeout(advisoryTimer.current);
        if (dest.trim().length < 2) { setAdvisory(null); return; }
        advisoryTimer.current = setTimeout(() => fetchAdvisory(dest, fromDate, toDate), 800);
        return () => { if (advisoryTimer.current) clearTimeout(advisoryTimer.current); };
    }, [dest, fromDate, toDate, fetchAdvisory]);

    const handleSearch = () => {
        if (!dest.trim()) return;
        onSearch?.({ origin, destination: dest, fromDate, toDate, nights, guests, currency });
    };

    const filteredCurrencies = CURRENCIES.filter(c =>
        c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
        c.label.toLowerCase().includes(currencySearch.toLowerCase())
    );
    const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

    /* shared input style */
    const inputStyle: React.CSSProperties = {
        background: 'transparent', border: 'none', outline: 'none',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem',
        fontWeight: 500, color: '#1A2340', width: '100%',
    };
    const labelStyle: React.CSSProperties = {
        fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#8A94A6', marginBottom: '0.3rem',
        display: 'block',
    };

    return (
        <div style={{ background: '#FFFBF5' }} onClick={() => { setShowCurrencyMenu(false); setShowOriginSug(false); setShowDestSug(false); }}>

            {/* ══════════════════════════
          1. FULL-SCREEN HERO
      ══════════════════════════ */}
            <section style={{
                position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
                <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Beautiful travel destination" fill priority unoptimized
                    style={{ objectFit: 'cover', objectPosition: 'center 55%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,21,38,0.3) 0%, rgba(13,21,38,0.55) 60%, rgba(13,21,38,0.75) 100%)' }} />

                {/* Hero text — centred */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px',
                        padding: '0.35rem 0.875rem', marginBottom: '1.5rem',
                    }}>
                        <Star style={{ width: '0.75rem', height: '0.75rem', color: '#E8A838', fill: '#E8A838' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                            AI-Powered Travel Planning
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: 'Fraunces, serif',
                        fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
                        fontWeight: 700, color: 'white', lineHeight: 1.05,
                        marginBottom: '1.25rem', letterSpacing: '-0.03em',
                    }}>
                        Your next great<br />
                        <em style={{ fontStyle: 'italic', color: '#FF8E8E' }}>adventure</em> awaits.
                    </h1>

                    <p style={{
                        color: 'rgba(255,255,255,0.65)', fontSize: '1.125rem',
                        maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.65,
                    }}>
                        Tell us where you want to go and we&apos;ll build a beautiful, personalised itinerary in seconds.
                    </p>

                    {/* Scroll CTA */}
                    <button
                        onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '100px',
                            padding: '1rem 3rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                            fontSize: '1.0625rem', cursor: 'pointer',
                            boxShadow: '0 8px 32px rgba(255,107,107,0.45)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        }}
                        className="hover:scale-105 hover:shadow-xl"
                    >
                        <Search style={{ width: '1.125rem', height: '1.125rem' }} />
                        Plan My Trip
                    </button>
                </div>

                {/* Down arrow */}
                <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', zIndex: 10 }}>
                    <div style={{ width: '1px', height: '3rem', background: 'rgba(255,255,255,0.3)', margin: '0 auto' }} />
                </div>
            </section>

            {/* ══════════════════════════
          2. SEARCH SECTION (below fold)
      ══════════════════════════ */}
            <section id="search-section" style={{ background: '#FFFBF5', padding: '4rem 2rem 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    {/* Section header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, color: '#1A2340', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                            Where do you want to go?
                        </h2>
                        <p style={{ color: '#8A94A6', fontSize: '1rem' }}>Fill in your details and our AI will plan everything</p>
                    </div>

                    <div style={{
                        background: '#ffffff', borderRadius: '1.5rem',
                        boxShadow: '0 8px 64px rgba(26,35,64,0.12), 0 2px 16px rgba(26,35,64,0.07)',
                        border: '1px solid rgba(26,35,64,0.06)', overflow: 'visible',
                    }} onClick={e => e.stopPropagation()}>

                        {/* ── ROW 1: From | To | Guests | Currency ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', borderBottom: '1px solid rgba(26,35,64,0.07)' }}>

                            {/* From */}
                            <div style={{ padding: '1.1rem 1.25rem', borderRight: '1px solid rgba(26,35,64,0.07)', position: 'relative' }}>
                                <label style={labelStyle}><Navigation style={{ width: '0.65rem', height: '0.65rem', display: 'inline', marginRight: '0.3rem' }} />From</label>
                                <input
                                    type="text" value={origin}
                                    onChange={e => handleOriginChange(e.target.value)}
                                    onFocus={() => origin.length > 1 && setShowOriginSug(true)}
                                    placeholder="Your city or airport"
                                    style={inputStyle}
                                />
                                {/* Origin suggestions */}
                                {showOriginSug && originSuggestions.length > 0 && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60,
                                        background: 'white', borderRadius: '0.875rem', marginTop: '0.25rem',
                                        boxShadow: '0 8px 32px rgba(26,35,64,0.14)',
                                        border: '1px solid rgba(26,35,64,0.08)', overflow: 'hidden',
                                    }}>
                                        {originSuggestions.map((s, i) => (
                                            <div key={i} onMouseDown={() => selectOrigin(s)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: i < originSuggestions.length - 1 ? '1px solid rgba(26,35,64,0.05)' : 'none', transition: 'background 0.1s' }} className="hover:bg-[rgba(255,107,107,0.05)]">
                                                <p style={{ fontWeight: 600, color: '#1A2340', fontSize: '0.875rem' }}>{s.city || s.formatted.split(',')[0]}</p>
                                                <p style={{ color: '#8A94A6', fontSize: '0.75rem' }}>{s.country}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* To */}
                            <div style={{ padding: '1.1rem 1.25rem', borderRight: '1px solid rgba(26,35,64,0.07)', position: 'relative' }}>
                                <label style={labelStyle}><MapPin style={{ width: '0.65rem', height: '0.65rem', display: 'inline', marginRight: '0.3rem' }} />To</label>
                                <input
                                    type="text" value={dest}
                                    onChange={e => handleDestChange(e.target.value)}
                                    onFocus={() => dest.length > 1 && setShowDestSug(true)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Destination city or country"
                                    style={inputStyle}
                                />
                                {/* Dest suggestions */}
                                {showDestSug && destSuggestions.length > 0 && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60,
                                        background: 'white', borderRadius: '0.875rem', marginTop: '0.25rem',
                                        boxShadow: '0 8px 32px rgba(26,35,64,0.14)',
                                        border: '1px solid rgba(26,35,64,0.08)', overflow: 'hidden',
                                    }}>
                                        {destSuggestions.map((s, i) => (
                                            <div key={i} onMouseDown={() => selectDest(s)} style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: i < destSuggestions.length - 1 ? '1px solid rgba(26,35,64,0.05)' : 'none' }} className="hover:bg-[rgba(255,107,107,0.05)]">
                                                <p style={{ fontWeight: 600, color: '#1A2340', fontSize: '0.875rem' }}>{s.city || s.formatted.split(',')[0]}</p>
                                                <p style={{ color: '#8A94A6', fontSize: '0.75rem' }}>{s.country}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Guests */}
                            <div style={{ padding: '1.1rem 1.25rem', borderRight: '1px solid rgba(26,35,64,0.07)', minWidth: '130px' }}>
                                <label style={labelStyle}><Users style={{ width: '0.65rem', height: '0.65rem', display: 'inline', marginRight: '0.3rem' }} />Guests</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.1rem' }}>
                                    <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent', cursor: 'pointer', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                    <span style={{ fontWeight: 700, color: '#1A2340', minWidth: '1.25rem', textAlign: 'center' }}>{guests}</span>
                                    <button onClick={() => setGuests(g => g + 1)} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent', cursor: 'pointer', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                                </div>
                            </div>

                            {/* Currency */}
                            <div style={{ padding: '1.1rem 1.25rem', position: 'relative', minWidth: '140px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setShowCurrencyMenu(v => !v); }}>
                                <label style={labelStyle}>
                                    <DollarSign style={{ width: '0.65rem', height: '0.65rem', display: 'inline', marginRight: '0.3rem' }} />
                                    Currency {autoDetected && <span style={{ color: '#4ECDC4', fontWeight: 700 }}>AUTO</span>}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontWeight: 700, color: '#1A2340', fontSize: '1rem' }}>{selectedCurrency.symbol}</span>
                                    <span style={{ fontWeight: 600, color: '#4A5568', fontSize: '0.9rem' }}>{selectedCurrency.code}</span>
                                </div>

                                {showCurrencyMenu && (
                                    <div style={{
                                        position: 'absolute', top: '105%', right: 0, zIndex: 70,
                                        background: 'white', borderRadius: '1rem', width: '220px',
                                        boxShadow: '0 8px 40px rgba(26,35,64,0.16)',
                                        border: '1px solid rgba(26,35,64,0.08)', overflow: 'hidden',
                                    }} onClick={e => e.stopPropagation()}>
                                        {/* Search */}
                                        <div style={{ padding: '0.625rem 0.875rem', borderBottom: '1px solid rgba(26,35,64,0.06)' }}>
                                            <input
                                                autoFocus
                                                value={currencySearch}
                                                onChange={e => setCurrencySearch(e.target.value)}
                                                placeholder="Search currency…"
                                                style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: '#1A2340', background: 'transparent' }}
                                            />
                                        </div>
                                        {/* List */}
                                        <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                            {filteredCurrencies.map(c => (
                                                <div
                                                    key={c.code}
                                                    onMouseDown={() => { setCurrency(c.code); setAutoDetected(false); setShowCurrencyMenu(false); setCurrencySearch(''); }}
                                                    style={{
                                                        padding: '0.65rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                        background: currency === c.code ? 'rgba(255,107,107,0.06)' : 'transparent',
                                                        cursor: 'pointer', borderBottom: '1px solid rgba(26,35,64,0.04)',
                                                    }}
                                                    className="hover:bg-[rgba(26,35,64,0.03)]"
                                                >
                                                    <span style={{ fontWeight: 700, color: '#FF6B6B', minWidth: '1.75rem', fontSize: '0.9375rem' }}>{c.symbol}</span>
                                                    <div>
                                                        <p style={{ fontWeight: 600, color: '#1A2340', fontSize: '0.8125rem' }}>{c.code}</p>
                                                        <p style={{ color: '#8A94A6', fontSize: '0.7rem' }}>{c.label}</p>
                                                    </div>
                                                    {currency === c.code && <span style={{ marginLeft: 'auto', color: '#FF6B6B', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── ROW 2: Depart | Return ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(26,35,64,0.07)' }}>
                            <div style={{ padding: '1.1rem 1.25rem', borderRight: '1px solid rgba(26,35,64,0.07)' }}>
                                <label style={labelStyle}><Calendar style={{ width: '0.65rem', height: '0.65rem', display: 'inline', marginRight: '0.3rem' }} />Depart</label>
                                <input type="date" value={fromDate} min={today}
                                    onChange={e => {
                                        setFromDate(e.target.value);
                                        if (e.target.value >= toDate) {
                                            const d = new Date(e.target.value); d.setDate(d.getDate() + 1);
                                            setToDate(d.toISOString().split('T')[0]);
                                        }
                                    }}
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                />
                            </div>
                            <div style={{ padding: '1.1rem 1.25rem' }}>
                                <label style={labelStyle}><Calendar style={{ width: '0.65rem', height: '0.65rem', display: 'inline', marginRight: '0.3rem' }} />Return · <span style={{ color: '#FF6B6B', fontWeight: 700 }}>{nights} night{nights !== 1 ? 's' : ''}</span></label>
                                <input type="date" value={toDate} min={fromDate}
                                    onChange={e => setToDate(e.target.value)}
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        {/* Quick picks */}
                        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(26,35,64,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8125rem', color: '#8A94A6', fontWeight: 500, flexShrink: 0 }}>Popular:</span>
                            {QUICK_PICKS.map(place => (
                                <button key={place} onMouseDown={() => setDest(place)}
                                    style={{ background: 'transparent', border: '1px solid rgba(26,35,64,0.12)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 500, color: '#4A5568', cursor: 'pointer', transition: 'all 0.15s' }}
                                    className="hover:border-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.05)]"
                                >{place}</button>
                            ))}
                        </div>

                        {/* ── Centred Plan Trip button ── */}
                        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
                            <button onClick={handleSearch}
                                style={{
                                    background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '100px',
                                    padding: '1rem 4rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 700,
                                    fontSize: '1.0625rem', cursor: 'pointer',
                                    boxShadow: '0 6px 28px rgba(255,107,107,0.4)',
                                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                }}
                                className="hover:scale-[1.02] hover:shadow-xl"
                            >
                                <Search style={{ width: '1.125rem', height: '1.125rem' }} />
                                Plan My Trip
                            </button>
                        </div>
                    </div>

                    {/* ── AI Advisory Banner ── */}
                    {(advisory || advLoading) && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem 1.25rem',
                            borderRadius: '1rem',
                            border: `1px solid ${advLoading ? 'rgba(26,35,64,0.1)' : ADVISORY_STYLES[advisory!.verdict].border}`,
                            background: advLoading ? 'rgba(26,35,64,0.03)' : ADVISORY_STYLES[advisory!.verdict].bg,
                            transition: 'all 0.3s',
                        }}>
                            {advLoading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Loader2 style={{ width: '1rem', height: '1rem', color: '#8A94A6', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                                    <p style={{ color: '#8A94A6', fontSize: '0.875rem', fontWeight: 500 }}>Getting AI travel advisory for <strong>{dest}</strong>…</p>
                                </div>
                            ) : advisory && (() => {
                                const { icon: Icon, text } = ADVISORY_STYLES[advisory.verdict];
                                return (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <Icon style={{ width: '1.125rem', height: '1.125rem', color: text, marginTop: '0.125rem', flexShrink: 0 }} />
                                            <div style={{ flex: 1 }}>
                                                {advisory.headline && (
                                                    <p style={{ fontWeight: 700, color: '#1A2340', fontSize: '0.9375rem', marginBottom: '0.3rem' }}>{advisory.headline}</p>
                                                )}
                                                <p style={{ color: text, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.55 }}>{advisory.message}</p>
                                                {(advisory.temp || advisory.season) && (
                                                    <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                        {advisory.temp && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#4A5568', fontWeight: 500 }}>
                                                                <Thermometer style={{ width: '0.75rem', height: '0.75rem', color: '#FF6B6B' }} /> {advisory.temp}
                                                            </span>
                                                        )}
                                                        {advisory.season && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#4A5568', fontWeight: 500 }}>
                                                                <Calendar style={{ width: '0.75rem', height: '0.75rem', color: '#4ECDC4' }} /> {advisory.season}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Trust badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.25rem', justifyContent: 'center' }}>
                        {[{ icon: Zap, label: 'Instant AI plan' }, { icon: Shield, label: 'Best price guarantee' }, { icon: TrendingUp, label: 'Date-smart suggestions' }]
                            .map(({ icon: Icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Icon style={{ width: '0.875rem', height: '0.875rem', color: '#FF6B6B' }} />
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#8A94A6' }}>{label}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════
          3. POPULAR DESTINATIONS (8 cards)
      ══════════════════════════ */}
            <section style={{ padding: '4rem 2rem 6rem', background: '#FFFBF5' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.25)', borderRadius: '100px', padding: '0.25rem 0.75rem', marginBottom: '0.75rem' }}>
                                <TrendingUp style={{ width: '0.75rem', height: '0.75rem', color: '#2A9D8F' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2A9D8F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Trending Now</span>
                            </div>
                            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#1A2340', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Popular Destinations</h2>
                        </div>
                        <a href="/destinations" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, fontSize: '0.9375rem', color: '#FF6B6B', textDecoration: 'none' }}>
                            View all <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                        </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {DESTINATIONS.map(d => (
                            <div key={d.name} className="card-hover" style={{ cursor: 'pointer' }} onClick={() => setDest(d.name)}>
                                <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                                    <Image src={d.image} alt={d.name} fill unoptimized style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,35,64,0.55) 0%, transparent 60%)' }} />
                                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: '100px', padding: '0.18rem 0.6rem', border: '1px solid rgba(255,255,255,0.25)' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>{d.tag}</span>
                                    </div>
                                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', borderRadius: '100px', padding: '0.18rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <Star style={{ width: '0.55rem', height: '0.55rem', color: '#E8A838', fill: '#E8A838' }} />
                                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>{d.stat}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', fontWeight: 700, color: '#1A2340', marginBottom: '0.2rem' }}>{d.name}</h3>
                                    <p style={{ color: '#8A94A6', fontSize: '0.8125rem', fontWeight: 500 }}>{d.country}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Stats Strip ── */}
            <section style={{ background: '#1A2340', padding: '3.5rem 2rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    {[{ value: '2M+', label: 'Happy travellers' }, { value: '150+', label: 'Countries covered' }, { value: '98%', label: 'Satisfaction rate' }, { value: '<5s', label: 'To generate a plan' }].map(s => (
                        <div key={s.label}>
                            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.25rem', fontWeight: 700, color: '#FF8E8E', lineHeight: 1 }}>{s.value}</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500, marginTop: '0.5rem' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes bounce  { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }
      `}</style>
        </div>
    );
}
