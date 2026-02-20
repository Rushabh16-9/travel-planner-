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
    time?: string;
    name?: string;
    title?: string;
    description?: string;
    estimatedCost?: number;
    price?: number | string;
    vibe?: string;
    transportFromPrevious?: TransportFromPrevious | null;
}

interface DayItinerary { day: number; date?: string; activities?: Activity[]; }

interface FlightEstimate { economy: number; business: number; currency: string; }

interface TripDataType {
    destination: string;
    duration?: number;
    itinerary?: DayItinerary[];
    totalCost?: number;
    guests?: number;
    currency?: string;
    image?: string;
    flightEstimate?: FlightEstimate;
    origin?: string;
}

interface TripResultsProps { tripData: TripDataType; onBack: () => void; }

/* ─── Helpers ─── */
const VIBE_COLORS: Record<string, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    Adventure: { bg: 'rgba(255,107,107,0.1)', text: '#E85555', icon: Mountain },
    Foodie: { bg: 'rgba(232,168,56,0.12)', text: '#C67D0D', icon: Utensils },
    Culture: { bg: 'rgba(78,205,196,0.1)', text: '#2A9D8F', icon: Camera },
    Chill: { bg: 'rgba(132,160,255,0.12)', text: '#4B6BFF', icon: Cloud },
};
function getVibeStyle(vibe?: string) {
    return VIBE_COLORS[vibe || ''] || { bg: 'rgba(26,35,64,0.07)', text: '#4A5568', icon: MapPin };
}

const TRANSPORT_ICONS: Record<string, React.ComponentType<any>> = {
    walk: PersonStanding, metro: Bus, bus: Bus, taxi: Car, car: Car, plane: Plane,
};
function getTransportIcon(mode: string): React.ComponentType<any> {
    const key = mode.toLowerCase();
    for (const k of Object.keys(TRANSPORT_ICONS)) {
        if (key.includes(k)) return TRANSPORT_ICONS[k];
    }
    return Car;
}

const cur = (amount: number, code = 'USD') => {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(amount); }
    catch { return `${code} ${amount.toLocaleString()}`; }
};

/* ─── Sidebar sub-components ─── */
function FlightCard({ flight, origin, destination, guests, currCode, flightClass, setFlightClass }: {
    flight?: FlightEstimate; origin?: string; destination: string; guests: number;
    currCode: string; flightClass: 'economy' | 'business'; setFlightClass: (c: 'economy' | 'business') => void;
}) {
    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: 'rgba(78,205,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Plane style={{ width: '0.85rem', height: '0.85rem', color: '#2A9D8F' }} />
                </div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: '#1A2340' }}>Flight Estimate</h3>
            </div>

            {origin && (
                <p style={{ fontSize: '0.8125rem', color: '#8A94A6', marginBottom: '0.75rem', fontWeight: 500 }}>
                    ✈ {origin} → {destination}
                </p>
            )}

            {/* Class toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(26,35,64,0.05)', borderRadius: '0.5rem', padding: '0.175rem', marginBottom: '0.875rem' }}>
                {(['economy', 'business'] as const).map(cls => (
                    <button key={cls} onClick={() => setFlightClass(cls)} style={{ padding: '0.35rem', borderRadius: '0.325rem', border: 'none', background: flightClass === cls ? 'white' : 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.8125rem', color: flightClass === cls ? '#1A2340' : '#8A94A6', cursor: 'pointer', boxShadow: flightClass === cls ? '0 1px 4px rgba(26,35,64,0.1)' : 'none', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                        {cls}
                    </button>
                ))}
            </div>

            {flight ? (
                <div>
                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.875rem', fontWeight: 700, color: '#1A2340', lineHeight: 1 }}>
                        {cur(flight[flightClass], flight.currency || currCode)}
                    </p>
                    <p style={{ color: '#8A94A6', fontSize: '0.8125rem', marginTop: '0.25rem' }}>per person · round trip</p>
                    <p style={{ color: '#4ECDC4', fontSize: '0.8125rem', fontWeight: 700, marginTop: '0.4rem' }}>
                        {guests} guests: {cur(flight[flightClass] * guests, flight.currency || currCode)}
                    </p>
                </div>
            ) : (
                <p style={{ color: '#8A94A6', fontSize: '0.8125rem', lineHeight: 1.55 }}>AI estimated fare based on typical prices for this route and season.</p>
            )}
        </div>
    );
}

function BudgetCard({ budget, currCode, regenLoading, onStep }: {
    budget: number; currCode: string; regenLoading: boolean; onStep: (dir: 1 | -1) => void;
}) {
    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: '#1A2340' }}>Trip Budget</h3>
                <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: 'rgba(255,107,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <DollarSign style={{ width: '0.85rem', height: '0.85rem', color: '#FF6B6B' }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 700, color: '#1A2340', lineHeight: 1 }}>
                    {cur(budget, currCode)}
                </p>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button onClick={() => onStep(-1)} disabled={regenLoading} style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.15)', background: 'white', cursor: regenLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}>
                        <Minus style={{ width: '0.8rem', height: '0.8rem' }} />
                    </button>
                    <button onClick={() => onStep(1)} disabled={regenLoading} style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', border: '1.5px solid rgba(26,35,64,0.15)', background: 'white', cursor: regenLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}>
                        <Plus style={{ width: '0.8rem', height: '0.8rem' }} />
                    </button>
                </div>
            </div>
            <p style={{ color: '#8A94A6', fontSize: '0.75rem', marginBottom: '1rem' }}>±10% · AI re-plans to fit new budget</p>

            {[
                { label: 'Accommodation', pct: 40, color: '#FF6B6B' },
                { label: 'Activities', pct: 25, color: '#4ECDC4' },
                { label: 'Food & Drink', pct: 25, color: '#E8A838' },
                { label: 'Transport', pct: 10, color: '#8B7CF6' },
            ].map(({ label, pct, color }) => (
                <div key={label} style={{ marginBottom: '0.625rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#4A5568', fontWeight: 500 }}>{label}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color }}>{cur(Math.round(budget * pct / 100), currCode)}</span>
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
    );
}

/* ─── Main Component ─── */
export default function TripResults({ tripData, onBack }: TripResultsProps) {
    const [activeDay, setActiveDay] = useState(0);
    const [budget, setBudget] = useState(tripData.totalCost || 2500);
    const [flightClass, setFlightClass] = useState<'economy' | 'business'>('economy');
    const [regenLoading, setRegenLoading] = useState(false);
    const [localTrip, setLocalTrip] = useState(tripData);

    const itinerary = localTrip.itinerary || [];
    const currentDay = itinerary[activeDay];
    const totalActivities = itinerary.reduce((s, d) => s + (d.activities?.length || 0), 0);
    const currCode = localTrip.currency || 'USD';
    const flight = localTrip.flightEstimate;
    const dayTotalCost = currentDay?.activities?.reduce((s, a) => s + (a.estimatedCost || Number(a.price) || 0), 0) || 0;

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
                    currency: currCode,
                    guests: localTrip.guests || 2,
                    adjustedBudget: next,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setLocalTrip(prev => ({ ...prev, ...data, image: prev.image }));
            }
        } catch { /* keep existing */ }
        setRegenLoading(false);
    }, [budget, localTrip, itinerary.length, currCode]);

    const hasFlight = flight || localTrip.origin;

    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>

            {/* ── HERO BANNER ── */}
            <div style={{ position: 'relative', height: '55vh', minHeight: '340px', overflow: 'hidden' }}>
                <Image
                    src={localTrip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop'}
                    alt={localTrip.destination} fill priority unoptimized
                    style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,21,38,0.3) 0%, rgba(13,21,38,0.65) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to top, #FFFBF5, transparent)' }} />

                <div style={{ position: 'absolute', top: '5.5rem', left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.45rem 0.875rem', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>
                        <ArrowLeft style={{ width: '0.825rem', height: '0.825rem' }} /> Back
                    </button>
                </div>

                <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.875rem, 5vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        {localTrip.destination}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[`${localTrip.duration || itinerary.length} days`, `${totalActivities} experiences`, `${localTrip.guests || 2} guests`].map(t => (
                            <span key={t} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem', position: 'relative' }}>

                {/* Regen overlay */}
                {regenLoading && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(255,251,245,0.8)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <Loader2 style={{ width: '2.5rem', height: '2.5rem', color: '#FF6B6B', animation: 'tripSpin 1s linear infinite' }} />
                        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.125rem', color: '#1A2340' }}>Replanning for {cur(budget, currCode)}…</p>
                    </div>
                )}

                {/* ═══════════════════════════════
                    DESKTOP layout: itinerary | sidebar
                    MOBILE  layout: sidebar cards (scroll-x strip) → itinerary
                ═══════════════════════════════ */}
                <div className="trip-layout">

                    {/* ── Sidebar cards — shown as horizontal strip on mobile, column on desktop ── */}
                    <div className="trip-sidebar">
                        {hasFlight && (
                            <FlightCard
                                flight={flight}
                                origin={localTrip.origin}
                                destination={localTrip.destination}
                                guests={localTrip.guests || 2}
                                currCode={currCode}
                                flightClass={flightClass}
                                setFlightClass={setFlightClass}
                            />
                        )}
                        <BudgetCard
                            budget={budget}
                            currCode={currCode}
                            regenLoading={regenLoading}
                            onStep={stepBudget}
                        />

                        {/* Weather card */}
                        <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #1A2340 0%, #0D1526 100%)', borderColor: 'transparent' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                                <Sun style={{ width: '1rem', height: '1rem', color: '#E8A838' }} />
                                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: 'white' }}>Weather</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontFamily: 'Fraunces, serif', fontSize: '2.25rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>24°C</p>
                                    <p style={{ color: '#4ECDC4', fontWeight: 600, fontSize: '0.8125rem', marginTop: '0.3rem' }}>Sunny &amp; clear</p>
                                </div>
                                <Sun style={{ width: '3rem', height: '3rem', color: 'rgba(232,168,56,0.25)' }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.75rem' }}>{localTrip.destination}</p>
                        </div>

                        {/* Download / Share */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.7rem', border: '1.5px solid rgba(26,35,64,0.12)', borderRadius: '0.75rem', background: 'white', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568', fontFamily: 'DM Sans, sans-serif' }}>
                                <Download style={{ width: '0.8rem', height: '0.8rem' }} /> PDF
                            </button>
                            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.7rem', border: '1.5px solid rgba(26,35,64,0.12)', borderRadius: '0.75rem', background: 'white', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568', fontFamily: 'DM Sans, sans-serif' }}>
                                <Share2 style={{ width: '0.8rem', height: '0.8rem' }} /> Share
                            </button>
                        </div>
                    </div>

                    {/* ── Itinerary (left / main column) ── */}
                    <div className="trip-itinerary">
                        {/* Day tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
                            {itinerary.map((day, i) => (
                                <button key={i} onClick={() => setActiveDay(i)} style={{ flexShrink: 0, padding: '0.5rem 1.125rem', borderRadius: '100px', border: activeDay === i ? 'none' : '1.5px solid rgba(26,35,64,0.12)', background: activeDay === i ? '#FF6B6B' : 'white', color: activeDay === i ? 'white' : '#4A5568', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', boxShadow: activeDay === i ? '0 4px 16px rgba(255,107,107,0.3)' : 'none', transition: 'all 0.2s' }}>
                                    Day {day.day}
                                </button>
                            ))}
                        </div>

                        {currentDay && (
                            <div className="card" style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', color: '#1A2340', marginBottom: '0.2rem' }}>Day {currentDay.day}</h2>
                                        {currentDay.date && <p style={{ color: '#8A94A6', fontSize: '0.875rem', fontWeight: 500 }}>{currentDay.date}</p>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <span style={{ background: 'rgba(26,35,64,0.06)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568' }}>{currentDay.activities?.length || 0} activities</span>
                                        {dayTotalCost > 0 && (
                                            <span style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '100px', padding: '0.2rem 0.7rem', fontSize: '0.8125rem', fontWeight: 700, color: '#FF6B6B' }}>
                                                ~{cur(dayTotalCost, currCode)} today
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {currentDay.activities?.map((act, i) => {
                                        const vibe = getVibeStyle(act.vibe);
                                        const VibeIcon = vibe.icon;
                                        const isLast = i === (currentDay.activities?.length || 0) - 1;
                                        const transport = act.transportFromPrevious;
                                        const TransIcon = transport ? getTransportIcon(transport.mode) : null;

                                        return (
                                            <div key={i}>
                                                {/* Transport connector */}
                                                {transport && i > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.125rem 0 0.125rem 0.75rem' }}>
                                                        <div style={{ width: '1.5px', height: '1.25rem', background: 'rgba(26,35,64,0.08)' }} />
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(78,205,196,0.07)', border: '1px solid rgba(78,205,196,0.18)', borderRadius: '100px', padding: '0.175rem 0.5rem' }}>
                                                            {TransIcon && <TransIcon style={{ width: '0.6rem', height: '0.6rem', color: '#2A9D8F' }} />}
                                                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#2A9D8F' }}>
                                                                {transport.mode} · {cur(transport.cost, currCode)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Activity row */}
                                                <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0.15rem' }}>
                                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF6B6B', boxShadow: '0 0 0 3px rgba(255,107,107,0.2)', flexShrink: 0 }} />
                                                        {!isLast && <div style={{ width: '1.5px', flex: 1, minHeight: '2.5rem', background: 'rgba(26,35,64,0.08)', margin: '4px 0' }} />}
                                                    </div>

                                                    <div style={{ flex: 1, paddingBottom: isLast ? 0 : '1.5rem' }}>
                                                        {act.time && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                                                                <Clock style={{ width: '0.7rem', height: '0.7rem', color: '#8A94A6' }} />
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A94A6' }}>{act.time}</span>
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                            <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', fontWeight: 700, color: '#1A2340', marginBottom: '0.3rem' }}>
                                                                {act.name || act.title || 'Activity'}
                                                            </h4>
                                                            {act.vibe && (
                                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: vibe.bg, borderRadius: '100px', padding: '0.175rem 0.55rem', flexShrink: 0 }}>
                                                                    <VibeIcon style={{ width: '0.575rem', height: '0.575rem', color: vibe.text }} />
                                                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: vibe.text }}>{act.vibe}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p style={{ color: '#4A5568', fontSize: '0.875rem', lineHeight: 1.6 }}>{act.description}</p>
                                                        {(act.estimatedCost !== undefined || act.price) && (
                                                            <p style={{ marginTop: '0.375rem', color: '#8A94A6', fontSize: '0.8125rem', fontWeight: 600 }}>
                                                                {cur(act.estimatedCost ?? Number(act.price) ?? 0, currCode)} per person
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
                </div>
            </div>

            <style>{`
                @keyframes tripSpin { to { transform: rotate(360deg); } }

                /* ── Desktop: side-by-side, sidebar sticky + scrollable ── */
                .trip-layout {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    grid-template-areas: "itinerary sidebar";
                    gap: 1.5rem;
                    align-items: start;
                }
                .trip-itinerary { grid-area: itinerary; }
                .trip-sidebar {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    position: sticky;
                    top: 5.5rem;
                    /* KEY FIX: sidebar never taller than viewport, scrolls independently */
                    max-height: calc(100vh - 7rem);
                    overflow-y: auto;
                    padding-right: 4px;   /* room for scrollbar */
                    scrollbar-width: thin;
                    scrollbar-color: rgba(26,35,64,0.15) transparent;
                }
                .trip-sidebar::-webkit-scrollbar { width: 4px; }
                .trip-sidebar::-webkit-scrollbar-thumb { background: rgba(26,35,64,0.15); border-radius: 4px; }

                /* ── Tablet (≤900px): itinerary top, sidebar below in 2-col grid ── */
                @media (max-width: 900px) {
                    .trip-layout {
                        grid-template-columns: 1fr;
                        grid-template-areas: "itinerary" "sidebar";
                    }
                    .trip-sidebar {
                        position: static;
                        max-height: none;
                        overflow-y: visible;
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                        gap: 0.875rem;
                        padding-right: 0;
                    }
                }

                /* ── Mobile (≤520px): full single column ── */
                @media (max-width: 520px) {
                    .trip-sidebar {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
