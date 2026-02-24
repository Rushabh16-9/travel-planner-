'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1550340499-a6c60886a409?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1495562569060-2eec28387ea3?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1511739001486-9152326b1a0e?auto=format&fit=crop&q=80&w=400",
];

export default function GalleryTile({ destination }: { destination: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
        >
            <h3 className="text-slate-900 font-bold text-xl mb-4">
                Hidden Gems in {destination}
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {MOCK_IMAGES.map((src, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="relative min-w-[200px] h-[250px] rounded-xl overflow-hidden shadow-md group border border-slate-200"
                    >
                        <Image
                            src={src}
                            alt="Gem"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="200px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
