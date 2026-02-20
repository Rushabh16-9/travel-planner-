'use client';

import { Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Budget Tracker</h3>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Total Cost</p>
                    <p className="text-3xl font-bold text-slate-900">
                        {formatCurrency(totalCost, currency)}
                    </p>
                </div>

                <div className="relative w-24 h-24">
                    <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                        <circle
                            stroke="#e2e8f0"
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
                            stroke="#dc2626"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            style={{ strokeDasharray: `${circumference} ${circumference}` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-900">{Math.round(percentage)}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-sm text-slate-600">Budget Limit</span>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(budgetLimit, currency)}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="text-sm text-emerald-700">Remaining</span>
                    <span className="text-sm font-semibold text-emerald-700">{formatCurrency(remaining, currency)}</span>
                </div>
            </div>
        </div>
    );
}
