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
            <h3 className="text-white font-serif font-bold text-xl sm:text-2xl mb-4 sm:mb-6 pl-2">Hidden Gems in {destination}</h3>

            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-6 sm:pb-8 snap-x scrollbar-custom">
                {MOCK_IMAGES.map((src, idx) => (
                    <div key={idx} className="relative min-w-[200px] sm:min-w-[250px] h-[250px] sm:h-[300px] rounded-[1.5rem] overflow-hidden snap-center group cursor-pointer border border-white/5 glass-card transition-all hover-lift">
                        <Image
                            src={src}
                            alt="Gem"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 200px, 250px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
