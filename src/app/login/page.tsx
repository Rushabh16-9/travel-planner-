'use client';

import { useState } from 'react';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div style={{ background: '#FFFBF5', minHeight: '100vh', display: 'flex' }}>

            {/* Left: Image panel */}
            <div style={{ flex: 1, display: 'none', position: 'relative', background: '#1A2340' }} className="md:block" >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"
                    alt="Travel"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, position: 'absolute', inset: 0 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,21,38,0.5), rgba(13,21,38,0.8))' }} />
                <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem' }}>
                    <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', color: 'white', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                        &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>— Saint Augustine</p>
                </div>
            </div>

            {/* Right: Form */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '3rem' }}>
                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px', background: 'linear-gradient(135deg, #FF6B6B, #E85555)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,107,107,0.35)' }}>
                        <Compass style={{ width: '1.1rem', height: '1.1rem', color: 'white' }} />
                    </div>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.375rem', fontWeight: 700, color: '#1A2340', letterSpacing: '-0.02em' }}>
                        Voyage<span style={{ color: '#FF6B6B' }}>AI</span>
                    </span>
                </Link>

                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', color: '#1A2340', marginBottom: '0.5rem' }}>Welcome back</h1>
                    <p style={{ color: '#8A94A6', marginBottom: '2.5rem' }}>Sign in to access your trips and itineraries.</p>

                    {/* Email */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1A2340', marginBottom: '0.5rem' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#8A94A6' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={{
                                    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                                    border: '1.5px solid rgba(26,35,64,0.15)', borderRadius: '0.75rem',
                                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', color: '#1A2340',
                                    background: 'white', outline: 'none',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#FF6B6B'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(26,35,64,0.15)'; }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A2340' }}>Password</label>
                            <a href="#" style={{ fontSize: '0.875rem', color: '#FF6B6B', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#8A94A6' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '0.875rem 2.75rem 0.875rem 2.75rem',
                                    border: '1.5px solid rgba(26,35,64,0.15)', borderRadius: '0.75rem',
                                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', color: '#1A2340',
                                    background: 'white', outline: 'none',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#FF6B6B'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(26,35,64,0.15)'; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A94A6' }}
                            >
                                {showPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.9375rem', borderRadius: '0.75rem', gap: '0.5rem' }}
                    >
                        Sign in <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#8A94A6', fontSize: '0.9rem' }}>
                        {"Don't have an account? "}
                        <Link href="#" style={{ color: '#FF6B6B', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
