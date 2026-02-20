'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Menu, X } from 'lucide-react';

interface LayoutProps { children: React.ReactNode; }

export default function Layout({ children }: LayoutProps) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#FFFBF5]">

            {/* ─────────────────────────────────────
          NAVBAR
      ───────────────────────────────────── */}
            <header
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    zIndex: 100,
                    transition: 'background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
                    background: scrolled ? 'rgba(255,251,245,0.95)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    boxShadow: scrolled ? '0 1px 0 rgba(26,35,64,0.08)' : 'none',
                    padding: scrolled ? '0.75rem 0' : '1.25rem 0',
                }}
            >
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '2.25rem', height: '2.25rem',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #FF6B6B, #E85555)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255,107,107,0.35)',
                        }}>
                            <Compass style={{ width: '1.1rem', height: '1.1rem', color: 'white' }} />
                        </div>
                        <span style={{
                            fontFamily: 'Fraunces, serif',
                            fontSize: '1.375rem',
                            fontWeight: 700,
                            color: '#1A2340',
                            letterSpacing: '-0.02em',
                        }}>
                            Voyage<span style={{ color: '#FF6B6B' }}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
                        {['Destinations', 'Trips', 'Experiences', 'Blog'].map(item => (
                            <Link
                                key={item}
                                href="#"
                                style={{
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                    color: scrolled ? '#4A5568' : (item === 'Destinations' ? '#1A2340' : '#4A5568'),
                                    padding: '0.5rem 0.875rem',
                                    borderRadius: '100px',
                                    transition: 'color 0.15s, background 0.15s',
                                    textDecoration: 'none',
                                }}
                                className="hover:text-[#FF6B6B] hover:bg-[rgba(255,107,107,0.06)]"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* CTAs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            className="hidden sm:block"
                            style={{
                                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                                color: '#4A5568', background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0.5rem 0.75rem', borderRadius: '100px',
                                transition: 'color 0.15s',
                            }}
                        >
                            Sign in
                        </button>
                        <button className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}>
                            Get Started
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden"
                            onClick={() => setMenuOpen(v => !v)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A2340', padding: '4px' }}
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div style={{
                        background: '#FFFBF5', borderTop: '1px solid rgba(26,35,64,0.08)',
                        padding: '1rem 2rem 1.5rem',
                    }}>
                        {['Destinations', 'Trips', 'Experiences', 'Blog', 'Sign in'].map(item => (
                            <Link
                                key={item}
                                href="#"
                                style={{
                                    display: 'block', fontFamily: 'DM Sans, sans-serif',
                                    fontSize: '1rem', fontWeight: 500, color: '#4A5568',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid rgba(26,35,64,0.06)',
                                    textDecoration: 'none',
                                }}
                            >{item}</Link>
                        ))}
                    </div>
                )}
            </header>

            {/* Main */}
            <main>{children}</main>

        </div>
    );
}
