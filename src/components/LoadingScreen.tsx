'use client';

import { Plane, Globe, Sparkles, MapPin } from 'lucide-react';

export default function LoadingScreen() {
    const steps = [
        { icon: Globe, text: 'Finding destinations' },
        { icon: Sparkles, text: 'Curating activities' },
        { icon: Plane, text: 'Building your plan' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#FFFBF5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>

            {/* ── Animated compass/spinner ── */}
            <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                {/* Outer ring */}
                <div style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    border: '2px solid rgba(255,107,107,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                }}>
                    {/* Spinning ring */}
                    <div style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        border: '2px solid transparent',
                        borderTopColor: '#FF6B6B',
                        borderRightColor: 'rgba(255,107,107,0.3)',
                        animation: 'spin 1.2s linear infinite',
                    }} />
                    {/* Icon */}
                    <MapPin style={{ width: '2rem', height: '2rem', color: '#FF6B6B' }} />
                </div>

                {/* Glow */}
                <div style={{
                    position: 'absolute', inset: '-8px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite',
                }} />
            </div>

            {/* ── Text ── */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{
                    fontFamily: 'Fraunces, serif',
                    fontSize: '1.875rem', fontWeight: 700,
                    color: '#1A2340', marginBottom: '0.625rem',
                    letterSpacing: '-0.02em',
                }}>
                    Crafting your <em style={{ fontStyle: 'italic', color: '#FF6B6B' }}>perfect</em> trip…
                </h2>
                <p style={{
                    color: '#8A94A6',
                    fontSize: '1rem',
                    maxWidth: '380px',
                    lineHeight: 1.65,
                }}>
                    Our AI is analysing thousands of experiences and building a personalised itinerary just for you.
                </p>
            </div>

            {/* ── Animated steps ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                {steps.map(({ icon: Icon, text }, i) => (
                    <div
                        key={text}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'white',
                            border: '1px solid rgba(26,35,64,0.08)',
                            borderRadius: '100px',
                            padding: '0.5rem 1rem',
                            boxShadow: '0 2px 12px rgba(26,35,64,0.06)',
                            animation: `fade-up 0.4s ease forwards ${i * 0.12}s`,
                            opacity: 0,
                        }}
                    >
                        <Icon style={{ width: '0.875rem', height: '0.875rem', color: '#FF6B6B' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4A5568' }}>{text}</span>
                    </div>
                ))}
            </div>

            {/* ── Progress ── */}
            <div style={{ width: '240px', height: '3px', background: '#F0EBE0', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(to right, #FF6B6B, #E8A838)',
                    borderRadius: '100px',
                    width: '75%',
                    animation: 'progress-fill 3s ease-out forwards',
                }} />
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes progress-fill {
          from { width: 8%; }
          to { width: 82%; }
        }
      `}</style>
        </div>
    );
}
