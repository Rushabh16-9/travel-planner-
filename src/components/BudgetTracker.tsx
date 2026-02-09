'use client';

import { Wallet, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from '@/lib/motion';

interface BudgetTrackerProps {
    totalCost: number;
    currency?: string;
}

export default function BudgetTracker({ totalCost, currency = 'EUR' }: BudgetTrackerProps) {
    const budgetLimit = 3000;
    const percentage = Math.min((totalCost / budgetLimit) * 100, 100);
    const remaining = budgetLimit - totalCost;

    const radius = 45;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="glass rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white">Budget Tracker</h3>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-white/40 mb-1">Total Cost</p>
                    <p className="text-3xl font-bold text-white">
                        {formatCurrency(totalCost, currency)}
                    </p>
                </div>

                <div className="relative w-24 h-24">
                    <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                        <circle
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={stroke}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <motion.circle
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            stroke="url(#gradient)"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            style={{ strokeDasharray: `${circumference} ${circumference}` }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{Math.round(percentage)}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-sm text-white/60">Budget Limit</span>
                    <span className="text-sm font-semibold text-white">{formatCurrency(budgetLimit, currency)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-sm text-emerald-400">Remaining</span>
                    <span className="text-sm font-semibold text-emerald-400">{formatCurrency(remaining, currency)}</span>
                </div>
            </div>
        </div>
    );
}
