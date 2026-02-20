import { Compass, Globe, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const REGIONS = [
    { name: 'Europe', places: 'Italy, Greece, France, Spain', emoji: '🏛️', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop' },
    { name: 'Asia', places: 'Japan, Bali, Thailand, Vietnam', emoji: '🏯', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=600&auto=format&fit=crop' },
    { name: 'Americas', places: 'New York, Peru, Mexico, Canada', emoji: '🗽', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=600&auto=format&fit=crop' },
    { name: 'Africa', places: 'Morocco, Kenya, South Africa', emoji: '🦁', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=600&auto=format&fit=crop' },
    { name: 'Oceania', places: 'Australia, New Zealand, Fiji', emoji: '🌊', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop' },
    { name: 'Middle East', places: 'Dubai, Jordan, Oman, Qatar', emoji: '🕌', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop' },
];

export default function DestinationsPage() {
    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>
            {/* Hero */}
            <div style={{ background: '#1A2340', padding: '8rem 2rem 5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '100px', padding: '0.3rem 0.875rem', marginBottom: '1.25rem' }}>
                    <Globe style={{ width: '0.75rem', height: '0.75rem', color: '#FF6B6B' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF8E8E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Explore the World</span>
                </div>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    Where will you go <em style={{ fontStyle: 'italic', color: '#FF8E8E' }}>next?</em>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.0625rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
                    Discover stunning destinations across every continent, curated by AI and travel experts.
                </p>
            </div>

            {/* Regions grid */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {REGIONS.map(r => (
                        <Link key={r.name} href={`/destinations/${r.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                            <div className="card-hover" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', alignItems: 'center' }}>
                                <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '0.875rem', overflow: 'hidden', flexShrink: 0 }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', color: '#1A2340', marginBottom: '0.25rem' }}>{r.emoji} {r.name}</h3>
                                    <p style={{ color: '#8A94A6', fontSize: '0.875rem', marginBottom: '0.625rem' }}>{r.places}</p>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FF6B6B', fontSize: '0.875rem', fontWeight: 600 }}>
                                        Explore <ArrowRight style={{ width: '0.875rem', height: '0.875rem' }} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'white', borderRadius: '1.5rem', border: '1px solid rgba(26,35,64,0.07)', boxShadow: '0 4px 32px rgba(26,35,64,0.06)' }}>
                    <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.75rem', color: '#1A2340', marginBottom: '0.75rem' }}>Not sure where to go?</h2>
                    <p style={{ color: '#8A94A6', marginBottom: '1.5rem' }}>Let our AI plan the perfect trip based on your dates, budget, and interests.</p>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FF6B6B', color: 'white', borderRadius: '100px', padding: '0.875rem 2rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,107,107,0.35)' }}>
                        <Compass style={{ width: '1rem', height: '1rem' }} /> Plan with AI
                    </Link>
                </div>
            </div>
        </div>
    );
}
