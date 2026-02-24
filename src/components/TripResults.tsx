'use client';

import {
    ArrowLeft, Download, Share2, DollarSign, Sun, Star, MapPin,
    Clock, Utensils, Camera, Mountain, Cloud, Plane, Bus, Car,
    PersonStanding, Loader2, Plus, Minus,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback } from 'react';

/* ─── Types ─── */
interface TransportFromPrevious { mode: string; cost: number; }
interface Activity {
    time?: string; name?: string; title?: string; description?: string;
    estimatedCost?: number; price?: number | string;
    vibe?: string; transportFromPrevious?: TransportFromPrevious | null;
}
interface DayItinerary { day: number; date?: string; activities?: Activity[]; }
interface FlightEstimate { economy: number; business: number; currency: string; }
interface TripDataType {
    destination: string; duration?: number; itinerary?: DayItinerary[];
    totalCost?: number; guests?: number; currency?: string;
    image?: string; flightEstimate?: FlightEstimate; origin?: string;
}
interface TripResultsProps { tripData: TripDataType; onBack: () => void; }

/* ─── Helpers ─── */
const VIBE: Record<string, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    Adventure: { bg: 'rgba(255,107,107,0.1)', text: '#E85555', icon: Mountain },
    Foodie: { bg: 'rgba(232,168,56,0.12)', text: '#C67D0D', icon: Utensils },
    Culture: { bg: 'rgba(78,205,196,0.1)', text: '#2A9D8F', icon: Camera },
    Chill: { bg: 'rgba(132,160,255,0.12)', text: '#4B6BFF', icon: Cloud },
};
const getVibe = (v?: string) => VIBE[v || ''] || { bg: 'rgba(26,35,64,0.07)', text: '#4A5568', icon: MapPin };

const TICONS: Record<string, React.ComponentType<any>> = {
    walk: PersonStanding, metro: Bus, bus: Bus, taxi: Car, car: Car, plane: Plane,
};
const getTIcon = (m: string) => {
    const k = m.toLowerCase();
    for (const key of Object.keys(TICONS)) if (k.includes(key)) return TICONS[key];
    return Car;
};

const fmt = (n: number, c = 'USD') => {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n); }
    catch { return `${c} ${n.toLocaleString()}`; }
};

const BREAKDOWN = [
    { label: 'Accommodation', pct: 40, color: '#FF6B6B' },
    { label: 'Activities', pct: 25, color: '#4ECDC4' },
    { label: 'Food & Drink', pct: 25, color: '#E8A838' },
    { label: 'Transport', pct: 10, color: '#8B7CF6' },
];

/* ─── Component ─── */
export default function TripResults({ tripData, onBack }: TripResultsProps) {
    const [activeDay, setActiveDay] = useState(0);
    const [budget, setBudget] = useState(tripData.totalCost || 2500);
    const [flightClass, setFlightClass] = useState<'economy' | 'business'>('economy');
    const [regenLoading, setRegenLoading] = useState(false);
    const [localTrip, setLocalTrip] = useState(tripData);

    const itinerary = localTrip.itinerary || [];
    const currentDay = itinerary[activeDay];
    const totalActs = itinerary.reduce((s, d) => s + (d.activities?.length || 0), 0);
    const cc = localTrip.currency || 'USD';
    const flight = localTrip.flightEstimate;
    const dayTotal = currentDay?.activities?.reduce((s, a) => s + (a.estimatedCost || Number(a.price) || 0), 0) || 0;

    const stepBudget = useCallback(async (dir: 1 | -1) => {
        const step = Math.round((budget * 0.1) / 50) * 50;
        const next = Math.max(200, budget + dir * step);
        setBudget(next);
        setRegenLoading(true);
        try {
            const res = await fetch('/api/trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: localTrip.destination,
                    days: localTrip.duration || itinerary.length,
                    currency: cc, guests: localTrip.guests || 2,
                    adjustedBudget: next,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setLocalTrip(p => ({ ...p, ...data, image: p.image }));
            }
        } catch { /* keep existing */ }
        setRegenLoading(false);
    }, [budget, localTrip, itinerary.length, cc]);

    /* ── shared card style ── */
    const card: React.CSSProperties = {
        background: 'white', borderRadius: '1rem', border: '1px solid rgba(26,35,64,0.07)',
        boxShadow: '0 2px 16px rgba(26,35,64,0.07)',
    };

    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>

            {/* ── HERO ── */}
            <div style={{ position: 'relative', height: '52vh', minHeight: '320px', overflow: 'hidden' }}>
                <Image
                    src={localTrip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop'}
                    alt={localTrip.destination} fill priority unoptimized
                    style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,21,38,0.25) 0%, rgba(13,21,38,0.65) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #FFFBF5, transparent)' }} />

                {/* Back */}
                <div style={{ position: 'absolute', top: '5.5rem', left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.45rem 0.875rem', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>
                        <ArrowLeft style={{ width: '0.8rem', height: '0.8rem' }} /> Back
                    </button>
                </div>

                {/* Title */}
                <div style={{ position: 'absolute', bottom: '1.75rem', left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {localTrip.destination}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {[`${localTrip.duration || itinerary.length} days`, `${totalActs} experiences`, `${localTrip.guests || 2} guests`].map(t => (
                            <span key={t} style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>

                {/* Regen overlay */}
                {regenLoading && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(255,251,245,0.85)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.875rem' }}>
                        <Loader2 style={{ width: '2.5rem', height: '2.5rem', color: '#FF6B6B', animation: 'tr-spin 1s linear infinite' }} />
                        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.125rem', color: '#1A2340' }}>Replanning for {fmt(budget, cc)}…</p>
                    </div>
                )}

                {/* ══ 2-column layout ══ */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 310px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* ─── LEFT: Itinerary ─── */}
                    <div>
                        {/* Day tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
                            {itinerary.map((day, i) => (
                                <button key={i} onClick={() => setActiveDay(i)} style={{ flexShrink: 0, padding: '0.5rem 1.1rem', borderRadius: '100px', border: activeDay === i ? 'none' : '1.5px solid rgba(26,35,64,0.12)', background: activeDay === i ? '#FF6B6B' : 'white', color: activeDay === i ? 'white' : '#4A5568', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: activeDay === i ? '0 4px 16px rgba(255,107,107,0.3)' : 'none', transition: 'all 0.2s' }}>
                                    Day {day.day}
                                </button>
                            ))}
                        </div>

                        {currentDay && (
                            <div style={{ ...card, padding: '1.75rem' }}>
                                {/* Day header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', color: '#1A2340', marginBottom: '0.2rem' }}>Day {currentDay.day}</h2>
                                        {currentDay.date && <p style={{ color: '#8A94A6', fontSize: '0.875rem' }}>{currentDay.date}</p>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <span style={{ background: 'rgba(26,35,64,0.06)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568' }}>{currentDay.activities?.length || 0} activities</span>
                                        {dayTotal > 0 && <span style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 700, color: '#FF6B6B' }}>~{fmt(dayTotal, cc)} today</span>}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    {currentDay.activities?.map((act, i) => {
                                        const vibe = getVibe(act.vibe);
                                        const VIcon = vibe.icon;
                                        const isLast = i === (currentDay.activities?.length || 0) - 1;
                                        const tp = act.transportFromPrevious;
                                        const TIcon = tp ? getTIcon(tp.mode) : null;

                                        return (
                                            <div key={i}>
                                                {tp && i > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.125rem 0 0.125rem 0.75rem' }}>
                                                        <div style={{ width: '1.5px', height: '1rem', background: 'rgba(26,35,64,0.08)' }} />
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(78,205,196,0.07)', border: '1px solid rgba(78,205,196,0.18)', borderRadius: '100px', padding: '0.15rem 0.5rem' }}>
                                                            {TIcon && <TIcon style={{ width: '0.6rem', height: '0.6rem', color: '#2A9D8F' }} />}
                                                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#2A9D8F' }}>{tp.mode} · {fmt(tp.cost, cc)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0.125rem' }}>
                                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF6B6B', boxShadow: '0 0 0 3px rgba(255,107,107,0.2)', flexShrink: 0 }} />
                                                        {!isLast && <div style={{ width: '1.5px', flex: 1, minHeight: '2.25rem', background: 'rgba(26,35,64,0.08)', margin: '4px 0' }} />}
                                                    </div>
                                                    <div style={{ flex: 1, paddingBottom: isLast ? 0 : '1.5rem' }}>
                                                        {act.time && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.275rem' }}>
                                                                <Clock style={{ width: '0.7rem', height: '0.7rem', color: '#8A94A6' }} />
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A94A6' }}>{act.time}</span>
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                            <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', fontWeight: 700, color: '#1A2340', marginBottom: '0.3rem' }}>{act.name || act.title || 'Activity'}</h4>
                                                            {act.vibe && (
                                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: vibe.bg, borderRadius: '100px', padding: '0.175rem 0.55rem', flexShrink: 0 }}>
                                                                    <VIcon style={{ width: '0.575rem', height: '0.575rem', color: vibe.text }} />
                                                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: vibe.text }}>{act.vibe}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p style={{ color: '#4A5568', fontSize: '0.875rem', lineHeight: 1.6 }}>{act.description}</p>
                                                        {(act.estimatedCost !== undefined || act.price) && (
                                                            <p style={{ marginTop: '0.35rem', color: '#8A94A6', fontSize: '0.8125rem', fontWeight: 600 }}>
                                                                {fmt(act.estimatedCost ?? Number(act.price) ?? 0, cc)} per person
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ─── RIGHT: Sticky sidebar — NO overflow clipping ─── */}
                    <div style={{ position: 'sticky', top: '5.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* ── FLIGHT CARD ── */}
                        {(flight || localTrip.origin) && (
                            <div style={{ ...card, padding: '1.25rem' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(78,205,196,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Plane style={{ width: '0.9rem', height: '0.9rem', color: '#2A9D8F' }} />
                                    </div>
                                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: '#1A2340', fontWeight: 700 }}>Flight Estimate</h3>
                                </div>

                                {/* Route */}
                                {localTrip.origin && (
                                    <p style={{ fontSize: '0.8125rem', color: '#8A94A6', marginBottom: '0.875rem', fontWeight: 500 }}>
                                        ✈ {localTrip.origin.split(',')[0]} → {localTrip.destination.split(',')[0]}
                                    </p>
                                )}

                                {/* Class toggle */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(26,35,64,0.05)', borderRadius: '0.5rem', padding: '0.2rem', marginBottom: '1rem' }}>
                                    {(['economy', 'business'] as const).map(cls => (
                                        <button key={cls} onClick={() => setFlightClass(cls)} style={{ padding: '0.375rem', borderRadius: '0.35rem', border: 'none', background: flightClass === cls ? 'white' : 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.8125rem', color: flightClass === cls ? '#1A2340' : '#8A94A6', cursor: 'pointer', boxShadow: flightClass === cls ? '0 1px 4px rgba(26,35,64,0.1)' : 'none', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                                            {cls}
                                        </button>
                                    ))}
                                </div>

                                {/* Price */}
                                {flight ? (
                                    <>
                                        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#1A2340', lineHeight: 1 }}>
                                            {fmt(flight[flightClass], flight.currency || cc)}
                                        </p>
                                        <p style={{ color: '#8A94A6', fontSize: '0.8rem', marginTop: '0.25rem' }}>per person · round trip</p>
                                        <div style={{ marginTop: '0.625rem', padding: '0.5rem 0.75rem', background: 'rgba(78,205,196,0.07)', borderRadius: '0.625rem', border: '1px solid rgba(78,205,196,0.15)' }}>
                                            <p style={{ color: '#2A9D8F', fontSize: '0.8rem', fontWeight: 700 }}>
                                                {localTrip.guests || 2} guests total: {fmt(flight[flightClass] * (localTrip.guests || 2), flight.currency || cc)}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: '#8A94A6', fontSize: '0.8125rem', lineHeight: 1.55 }}>
                                        AI-estimated round-trip fare based on typical prices for this route.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* ── BUDGET CARD ── */}
                        <div style={{ ...card, padding: '1.25rem' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,107,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <DollarSign style={{ width: '0.9rem', height: '0.9rem', color: '#FF6B6B' }} />
                                    </div>
                                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: '#1A2340', fontWeight: 700 }}>Trip Budget</h3>
                                </div>
                                {/* +/- controls */}
                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                    <button onClick={() => stepBudget(-1)} disabled={regenLoading} style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.15)', background: 'white', cursor: regenLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568', transition: 'all 0.15s' }}>
                                        <Minus style={{ width: '0.8rem', height: '0.8rem' }} />
                                    </button>
                                    <button onClick={() => stepBudget(1)} disabled={regenLoading} style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.15)', background: 'white', cursor: regenLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568', transition: 'all 0.15s' }}>
                                        <Plus style={{ width: '0.8rem', height: '0.8rem' }} />
                                    </button>
                                </div>
                            </div>

                            {/* Amount */}
                            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.125rem', fontWeight: 700, color: '#1A2340', lineHeight: 1, marginBottom: '0.25rem' }}>
                                {fmt(budget, cc)}
                            </p>
                            <p style={{ color: '#8A94A6', fontSize: '0.75rem', marginBottom: '1rem' }}>±10% per click · Groq re-plans to fit</p>

                            {/* Breakdown */}
                            {BREAKDOWN.map(({ label, pct, color }) => (
                                <div key={label} style={{ marginBottom: '0.625rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#4A5568', fontWeight: 500 }}>{label}</span>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color }}>{fmt(Math.round(budget * pct / 100), cc)}</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#F0EBE0', borderRadius: '100px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '100px' }} />
                                    </div>
                                </div>
                            ))}

                            <button style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #FF6B6B, #E85555)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9375rem', boxShadow: '0 4px 16px rgba(255,107,107,0.3)' }}>
                                Book This Trip
                            </button>
                        </div>

                        {/* ── WEATHER CARD ── */}
                        <div style={{ ...card, padding: '1.25rem', background: 'linear-gradient(135deg, #1A2340 0%, #0D1526 100%)', borderColor: 'transparent' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Sun style={{ width: '1rem', height: '1rem', color: '#E8A838', flexShrink: 0 }} />
                                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: 'white', fontWeight: 700 }}>Weather</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>24°C</p>
                                    <p style={{ color: '#4ECDC4', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.375rem' }}>Sunny &amp; clear</p>
                                </div>
                                <Sun style={{ width: '3.5rem', height: '3.5rem', color: 'rgba(232,168,56,0.22)', flexShrink: 0 }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.875rem' }}>{localTrip.destination}</p>
                        </div>

                        {/* ── Download / Share ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                            {[{ icon: Download, label: 'Save PDF' }, { icon: Share2, label: 'Share' }].map(({ icon: Icon, label }) => (
                                <button key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.7rem', border: '1.5px solid rgba(26,35,64,0.12)', borderRadius: '0.75rem', background: 'white', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568', fontFamily: 'DM Sans, sans-serif' }}>
                                    <Icon style={{ width: '0.8rem', height: '0.8rem' }} /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RESPONSIVE ── */}
            <style>{`
                @keyframes tr-spin { to { transform: rotate(360deg); } }

                /* tablet + mobile: stack to single column */
                @media (max-width: 860px) {
                    /* Un-sticky, un-overflow — render as normal block */
                    div[style*="position: sticky"][style*="top: 5.5rem"] {
                        position: static !important;
                        top: auto !important;
                    }
                }
            `}</style>
        </div>
    );
}
