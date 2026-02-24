'use client';

import { Loader2, Sparkles, Globe, Plane } from 'lucide-react';

export default function LoadingState() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: '3rem',
            background: '#FFFBF5',
        }}>
            <div style={{
                width: '56px', height: '56px',
                border: '3px solid rgba(255,107,107,0.15)',
                borderTop: '3px solid #FF6B6B',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1.5rem',
            }} />

            <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.375rem', fontWeight: 700, color: '#1A2340',
                marginBottom: '0.5rem', letterSpacing: '-0.01em',
            }}>
                Building your itinerary…
            </h3>

            <p style={{ color: '#8A94A6', fontSize: '0.9rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
                Analysing destinations, activities, and crafting your perfect plan.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                    { icon: Globe, text: 'Destinations' },
                    { icon: Sparkles, text: 'Activities' },
                    { icon: Plane, text: 'Routes' },
                ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        background: 'white', border: '1px solid rgba(26,35,64,0.1)',
                        borderRadius: '100px', padding: '0.35rem 0.875rem',
                        boxShadow: '0 1px 8px rgba(26,35,64,0.05)',
                    }}>
                        <Icon style={{ width: '0.75rem', height: '0.75rem', color: '#FF6B6B' }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4A5568' }}>{text}</span>
                    </div>
                ))}
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
