'use client';

import { ArrowLeft, Download, Share2, DollarSign, Cloud, Sun, Star, MapPin, Clock, Utensils, Camera, Mountain } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Activity {
    time?: string;
    name?: string;
    title?: string;
    description?: string;
    type?: string;
    estimatedCost?: number;
    price?: number | string;
    importance?: string;
    vibe?: string;
}

interface DayItinerary {
    day: number;
    date?: string;
    activities?: Activity[];
}

interface TripDataType {
    destination: string;
    duration?: number;
    itinerary?: DayItinerary[];
    totalCost?: number;
    guests?: number;
    image?: string;
}

interface TripResultsProps {
    tripData: TripDataType;
    onBack: () => void;
}

const VIBE_COLORS: Record<string, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    Adventure: { bg: 'rgba(255,107,107,0.1)', text: '#E85555', icon: Mountain },
    Foodie: { bg: 'rgba(232,168,56,0.12)', text: '#C67D0D', icon: Utensils },
    Culture: { bg: 'rgba(78,205,196,0.1)', text: '#2A9D8F', icon: Camera },
    Chill: { bg: 'rgba(132,160,255,0.12)', text: '#4B6BFF', icon: Cloud },
};

function getVibeStyle(vibe?: string) {
    return VIBE_COLORS[vibe || ''] || { bg: 'rgba(26,35,64,0.07)', text: '#4A5568', icon: MapPin };
}

export default function TripResults({ tripData, onBack }: TripResultsProps) {
    const [activeDay, setActiveDay] = useState(0);

    const itinerary = tripData.itinerary || [];
    const currentDay = itinerary[activeDay];
    const totalActivities = itinerary.reduce((sum, d) => sum + (d.activities?.length || 0), 0);

    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>

            {/* ── HERO BANNER ── */}
            <div style={{ position: 'relative', height: '60vh', minHeight: '420px', overflow: 'hidden' }}>
                <Image
                    src={tripData.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop'}
                    alt={tripData.destination}
                    fill
                    priority
                    unoptimized
                    style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(13,21,38,0.3) 0%, rgba(13,21,38,0.6) 100%)',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,21,38,0.5), transparent 60%)' }} />

                {/* Bottom fade */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
                    background: 'linear-gradient(to top, #FFFBF5, transparent)',
                }} />

                {/* Back button */}
                <div style={{ position: 'absolute', top: '6rem', left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px',
                            padding: '0.5rem 1rem', color: 'white', cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                            transition: 'background 0.2s',
                        }}
                    >
                        <ArrowLeft style={{ width: '0.875rem', height: '0.875rem' }} />
                        Back to search
                    </button>
                </div>

                {/* Hero text */}
                <div style={{
                    position: 'absolute', bottom: '2rem', left: 0, right: 0,
                    maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
                }}>
                    <div className="chip-sage" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>AI-Planned Itinerary</div>
                    <h1 style={{
                        fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 700, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em',
                    }}>
                        {tripData.destination}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                        <span className="chip" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                            {tripData.duration || itinerary.length} days
                        </span>
                        <span className="chip" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                            {totalActivities} experiences
                        </span>
                        <span className="chip" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                            {tripData.guests || 2} guests
                        </span>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

                    {/* ── LEFT: Itinerary ── */}
                    <div>
                        {/* Day selector tabs */}
                        <div style={{
                            display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem',
                            marginBottom: '1.75rem', scrollbarWidth: 'none',
                        }}>
                            {itinerary.map((day, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveDay(i)}
                                    style={{
                                        flexShrink: 0,
                                        padding: '0.625rem 1.25rem',
                                        borderRadius: '100px',
                                        border: activeDay === i ? 'none' : '1.5px solid rgba(26,35,64,0.12)',
                                        background: activeDay === i ? '#FF6B6B' : 'white',
                                        color: activeDay === i ? 'white' : '#4A5568',
                                        fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                                        fontFamily: 'DM Sans, sans-serif',
                                        boxShadow: activeDay === i ? '0 4px 16px rgba(255,107,107,0.3)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Day {day.day}
                                </button>
                            ))}
                        </div>

                        {/* Day header */}
                        {currentDay && (
                            <div className="card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.625rem', color: '#1A2340', marginBottom: '0.25rem' }}>
                                            Day {currentDay.day}
                                        </h2>
                                        {currentDay.date && (
                                            <p style={{ color: '#8A94A6', fontSize: '0.875rem', fontWeight: 500 }}>{currentDay.date}</p>
                                        )}
                                    </div>
                                    <span className="chip">
                                        {currentDay.activities?.length || 0} activities
                                    </span>
                                </div>

                                {/* Activities timeline */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {currentDay.activities?.map((act, i) => {
                                        const vibe = getVibeStyle(act.vibe);
                                        const VibeIcon = vibe.icon;
                                        const isLast = i === (currentDay.activities?.length || 0) - 1;

                                        return (
                                            <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                                                {/* Timeline column */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0.125rem' }}>
                                                    <div className="timeline-dot" />
                                                    {!isLast && (
                                                        <div style={{
                                                            width: '1.5px', flex: 1, minHeight: '3rem',
                                                            background: 'rgba(26,35,64,0.08)',
                                                            margin: '4px 0',
                                                        }} />
                                                    )}
                                                </div>

                                                {/* Activity card */}
                                                <div style={{
                                                    flex: 1,
                                                    padding: '0 0 1.75rem',
                                                    paddingBottom: isLast ? 0 : '1.75rem',
                                                }}>
                                                    {/* Time */}
                                                    {act.time && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.375rem' }}>
                                                            <Clock style={{ width: '0.75rem', height: '0.75rem', color: '#8A94A6' }} />
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A94A6', letterSpacing: '0.04em' }}>
                                                                {act.time}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Title + vibe badge */}
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                                        <h4 style={{
                                                            fontFamily: 'DM Sans, sans-serif',
                                                            fontSize: '1rem', fontWeight: 700,
                                                            color: '#1A2340', marginBottom: '0.375rem',
                                                        }}>
                                                            {act.name || act.title || 'Activity'}
                                                        </h4>
                                                        {act.vibe && (
                                                            <div style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                                background: vibe.bg, borderRadius: '100px',
                                                                padding: '0.2rem 0.625rem', flexShrink: 0,
                                                            }}>
                                                                <VibeIcon style={{ width: '0.625rem', height: '0.625rem', color: vibe.text }} />
                                                                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: vibe.text, letterSpacing: '0.04em' }}>
                                                                    {act.vibe}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <p style={{ color: '#4A5568', fontSize: '0.9rem', lineHeight: 1.65 }}>
                                                        {act.description}
                                                    </p>

                                                    {/* Cost */}
                                                    {(act.estimatedCost !== undefined || act.price) && (
                                                        <p style={{ marginTop: '0.5rem', color: '#8A94A6', fontSize: '0.8125rem', fontWeight: 600 }}>
                                                            Est. ${act.estimatedCost ?? act.price}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Sidebar ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '6rem' }}>

                        {/* Budget card */}
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.125rem', color: '#1A2340' }}>Trip Budget</h3>
                                <div style={{
                                    width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                                    background: 'rgba(255,107,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <DollarSign style={{ width: '1rem', height: '1rem', color: '#FF6B6B' }} />
                                </div>
                            </div>

                            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1A2340', lineHeight: 1 }}>
                                ${(tripData.totalCost || 2500).toLocaleString()}
                            </p>
                            <p style={{ color: '#8A94A6', fontSize: '0.875rem', marginTop: '0.375rem', marginBottom: '1.25rem' }}>
                                Est. total for {tripData.guests || 2} guests
                            </p>

                            {/* Budget breakdown */}
                            {[
                                { label: 'Accommodation', pct: 40 },
                                { label: 'Activities', pct: 25 },
                                { label: 'Food & Drink', pct: 25 },
                                { label: 'Transport', pct: 10 },
                            ].map(({ label, pct }) => (
                                <div key={label} style={{ marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#4A5568', fontWeight: 500 }}>{label}</span>
                                        <span style={{ fontSize: '0.8125rem', color: '#8A94A6', fontWeight: 600 }}>{pct}%</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#F0EBE0', borderRadius: '100px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: '#FF6B6B', borderRadius: '100px' }} />
                                    </div>
                                </div>
                            ))}

                            <button className="btn-primary" style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}>
                                Book This Trip
                            </button>
                        </div>

                        {/* Weather card */}
                        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1A2340 0%, #0D1526 100%)', borderColor: 'transparent' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Sun style={{ width: '1rem', height: '1rem', color: '#E8A838' }} />
                                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: 'white' }}>Weather Forecast</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>24°C</p>
                                    <p style={{ color: '#4ECDC4', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.375rem' }}>Sunny & clear</p>
                                </div>
                                <Sun style={{ width: '4rem', height: '4rem', color: 'rgba(232,168,56,0.25)' }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.875rem' }}>{tripData.destination}</p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button className="btn-outline" style={{ justifyContent: 'center', gap: '0.4rem', fontSize: '0.8125rem', padding: '0.75rem' }}>
                                <Download style={{ width: '0.875rem', height: '0.875rem' }} /> Save PDF
                            </button>
                            <button className="btn-outline" style={{ justifyContent: 'center', gap: '0.4rem', fontSize: '0.8125rem', padding: '0.75rem' }}>
                                <Share2 style={{ width: '0.875rem', height: '0.875rem' }} /> Share
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
