'use client';

import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    demoMode: boolean;
    onToggleDemoMode: () => void;
}

export default function Layout({ children, demoMode, onToggleDemoMode }: LayoutProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen relative selection:bg-gold selection:text-black">

            {/* Cinematic Background */}
            <div className="fixed inset-0 -z-10 bg-[#0b1121]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1121]/50 to-[#0b1121]" />
                {/* Subtle Ambient Light */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar - Minimal & Elegant */}
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                    scrolled ? 'py-4 glass-panel border-b-0' : 'py-8 bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-full">
                            <Plane className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-serif tracking-wide text-white">VoyageAI</span>
                    </div>

                    <button
                        onClick={onToggleDemoMode}
                        className="text-xs font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors"
                    >
                        {demoMode ? 'Live Mode' : 'Switch to Demo'}
                    </button>
                </div>
            </nav>

            <main className="relative z-10 w-full animate-in fade-in duration-700">
                {children}
            </main>
        </div>
    );
}
