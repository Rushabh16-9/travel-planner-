import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const POSTS = [
    {
        title: '10 Hidden Gems in Southeast Asia',
        excerpt: 'Beyond Bali and Phuket — the places that will genuinely surprise you.',
        tag: 'Travel Tips', date: 'Feb 10, 2026',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=600&auto=format&fit=crop',
    },
    {
        title: 'How AI is Changing the Way We Travel',
        excerpt: 'From instant itineraries to real-time price alerts — welcome to smart travel.',
        tag: 'AI & Tech', date: 'Feb 03, 2026',
        image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600&auto=format&fit=crop',
    },
    {
        title: 'The Best Time to Visit Japan',
        excerpt: 'Cherry blossom, autumn leaves, or winter snow — we break it down by region.',
        tag: 'Destination Guide', date: 'Jan 28, 2026',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
    },
    {
        title: 'Budget Travel in Europe: Our Top Secrets',
        excerpt: 'How to travel Europe on €60 a day without missing the good stuff.',
        tag: 'Budget', date: 'Jan 20, 2026',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop',
    },
];

export default function BlogPage() {
    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>
            <div style={{ background: '#1A2340', padding: '8rem 2rem 5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '100px', padding: '0.3rem 0.875rem', marginBottom: '1.25rem' }}>
                    <BookOpen style={{ width: '0.75rem', height: '0.75rem', color: '#FF8E8E' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF8E8E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Travel Stories</span>
                </div>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    The VoyageAI <em style={{ fontStyle: 'italic', color: '#FF8E8E' }}>blog</em>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.0625rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.65 }}>
                    Tips, guides, destination deep-dives, and stories from travellers around the world.
                </p>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {POSTS.map(post => (
                        <article key={post.title} className="card-hover" style={{ overflow: 'hidden' }}>
                            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem', background: 'rgba(255,107,107,0.9)', borderRadius: '100px', padding: '0.2rem 0.75rem' }}>
                                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>{post.tag}</span>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ fontSize: '0.8125rem', color: '#8A94A6', fontWeight: 500, marginBottom: '0.5rem' }}>{post.date}</p>
                                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.125rem', color: '#1A2340', marginBottom: '0.625rem', lineHeight: 1.3 }}>{post.title}</h2>
                                <p style={{ color: '#8A94A6', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{post.excerpt}</p>
                                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FF6B6B', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                                    Read more <ArrowRight style={{ width: '0.875rem', height: '0.875rem' }} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
