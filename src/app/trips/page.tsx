import { Map, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TripsPage() {
    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>
            <div style={{ background: '#1A2340', padding: '8rem 2rem 5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(78,205,196,0.15)', border: '1px solid rgba(78,205,196,0.3)', borderRadius: '100px', padding: '0.3rem 0.875rem', marginBottom: '1.25rem' }}>
                    <Map style={{ width: '0.75rem', height: '0.75rem', color: '#4ECDC4' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ECDC4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>My Trips</span>
                </div>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    Your <em style={{ fontStyle: 'italic', color: '#4ECDC4' }}>saved</em> trips
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.0625rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.65 }}>
                    All your AI-planned itineraries in one place, ready to view, edit, and share.
                </p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ background: 'white', borderRadius: '1.5rem', padding: '4rem 2rem', border: '2px dashed rgba(26,35,64,0.12)', boxShadow: '0 2px 16px rgba(26,35,64,0.04)' }}>
                    <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(255,107,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Map style={{ width: '1.75rem', height: '1.75rem', color: '#FF6B6B' }} />
                    </div>
                    <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', color: '#1A2340', marginBottom: '0.625rem' }}>No trips yet</h2>
                    <p style={{ color: '#8A94A6', marginBottom: '2rem', lineHeight: 1.65 }}>Start planning your first trip with VoyageAI and it will appear here.</p>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FF6B6B', color: 'white', borderRadius: '100px', padding: '0.875rem 2rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,107,107,0.35)' }}>
                        <Plus style={{ width: '1rem', height: '1rem' }} /> Plan a new trip
                    </Link>
                </div>
            </div>
        </div>
    );
}
