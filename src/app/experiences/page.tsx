import { Camera, Star } from 'lucide-react';
import Link from 'next/link';

const EXPERIENCES = [
    { title: 'Cooking Classes', desc: 'Learn to cook authentic local dishes with expert chefs.', emoji: '👨‍🍳', tag: 'Foodie' },
    { title: 'Sunrise Hikes', desc: 'Watch the world wake up from a mountain summit.', emoji: '🌄', tag: 'Adventure' },
    { title: 'Cultural Tours', desc: 'Explore ancient temples, ruins, and living heritage sites.', emoji: '🏛️', tag: 'Culture' },
    { title: 'Sunset Sailing', desc: 'Private sailing trips along iconic coastlines.', emoji: '⛵', tag: 'Chill' },
    { title: 'Photography Walks', desc: 'Capture stunning shots with a local expert guide.', emoji: '📸', tag: 'Creative' },
    { title: 'Wildlife Safaris', desc: 'Encounter the Big Five in their natural habitat.', emoji: '🦁', tag: 'Adventure' },
];

const TAG_COLORS: Record<string, string> = {
    Foodie: '#C67D0D', Adventure: '#E85555', Culture: '#2A9D8F',
    Chill: '#4B6BFF', Creative: '#8B5CF6',
};

export default function ExperiencesPage() {
    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh' }}>
            <div style={{ background: '#1A2340', padding: '8rem 2rem 5rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(232,168,56,0.15)', border: '1px solid rgba(232,168,56,0.3)', borderRadius: '100px', padding: '0.3rem 0.875rem', marginBottom: '1.25rem' }}>
                    <Star style={{ width: '0.75rem', height: '0.75rem', color: '#E8A838', fill: '#E8A838' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E8A838', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Curated Experiences</span>
                </div>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    Things to <em style={{ fontStyle: 'italic', color: '#E8A838' }}>do & remember</em>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.0625rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.65 }}>
                    Hand-picked experiences that go beyond the ordinary tourist trail.
                </p>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {EXPERIENCES.map(exp => (
                        <div key={exp.title} className="card-hover" style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{exp.emoji}</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', color: '#1A2340' }}>{exp.title}</h3>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: TAG_COLORS[exp.tag] || '#4A5568', background: `${TAG_COLORS[exp.tag] || '#4A5568'}18`, borderRadius: '100px', padding: '0.2rem 0.625rem' }}>
                                    {exp.tag}
                                </span>
                            </div>
                            <p style={{ color: '#8A94A6', lineHeight: 1.65, fontSize: '0.9375rem' }}>{exp.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
