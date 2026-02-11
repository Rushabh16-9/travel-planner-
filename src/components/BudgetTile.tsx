'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function BudgetTile({ totalCost }: { totalCost: number }) {
    const budget = totalCost * 1.2; // Assume budget is 20% higher than cost
    const percentage = Math.min((totalCost / budget) * 100, 100);
    
    const data = [
        { name: 'Accommodation', value: totalCost * 0.4, color: '#10b981', percentage: 40 },
        { name: 'Food & Dining', value: totalCost * 0.3, color: '#06b6d4', percentage: 30 },
        { name: 'Transportation', value: totalCost * 0.2, color: '#6366f1', percentage: 20 },
        { name: 'Activities', value: totalCost * 0.1, color: '#f59e0b', percentage: 10 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card-elevated rounded-[2rem] p-6 h-[280px] flex flex-col group relative overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-slate-800 font-extrabold text-lg tracking-tight">Budget Meter</h3>
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">Estimated Costs</p>
                </div>
                <div className="relative">
                    <Wallet className="text-emerald-500 w-6 h-6" />
                    <div className="absolute inset-0 bg-emerald-400/30 blur-lg" />
                </div>
            </div>

            {/* Budget Meter Bar */}
            <div className="relative z-10 mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Spent</span>
                    <span className="text-emerald-600 font-semibold">${totalCost.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                    {/* Glow effect */}
                    <div 
                        className="absolute top-0 h-full bg-emerald-500/30 blur-sm rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>$0</span>
                    <span>${budget.toLocaleString()} budget</span>
                </div>
            </div>

            {/* Breakdown bars */}
            <div className="flex-1 space-y-2 relative z-10">
                {data.map((item, idx) => (
                    <motion.div 
                        key={item.name} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-500 text-xs flex-1 truncate">{item.name}</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                        </div>
                        <span className="text-slate-700 text-xs font-medium w-14 text-right">${item.value.toLocaleString()}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
