'use client';

import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
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
        <div className="min-h-screen bg-white">

            {/* Clean Navbar */}
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-white'
                )}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg">
                            <Plane className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">VoyageAI</span>
                    </div>

                    <button
                        onClick={onToggleDemoMode}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {demoMode ? 'Live Mode' : 'Demo'}
                    </button>
                </div>
            </nav>

            <main className="relative w-full pt-16">
                {children}
            </main>
        </div>
    );
}
