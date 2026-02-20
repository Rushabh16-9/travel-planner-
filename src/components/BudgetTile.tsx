'use client';

import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function BudgetTile({ totalCost }: { totalCost: number }) {
    const data = [
        { name: 'Stay', value: totalCost * 0.4, color: 'bg-emerald-500' },
        { name: 'Food', value: totalCost * 0.3, color: 'bg-blue-500' },
        { name: 'Travel', value: totalCost * 0.2, color: 'bg-indigo-500' },
        { name: 'Fun', value: totalCost * 0.1, color: 'bg-amber-500' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                Budget Breakdown
            </h3>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-slate-500">Total Estimate</span>
                    <span className="text-2xl font-bold text-slate-900">${totalCost.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                    {data.map((item, idx) => (
                        <div key={idx} style={{ width: `${(item.value / totalCost) * 100}%` }} className={item.color} />
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900">${item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
