'use client';

import { Loader2, Sparkles, Plane, Globe } from 'lucide-react';

export default function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 relative">
            {/* Animated background circles */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-64 h-64 border-2 border-primary/30 rounded-full animate-ping" />
                <div className="w-96 h-96 border-2 border-secondary/20 rounded-full animate-ping absolute" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Animated Icon */}
            <div className="relative mb-10 z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-40 animate-pulse" />
                <div className="relative">
                    <Loader2 className="w-20 h-20 text-primary animate-spin" />
                    <Sparkles className="w-8 h-8 text-secondary absolute -top-2 -right-2 animate-pulse" />
                </div>
            </div>

            {/* Shimmer Text */}
            <div className="text-center space-y-6 z-10 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-black text-white shimmer leading-tight">
                    AI is scouting the best hidden gems for you...
                </h2>

                <p className="text-lg text-slate-400 font-medium">
                    Analyzing destinations, activities, and creating your perfect itinerary
                </p>

                {/* Animated Steps */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    {[
                        { icon: Globe, text: 'Finding destinations', delay: '0s' },
                        { icon: Sparkles, text: 'Curating activities', delay: '0.3s' },
                        { icon: Plane, text: 'Optimizing routes', delay: '0.6s' },
                    ].map((step, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 px-4 py-2 glass rounded-full"
                            style={{ animationDelay: step.delay }}
                        >
                            <step.icon className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-sm text-slate-300">{step.text}</span>
                        </div>
                    ))}
                </div>

                {/* Pulsing Dots */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/50"
                            style={{
                                animation: `pulse 1.5s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mt-12 glass-strong rounded-full h-2 overflow-hidden z-10">
                <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer bg-[length:200%_100%]" />
            </div>
        </div>
    );
}
