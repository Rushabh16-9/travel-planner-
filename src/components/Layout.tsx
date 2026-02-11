'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white relative selection:bg-emerald-500/30 selection:text-emerald-800">

            {/* Ambient Background Depth */}
            <div className="fixed inset-0 pointer-events-none radial-depth z-0" />

            {/* Glass Capsule Navbar */}
            <nav
                className={cn(
                    'fixed top-6 left-0 right-0 z-50 transition-all duration-500 max-w-5xl mx-auto px-8',
                    scrolled ? 'py-0' : 'py-4'
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-between px-8 py-4 rounded-full transition-all duration-500 border",
                        scrolled 
                            ? "glass-capsule bg-white/80 shadow-lg backdrop-blur-xl border-black/10" 
                            : "bg-white/40 backdrop-blur-sm border-black/5"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 tracking-tight">
                            VoyageAI
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Discover
                        </button>
                        <button className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Trips
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative w-full z-10">
                {children}
            </main>
        </div>
    );
}
