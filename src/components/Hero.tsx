'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
    Search, MapPin, Calendar, Users, DollarSign,
    Star, ArrowRight, TrendingUp, Shield, Zap,
    CheckCircle, AlertTriangle, XCircle, Loader2,
    Navigation,
} from 'lucide-react';
import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface HeroProps {
    onSearch?: (params: SearchParams) => void;
}

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
    message: string;
}

/* ─────────────────────────────────────────────────────────────
   DATA
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

const QUICK_PICKS = ['Paris', 'Tokyo', 'Bali', 'New York', 'Amalfi', 'Marrakech'];

const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
    { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
];

const FEATURES = [
    { icon: Zap, label: 'Instant AI plan' },
    { icon: Shield, label: 'Best price guarantee' },
    { icon: TrendingUp, label: 'Date-smart suggestions' },
];

/* ─────────────────────────────────────────────────────────────
   ADVISORY HELPERS
───────────────────────────────────────────────────────────── */
const ADVISORY_STYLES = {
    good: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', text: '#16a34a', Icon: CheckCircle },
    warning: { bg: 'rgba(234,179,8,0.09)', border: 'rgba(234,179,8,0.3)', text: '#b45309', Icon: AlertTriangle },
    poor: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#dc2626', Icon: XCircle },
    neutral: { bg: 'rgba(26,35,64,0.05)', border: 'rgba(26,35,64,0.12)', text: '#4A5568', Icon: CheckCircle },
};

/* ─────────────────────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────────────────────── */
export default function Hero({ onSearch }: HeroProps) {
    const originRef = useRef<HTMLInputElement>(null);
    const destRef = useRef<HTMLInputElement>(null);

    const today = new Date().toISOString().split('T')[0];
    const defaultTo = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(defaultTo);
    const [guests, setGuests] = useState(2);
    const [currency, setCurrency] = useState('USD');
    const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

    const [advisory, setAdvisory] = useState<Advisory | null>(null);
    const [advLoading, setAdvLoading] = useState(false);
    const advisoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* Compute nights */
    const nights = Math.max(1, Math.round(
        (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000
    ));

    /* Fetch advisory with debounce */
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
        } finally {
            setAdvLoading(false);
        }
    }, []);

    /* Debounce: refetch when dest or dates change */
    useEffect(() => {
        if (advisoryTimer.current) clearTimeout(advisoryTimer.current);
        if (dest.trim().length < 2) { setAdvisory(null); return; }
        advisoryTimer.current = setTimeout(() => fetchAdvisory(dest, fromDate, toDate), 900);
        return () => { if (advisoryTimer.current) clearTimeout(advisoryTimer.current); };
    }, [dest, fromDate, toDate, fetchAdvisory]);

    const handleSearch = () => {
        if (!dest.trim()) { destRef.current?.focus(); return; }
        onSearch?.({ origin, destination: dest, fromDate, toDate, nights, guests, currency });
    };

    const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

    /* ── Field + Label helper styles ── */
    const fieldBox: React.CSSProperties = {
        padding: '1.1rem 1.25rem',
        borderRight: '1px solid rgba(26,35,64,0.08)',
        cursor: 'text',
        display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
    };
    const fieldLabel: React.CSSProperties = {
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.6875rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        color: '#8A94A6', marginBottom: '0.3rem',
    };
    const fieldInput: React.CSSProperties = {
        background: 'transparent', border: 'none', outline: 'none',
        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem',
        fontWeight: 500, color: '#1A2340', width: '100%',
    };

    return (
        <div style={{ background: '#FFFBF5' }}>

            {/* ══════════════════════════════════════
          CINEMATIC HERO
      ══════════════════════════════════════ */}
            <section style={{
                position: 'relative', height: '100vh', minHeight: '640px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden',
            }}>
                <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Beautiful travel destination" fill priority unoptimized
                    style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,21,38,0.15) 0%, rgba(13,21,38,0.35) 50%, rgba(13,21,38,0.72) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,21,38,0.4) 0%, transparent 60%)' }} />

                <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 2rem 5rem', width: '100%' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px',
                        padding: '0.35rem 0.875rem', marginBottom: '1.25rem',
                    }}>
                        <Star style={{ width: '0.75rem', height: '0.75rem', color: '#E8A838', fill: '#E8A838' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            AI-Powered Travel Planning
                        </span>
                    </div>
                    <h1 style={{
                        fontFamily: 'Fraunces, serif',
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 700, color: 'white', lineHeight: 1.05,
                        marginBottom: '1rem', maxWidth: '680px', letterSpacing: '-0.02em',
                    }}>
                        Your next great<br />
                        <em style={{ fontStyle: 'italic', color: '#FF8E8E' }}>adventure</em> starts here.
                    </h1>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: '1.0625rem', maxWidth: '440px', lineHeight: 1.65 }}>
                        Tell us where you want to go. Our AI builds a personalised itinerary in seconds.
                    </p>
                </div>

                {/* Bottom fade */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #FFFBF5 0%, transparent 100%)' }} />
            </section>

            {/* ══════════════════════════════════════
          SEARCH CARD
      ══════════════════════════════════════ */}
            <section style={{ background: '#FFFBF5', padding: '0 2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', marginTop: '-2.5rem', position: 'relative', zIndex: 20 }}>

                    <div style={{
                        background: '#ffffff', borderRadius: '1.5rem',
                        boxShadow: '0 8px 64px rgba(26,35,64,0.14), 0 2px 16px rgba(26,35,64,0.08)',
                        border: '1px solid rgba(26,35,64,0.06)', overflow: 'hidden',
                    }}>

                        {/* ── ROW 1: From | To | Guests | Currency ── */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', borderBottom: '1px solid rgba(26,35,64,0.07)' }}>

                            {/* From */}
                            <div style={{ ...fieldBox, flex: '2 1 180px' }} onClick={() => originRef.current?.focus()}>
                                <Navigation style={{ width: '1.125rem', height: '1.125rem', color: '#4ECDC4', marginTop: '0.125rem', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={fieldLabel}>From</p>
                                    <input
                                        ref={originRef} type="text" value={origin} onChange={e => setOrigin(e.target.value)}
                                        placeholder="Your city or airport"
                                        style={fieldInput}
                                    />
                                </div>
                            </div>

                            {/* To */}
                            <div style={{ ...fieldBox, flex: '2 1 180px' }} onClick={() => destRef.current?.focus()}>
                                <MapPin style={{ width: '1.125rem', height: '1.125rem', color: '#FF6B6B', marginTop: '0.125rem', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={fieldLabel}>To</p>
                                    <input
                                        ref={destRef} type="text" value={dest} onChange={e => setDest(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        placeholder="Destination city or country"
                                        style={fieldInput}
                                    />
                                </div>
                            </div>

                            {/* Currency */}
                            <div style={{ ...fieldBox, flex: '1 1 130px', position: 'relative', cursor: 'pointer' }} onClick={() => setShowCurrencyMenu(v => !v)}>
                                <DollarSign style={{ width: '1.125rem', height: '1.125rem', color: '#E8A838', marginTop: '0.125rem', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={fieldLabel}>Currency</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                                        <span style={{ fontWeight: 600, color: '#1A2340', fontSize: '0.9375rem' }}>{selectedCurrency.symbol} {selectedCurrency.code}</span>
                                    </div>
                                </div>

                                {/* Dropdown */}
                                {showCurrencyMenu && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, zIndex: 50,
                                        background: 'white', borderRadius: '0.875rem', minWidth: '220px',
                                        boxShadow: '0 8px 32px rgba(26,35,64,0.14)', marginTop: '0.5rem',
                                        border: '1px solid rgba(26,35,64,0.08)', overflow: 'hidden',
                                    }}>
                                        {CURRENCIES.map(c => (
                                            <div
                                                key={c.code}
                                                onClick={(e) => { e.stopPropagation(); setCurrency(c.code); setShowCurrencyMenu(false); }}
                                                style={{
                                                    padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    background: currency === c.code ? 'rgba(255,107,107,0.06)' : 'transparent',
                                                    cursor: 'pointer', transition: 'background 0.1s',
                                                }}
                                                className="hover:bg-[rgba(26,35,64,0.04)]"
                                            >
                                                <span style={{ fontWeight: 700, color: '#1A2340', minWidth: '2rem' }}>{c.symbol}</span>
                                                <div>
                                                    <p style={{ fontWeight: 600, color: '#1A2340', fontSize: '0.875rem' }}>{c.code}</p>
                                                    <p style={{ color: '#8A94A6', fontSize: '0.75rem' }}>{c.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Guests */}
                            <div style={{ ...fieldBox, flex: '1 1 130px', borderRight: 'none' }}>
                                <Users style={{ width: '1.125rem', height: '1.125rem', color: '#E8A838', marginTop: '0.125rem', flexShrink: 0 }} />
                                <div>
                                    <p style={fieldLabel}>Guests</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent', cursor: 'pointer', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>−</button>
                                        <span style={{ fontWeight: 700, color: '#1A2340', minWidth: '1.5rem', textAlign: 'center' }}>{guests}</span>
                                        <button onClick={() => setGuests(g => g + 1)} style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent', cursor: 'pointer', color: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── ROW 2: From Date | To Date | Search button ── */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>

                            {/* Depart */}
                            <div style={{ ...fieldBox, flex: '1 1 200px' }}>
                                <Calendar style={{ width: '1.125rem', height: '1.125rem', color: '#FF6B6B', marginTop: '0.125rem', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={fieldLabel}>Depart</p>
                                    <input
                                        type="date" value={fromDate} min={today}
                                        onChange={e => {
                                            setFromDate(e.target.value);
                                            if (e.target.value >= toDate) {
                                                const d = new Date(e.target.value);
                                                d.setDate(d.getDate() + 1);
                                                setToDate(d.toISOString().split('T')[0]);
                                            }
                                        }}
                                        style={{ ...fieldInput, cursor: 'pointer' }}
                                    />
                                </div>
                            </div>

                            {/* Return */}
                            <div style={{ ...fieldBox, flex: '1 1 200px' }}>
                                <Calendar style={{ width: '1.125rem', height: '1.125rem', color: '#4ECDC4', marginTop: '0.125rem', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={fieldLabel}>Return · <span style={{ color: '#FF6B6B', fontWeight: 700 }}>{nights} night{nights !== 1 ? 's' : ''}</span></p>
                                    <input
                                        type="date" value={toDate} min={fromDate}
                                        onChange={e => setToDate(e.target.value)}
                                        style={{ ...fieldInput, cursor: 'pointer' }}
                                    />
                                </div>
                            </div>

                            {/* Search button */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0.875rem', marginLeft: 'auto' }}>
                                <button onClick={handleSearch} className="btn-primary" style={{ height: '100%', borderRadius: '0.875rem', gap: '0.5rem', paddingLeft: '1.75rem', paddingRight: '1.75rem', fontSize: '0.9375rem' }}>
                                    <Search style={{ width: '1rem', height: '1rem' }} />
                                    Plan my trip
                                </button>
                            </div>
                        </div>

                        {/* Quick picks */}
                        <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid rgba(26,35,64,0.06)', display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8125rem', color: '#8A94A6', fontWeight: 500 }}>Popular to:</span>
                            {QUICK_PICKS.map(place => (
                                <button
                                    key={place}
                                    onClick={() => setDest(place)}
                                    style={{ background: 'transparent', border: '1px solid rgba(26,35,64,0.12)', borderRadius: '100px', padding: '0.25rem 0.75rem', fontSize: '0.8125rem', fontWeight: 500, color: '#4A5568', cursor: 'pointer', transition: 'all 0.15s' }}
                                    className="hover:border-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.05)]"
                                >
                                    {place}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── AI Travel Advisory Banner ── */}
                    {(advisory || advLoading) && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '0.875rem',
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: advLoading ? 'rgba(26,35,64,0.04)' : ADVISORY_STYLES[advisory!.verdict].bg,
                            border: `1px solid ${advLoading ? 'rgba(26,35,64,0.10)' : ADVISORY_STYLES[advisory!.verdict].border}`,
                            transition: 'all 0.3s',
                        }}>
                            {advLoading
                                ? <Loader2 style={{ width: '1rem', height: '1rem', color: '#8A94A6', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                                : (() => {
                                    const { Icon, text } = ADVISORY_STYLES[advisory!.verdict];
                                    return <Icon style={{ width: '1rem', height: '1rem', color: text, flexShrink: 0 }} />;
                                })()
                            }
                            <p style={{
                                fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', fontWeight: 500,
                                color: advLoading ? '#8A94A6' : ADVISORY_STYLES[advisory!.verdict].text,
                            }}>
                                {advLoading ? `Getting AI travel advisory for ${dest}…` : advisory?.message}
                            </p>
                        </div>
                    )}

                    {/* Trust badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.25rem', justifyContent: 'center' }}>
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Icon style={{ width: '0.875rem', height: '0.875rem', color: '#FF6B6B' }} />
                                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#8A94A6' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          POPULAR DESTINATIONS — 8 cards
      ══════════════════════════════════════ */}
            <section style={{ padding: '5rem 2rem 6rem', background: '#FFFBF5' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.25)', borderRadius: '100px', padding: '0.25rem 0.75rem', marginBottom: '0.75rem' }}>
                                <TrendingUp style={{ width: '0.75rem', height: '0.75rem', color: '#2A9D8F' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2A9D8F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Trending Now</span>
                            </div>
                            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: '#1A2340', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                Popular Destinations
                            </h2>
                        </div>
                        <a href="/destinations" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, fontSize: '0.9375rem', color: '#FF6B6B', textDecoration: 'none' }}>
                            View all <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                        </a>
                    </div>

                    {/* 2-row grid of 4 columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {DESTINATIONS.map((d, i) => (
                            <div
                                key={d.name}
                                className="card-hover"
                                onClick={() => setDest(d.name)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                    <Image src={d.image} alt={d.name} fill unoptimized style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,35,64,0.55) 0%, transparent 60%)' }} />
                                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: '100px', padding: '0.18rem 0.6rem', border: '1px solid rgba(255,255,255,0.25)' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white', letterSpacing: '0.04em' }}>{d.tag}</span>
                                    </div>
                                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', borderRadius: '100px', padding: '0.18rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.2rem', border: '1px solid rgba(255,255,255,0.12)' }}>
                                        <Star style={{ width: '0.55rem', height: '0.55rem', color: '#E8A838', fill: '#E8A838' }} />
                                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>{d.stat}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.0625rem', fontWeight: 700, color: '#1A2340', marginBottom: '0.2rem' }}>{d.name}</h3>
                                    <p style={{ color: '#8A94A6', fontSize: '0.8125rem', fontWeight: 500 }}>{d.country}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════ */}
            <section style={{ background: '#1A2340', padding: '3.5rem 2rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    {[
                        { value: '2M+', label: 'Happy travellers' },
                        { value: '150+', label: 'Countries covered' },
                        { value: '98%', label: 'Satisfaction rate' },
                        { value: '<5s', label: 'To generate a plan' },
                    ].map(s => (
                        <div key={s.label}>
                            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.25rem', fontWeight: 700, color: '#FF8E8E', lineHeight: 1 }}>{s.value}</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500, marginTop: '0.5rem' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
