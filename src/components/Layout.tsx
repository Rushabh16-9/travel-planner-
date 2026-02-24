'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps { children: React.ReactNode; }

const NAV_LINKS = [
    { label: 'Destinations', href: '/destinations' },
    { label: 'Trips', href: '/trips' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Blog', href: '/blog' },
];

export default function Layout({ children }: LayoutProps) {
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Only the home page (/) has a dark hero image behind the navbar
    const isHeroPage = pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run immediately on mount
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Color scheme:
    // - Home page NOT scrolled → white text (over dark hero image)
    // - Home page scrolled OR any other page → dark navy text (over cream bg)
    const onDarkBg = isHeroPage && !scrolled;
    const linkColor = onDarkBg ? 'rgba(255,255,255,0.92)' : '#1A2340';
    const logoColor = onDarkBg ? 'white' : '#1A2340';
    const loginColor = onDarkBg ? 'rgba(255,255,255,0.92)' : '#1A2340';
    const loginBorderColor = onDarkBg ? 'rgba(255,255,255,0.45)' : 'rgba(26,35,64,0.25)';
    const navBg = isHeroPage
        ? (scrolled ? 'rgba(255,251,245,0.96)' : 'transparent')
        : 'rgba(255,251,245,0.97)';
    const navShadow = (scrolled || !isHeroPage) ? '0 1px 0 rgba(26,35,64,0.09)' : 'none';

    return (
        <div className="min-h-screen bg-[#FFFBF5]">

            {/* ── NAVBAR ── */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                transition: 'background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
                background: navBg,
                backdropFilter: (scrolled || !isHeroPage) ? 'blur(14px)' : 'none',
                boxShadow: navShadow,
                padding: (scrolled || !isHeroPage) ? '0.7rem 0' : '1.25rem 0',
            }}>
                <div style={{
                    maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '2.25rem', height: '2.25rem', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #FF6B6B, #E85555)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(255,107,107,0.35)', flexShrink: 0,
                        }}>
                            <Compass style={{ width: '1.1rem', height: '1.1rem', color: 'white' }} />
                        </div>
                        <span style={{
                            fontFamily: 'Fraunces, serif', fontSize: '1.375rem', fontWeight: 700,
                            letterSpacing: '-0.02em', color: logoColor,
                            transition: 'color 0.3s ease',
                        }}>
                            Voyage<span style={{ color: '#FF6B6B' }}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav — always visible on screens ≥768px */}
                    <nav className="desktop-nav" style={{ alignItems: 'center', gap: '0.125rem' }}>
                        {NAV_LINKS.map(({ label, href }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    style={{
                                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem',
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? '#FF6B6B' : linkColor,
                                        padding: '0.5rem 0.875rem', borderRadius: '100px',
                                        textDecoration: 'none',
                                        background: isActive ? 'rgba(255,107,107,0.08)' : 'transparent',
                                        transition: 'color 0.25s ease, background 0.15s',
                                    }}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <style>{`
                        .desktop-nav {
                            display: flex !important;
                        }
                        @media (max-width: 640px) {
                            .desktop-nav { display: none !important; }
                        }
                    `}</style>


                    {/* Login button */}
                    <button
                        onClick={() => router.push('/login')}
                        style={{
                            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9375rem',
                            color: loginColor,
                            background: 'transparent',
                            border: `1.5px solid ${loginBorderColor}`,
                            borderRadius: '100px',
                            padding: '0.55rem 1.375rem',
                            cursor: 'pointer',
                            transition: 'color 0.25s ease, border-color 0.25s ease, background 0.15s',
                        }}
                    >
                        Login
                    </button>
                </div>
            </header>

            <main>{children}</main>
        </div>
    );
}
