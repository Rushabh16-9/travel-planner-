'use client';

import { useState, useEffect } from 'react';
import { Plane, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/lib/motion';

interface LayoutProps {
    children: React.ReactNode;
    demoMode: boolean;
    onToggleDemoMode: () => void;
}

export default function Layout({ children, demoMode, onToggleDemoMode }: LayoutProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="min-h-screen relative overflow-x-hidden">

            {/* Custom Cursor */}
            <motion.div
                className="hidden md:block fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: mousePos.x - 12,
                    y: mousePos.y - 12,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
            >
                <div className="w-full h-full rounded-full border-2 border-white" />
            </motion.div>

            {/* Animated Grid Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#020617]" />
                <div className="absolute inset-0 grid-pattern opacity-50" />

                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Navbar */}
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled ? 'py-4 glass' : 'py-6 bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-lg blur-md opacity-50" />
                                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                    <Plane className="w-5 h-5 text-white" strokeWidth={2} />
                                </div>
                            </div>
                            <span className="text-xl font-display font-bold tracking-tight">
                                VoyageAI
                            </span>
                        </div>

                        {/* Demo Toggle */}
                        <button
                            onClick={onToggleDemoMode}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer',
                                demoMode
                                    ? 'glass glow-emerald text-emerald-400'
                                    : 'glass hover:bg-white/10'
                            )}
                        >
                            {demoMode && <Sparkles className="w-4 h-4" />}
                            <span>{demoMode ? 'Live Mode' : 'Demo Mode'}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
}
