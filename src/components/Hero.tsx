'use client';

import { useRef, useState } from 'react';
import {
    Search, MapPin, Calendar, Users, ChevronDown,
    Star, ArrowRight, TrendingUp, Shield, Zap
} from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
    onSearch?: (destination: string, days: number) => void;
}

const DESTINATIONS = [
    {
        name: 'Santorini',
        country: 'Greece',
        tag: 'Top Pick',
        stat: '4.97 ★',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Kyoto',
        country: 'Japan',
        tag: 'Cultural',
        stat: '4.94 ★',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'Bali',
        country: 'Indonesia',
        tag: 'Trending',
        stat: '4.92 ★',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    },
];

const QUICK_PICKS = ['Paris', 'Tokyo', 'Bali', 'New York', 'Amalfi', 'Marrakech'];

const FEATURES = [
    { icon: Zap, label: 'Instant AI plan' },
    { icon: Shield, label: 'Best price guarantee' },
    { icon: TrendingUp, label: 'Live availability' },
];

export default function Hero({ onSearch }: HeroProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [days, setDays] = useState(5);
    const [guests, setGuests] = useState(2);
    const [activeField, setActiveField] = useState<string | null>(null);

    const handleSearch = () => {
        const dest = inputRef.current?.value?.trim();
        if (dest && onSearch) onSearch(dest, days);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div style={{ background: '#FFFBF5' }}>

            {/* ══════════════════════════════════════
          HERO: Full-screen cinematic section
      ══════════════════════════════════════ */}
            <section
                style={{
                    position: 'relative',
                    height: '100vh',
                    minHeight: '640px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    overflow: 'hidden',
                }}
            >
                {/* Background image */}
                <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Beautiful travel destination"
                    fill
                    priority
                    unoptimized
                    style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                />

                {/* Gradient overlays */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(13,21,38,0.15) 0%, rgba(13,21,38,0.35) 50%, rgba(13,21,38,0.72) 100%)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(13,21,38,0.4) 0%, transparent 60%)',
                }} />

                {/* Hero text content */}
                <div
                    style={{
                        position: 'relative', zIndex: 10,
                        maxWidth: '1280px', margin: '0 auto',
                        padding: '0 2rem 5rem',
                        width: '100%',
                    }}
                >
                    {/* Label pill */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '100px',
                        padding: '0.35rem 0.875rem',
                        marginBottom: '1.25rem',
                    }}>
                        <Star style={{ width: '0.75rem', height: '0.75rem', color: '#E8A838', fill: '#E8A838' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            AI-Powered Travel Planning
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            fontFamily: 'Fraunces, serif',
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontWeight: 700,
                            color: 'white',
                            lineHeight: 1.05,
                            marginBottom: '1rem',
                            maxWidth: '680px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Your next great<br />
                        <em style={{ fontStyle: 'italic', color: '#FF8E8E' }}>adventure</em> starts here.
                    </h1>

                    <p style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: '1.0625rem',
                        maxWidth: '440px',
                        marginBottom: '0',
                        lineHeight: 1.65,
                    }}>
                        Tell us where you want to go. Our AI builds a beautiful,
                        personalised itinerary in seconds.
                    </p>
                </div>

                {/* Bottom fade into cream */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '120px',
                    background: 'linear-gradient(to top, #FFFBF5 0%, transparent 100%)',
                }} />
            </section>

            {/* ══════════════════════════════════════
          SEARCH CARD — floats below hero
      ══════════════════════════════════════ */}
            <section style={{ background: '#FFFBF5', padding: '0 2rem' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', marginTop: '-2.5rem', position: 'relative', zIndex: 20 }}>

                    <div style={{
                        background: '#ffffff',
                        borderRadius: '1.5rem',
                        boxShadow: '0 8px 64px rgba(26,35,64,0.14), 0 2px 16px rgba(26,35,64,0.08)',
                        border: '1px solid rgba(26,35,64,0.06)',
                        overflow: 'hidden',
                    }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>

                            {/* ── Where field ── */}
                            <div
                                onClick={() => { setActiveField('dest'); inputRef.current?.focus(); }}
                                style={{
                                    flex: '2 1 200px',
                                    padding: '1.25rem 1.5rem',
                                    cursor: 'text',
                                    background: activeField === 'dest' ? 'rgba(255,107,107,0.03)' : 'transparent',
                                    borderRight: '1px solid rgba(26,35,64,0.08)',
                                    transition: 'background 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <MapPin style={{ width: '1.125rem', height: '1.125rem', color: '#FF6B6B', marginTop: '0.125rem', flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <p className="section-label" style={{ marginBottom: '0.25rem' }}>Where to?</p>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="City, country, or region"
                                            className="search-input"
                                            onFocus={() => setActiveField('dest')}
                                            onBlur={() => setActiveField(null)}
                                            onKeyDown={handleKeyDown}
                                            style={{ fontSize: '0.9375rem' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Days field ── */}
                            <div style={{
                                flex: '1 1 140px',
                                padding: '1.25rem 1.5rem',
                                borderRight: '1px solid rgba(26,35,64,0.08)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <Calendar style={{ width: '1.125rem', height: '1.125rem', color: '#4ECDC4', marginTop: '0.125rem', flexShrink: 0 }} />
                                    <div>
                                        <p className="section-label" style={{ marginBottom: '0.25rem' }}>Duration</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                            <button
                                                onClick={() => setDays(d => Math.max(1, d - 1))}
                                                style={{
                                                    width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                                                    border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent',
                                                    cursor: 'pointer', color: '#4A5568', fontSize: '1rem',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'border-color 0.15s, color 0.15s',
                                                }}
                                                className="hover:border-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.05)]"
                                            >−</button>
                                            <span style={{ fontWeight: 700, color: '#1A2340', minWidth: '4rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                                                {days} {days === 1 ? 'day' : 'days'}
                                            </span>
                                            <button
                                                onClick={() => setDays(d => d + 1)}
                                                style={{
                                                    width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                                                    border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent',
                                                    cursor: 'pointer', color: '#4A5568', fontSize: '1rem',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'border-color 0.15s, color 0.15s',
                                                }}
                                                className="hover:border-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.05)]"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Guests field ── */}
                            <div style={{
                                flex: '1 1 140px',
                                padding: '1.25rem 1.5rem',
                                borderRight: '1px solid rgba(26,35,64,0.08)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <Users style={{ width: '1.125rem', height: '1.125rem', color: '#E8A838', marginTop: '0.125rem', flexShrink: 0 }} />
                                    <div>
                                        <p className="section-label" style={{ marginBottom: '0.25rem' }}>Guests</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                            <button
                                                onClick={() => setGuests(g => Math.max(1, g - 1))}
                                                style={{
                                                    width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                                                    border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent',
                                                    cursor: 'pointer', color: '#4A5568', fontSize: '1rem',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                                className="hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                                            >−</button>
                                            <span style={{ fontWeight: 700, color: '#1A2340', minWidth: '3rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                                                {guests}
                                            </span>
                                            <button
                                                onClick={() => setGuests(g => g + 1)}
                                                style={{
                                                    width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                                                    border: '1.5px solid rgba(26,35,64,0.2)', background: 'transparent',
                                                    cursor: 'pointer', color: '#4A5568', fontSize: '1rem',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                                className="hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Search button ── */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '0.875rem' }}>
                                <button
                                    onClick={handleSearch}
                                    className="btn-primary"
                                    style={{ height: '100%', paddingLeft: '1.75rem', paddingRight: '1.75rem', borderRadius: '0.875rem', gap: '0.5rem' }}
                                >
                                    <Search style={{ width: '1rem', height: '1rem' }} />
                                    Plan my trip
                                </button>
                            </div>
                        </div>

                        {/* Quick picks */}
                        <div style={{
                            padding: '0.875rem 1.5rem',
                            borderTop: '1px solid rgba(26,35,64,0.06)',
                            display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap',
                        }}>
                            <span style={{ fontSize: '0.8125rem', color: '#8A94A6', fontWeight: 500 }}>Popular:</span>
                            {QUICK_PICKS.map(place => (
                                <button
                                    key={place}
                                    onClick={() => { if (inputRef.current) inputRef.current.value = place; }}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(26,35,64,0.12)',
                                        borderRadius: '100px',
                                        padding: '0.25rem 0.75rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        color: '#4A5568',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                    className="hover:border-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.05)]"
                                >
                                    {place}
                                </button>
                            ))}
                        </div>
                    </div>

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
          TRENDING DESTINATIONS SECTION
      ══════════════════════════════════════ */}
            <section style={{ padding: '5rem 2rem 6rem', background: '#FFFBF5' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                        <div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                                background: 'rgba(78,205,196,0.1)', border: '1px solid rgba(78,205,196,0.25)',
                                borderRadius: '100px', padding: '0.25rem 0.75rem', marginBottom: '0.75rem',
                            }}>
                                <TrendingUp style={{ width: '0.75rem', height: '0.75rem', color: '#2A9D8F' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2A9D8F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                    Trending Now
                                </span>
                            </div>
                            <h2 style={{
                                fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                                fontWeight: 700, color: '#1A2340', letterSpacing: '-0.02em', lineHeight: 1.1,
                            }}>
                                Popular Destinations
                            </h2>
                        </div>
                        <a
                            href="#"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                                fontWeight: 600, fontSize: '0.9375rem', color: '#FF6B6B',
                                textDecoration: 'none', transition: 'gap 0.15s',
                            }}
                            className="hover:gap-2"
                        >
                            View all <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                        </a>
                    </div>

                    {/* Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {DESTINATIONS.map((dest, i) => (
                            <div
                                key={dest.name}
                                className="card-hover"
                                onClick={() => {
                                    if (inputRef.current) inputRef.current.value = dest.name;
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                {/* Image */}
                                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                                    <Image
                                        src={dest.image}
                                        alt={dest.name}
                                        fill
                                        unoptimized
                                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        className="group-hover:scale-110"
                                    />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(26,35,64,0.55) 0%, transparent 60%)',
                                    }} />

                                    {/* Top badge */}
                                    <div style={{
                                        position: 'absolute', top: '0.875rem', left: '0.875rem',
                                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                        borderRadius: '100px', padding: '0.2rem 0.625rem',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                    }}>
                                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'white', letterSpacing: '0.04em' }}>
                                            {dest.tag}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div style={{
                                        position: 'absolute', top: '0.875rem', right: '0.875rem',
                                        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)',
                                        borderRadius: '100px', padding: '0.2rem 0.625rem',
                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                    }}>
                                        <Star style={{ width: '0.625rem', height: '0.625rem', color: '#E8A838', fill: '#E8A838' }} />
                                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>{dest.stat}</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div style={{ padding: '1.25rem' }}>
                                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, color: '#1A2340', marginBottom: '0.25rem' }}>
                                        {dest.name}
                                    </h3>
                                    <p style={{ color: '#8A94A6', fontSize: '0.875rem', fontWeight: 500 }}>{dest.country}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          STATS / TRUST STRIP
      ══════════════════════════════════════ */}
            <section style={{ background: '#1A2340', padding: '3.5rem 2rem' }}>
                <div style={{
                    maxWidth: '1280px', margin: '0 auto',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '2rem', textAlign: 'center',
                }}>
                    {[
                        { value: '2M+', label: 'Happy travellers' },
                        { value: '150+', label: 'Countries covered' },
                        { value: '98%', label: 'Satisfaction rate' },
                        { value: '<5s', label: 'To generate a plan' },
                    ].map(s => (
                        <div key={s.label}>
                            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.25rem', fontWeight: 700, color: '#FF8E8E', lineHeight: 1 }}>
                                {s.value}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: 500, marginTop: '0.5rem' }}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
