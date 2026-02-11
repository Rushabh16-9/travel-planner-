'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
    children: React.ReactNode;
    demoMode: boolean;
    onToggleDemoMode: () => void;
}

export default function Layout({ children, demoMode, onToggleDemoMode }: LayoutProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] relative selection:bg-emerald-500/30 selection:text-emerald-200">

            {/* Ambient Background Depth */}
            <div className="fixed inset-0 pointer-events-none radial-depth z-0" />

            {/* Glass Capsule Navbar */}
            <nav
                className={cn(
                    'fixed top-6 left-0 right-0 z-50 transition-all duration-500 max-w-5xl mx-auto px-6',
                    scrolled ? 'py-0' : 'py-2'
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 border border-white/5",
                        scrolled ? "glass-capsule bg-black/40 shadow-2xl backdrop-blur-md" : "bg-transparent border-transparent"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-cyan-200 tracking-tight">
                            VoyageAI
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Discover
                        </button>
                        <button className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Trips
                        </button>
                        <button
                            onClick={onToggleDemoMode}
                            className="hidden"
                        >
                            {demoMode ? 'Live Mode' : 'Demo 2.0'}
                        </button>
                        <button className="btn-ghost rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition-all">
                            <Settings className="w-5 h-5" />
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
