'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function BudgetTile({ totalCost }: { totalCost: number }) {
    const data = [
        { name: 'Stay', value: totalCost * 0.4, color: '#10b981' }, // Emerald
        { name: 'Food', value: totalCost * 0.3, color: '#06b6d4' }, // Cyan
        { name: 'Travel', value: totalCost * 0.3, color: '#6366f1' }, // Indigo
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card-elevated rounded-[2rem] p-6 border border-white/5 h-[280px] flex flex-col group"
        >
            <h3 className="text-white font-bold text-lg mb-1">Budget Breakdown</h3>
            <p className="text-emerald-400 font-mono text-xl font-bold mb-4">Total: ${totalCost.toLocaleString()}</p>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1500}
                            animationBegin={200}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 500 }}
                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Cost']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4 text-xs text-white/60">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
