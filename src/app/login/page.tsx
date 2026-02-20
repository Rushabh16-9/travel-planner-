'use client';

import { useState } from 'react';
import { Compass, Mail, Lock, Eye, EyeOff, User, ArrowRight, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1800); // simulate
    };

    return (
        <div style={{
            minHeight: '100vh', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
        }}>
            {/* Full-page travel background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2475&auto=format&fit=crop"
                alt=""
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
            />
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,21,38,0.62)', backdropFilter: 'blur(2px)', zIndex: 1 }} />

            {/* Glass card */}
            <div style={{
                position: 'relative', zIndex: 10,
                background: 'rgba(255,251,245,0.96)', backdropFilter: 'blur(24px)',
                borderRadius: '1.75rem', width: '100%', maxWidth: '440px',
                margin: '1.5rem',
                boxShadow: '0 32px 80px rgba(13,21,38,0.4), 0 2px 16px rgba(13,21,38,0.2)',
                border: '1px solid rgba(255,255,255,0.6)',
                overflow: 'hidden',
            }}>

                {/* Top accent bar */}
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #FF6B6B, #E8A838, #4ECDC4)' }} />

                <div style={{ padding: '2.25rem 2.5rem 2.5rem' }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', marginBottom: '1.75rem', justifyContent: 'center' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px', background: 'linear-gradient(135deg, #FF6B6B, #E85555)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,107,107,0.35)' }}>
                            <Compass style={{ width: '1.1rem', height: '1.1rem', color: 'white' }} />
                        </div>
                        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1.375rem', fontWeight: 700, color: '#1A2340', letterSpacing: '-0.02em' }}>
                            Voyage<span style={{ color: '#FF6B6B' }}>AI</span>
                        </span>
                    </Link>

                    {/* Tab toggle */}
                    <div style={{ background: 'rgba(26,35,64,0.06)', borderRadius: '0.875rem', padding: '0.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '1.75rem' }}>
                        {(['signin', 'signup'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                padding: '0.625rem',
                                background: tab === t ? 'white' : 'transparent',
                                border: 'none',
                                borderRadius: '0.625rem',
                                fontFamily: 'DM Sans, sans-serif',
                                fontWeight: tab === t ? 700 : 500,
                                color: tab === t ? '#1A2340' : '#8A94A6',
                                fontSize: '0.9375rem',
                                cursor: 'pointer',
                                boxShadow: tab === t ? '0 2px 8px rgba(26,35,64,0.1)' : 'none',
                                transition: 'all 0.2s',
                            }}>
                                {t === 'signin' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    {/* Social buttons */}
                    <button style={{
                        width: '100%', padding: '0.8rem', marginBottom: '0.75rem',
                        border: '1.5px solid rgba(26,35,64,0.12)', borderRadius: '0.875rem',
                        background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                        fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#1A2340',
                        boxShadow: '0 1px 4px rgba(26,35,64,0.06)', transition: 'box-shadow 0.15s',
                    }} className="hover:shadow-md">
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(26,35,64,0.1)' }} />
                        <span style={{ fontSize: '0.8125rem', color: '#8A94A6', fontWeight: 500 }}>or with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(26,35,64,0.1)' }} />
                    </div>

                    {/* Form fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Name (sign up only) */}
                        {tab === 'signup' && (
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#8A94A6' }} />
                                <input
                                    type="text" value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Full name"
                                    style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '1.5px solid rgba(26,35,64,0.13)', borderRadius: '0.875rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', color: '#1A2340', background: 'white', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = '#FF6B6B'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.12)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(26,35,64,0.13)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#8A94A6' }} />
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="Email address"
                                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', border: '1.5px solid rgba(26,35,64,0.13)', borderRadius: '0.875rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', color: '#1A2340', background: 'white', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = '#FF6B6B'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.12)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(26,35,64,0.13)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#8A94A6' }} />
                            <input
                                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 2.75rem', border: '1.5px solid rgba(26,35,64,0.13)', borderRadius: '0.875rem', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9375rem', color: '#1A2340', background: 'white', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = '#FF6B6B'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.12)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(26,35,64,0.13)'; e.target.style.boxShadow = 'none'; }}
                            />
                            <button type="button" onClick={() => setShowPassword(v => !v)}
                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8A94A6', padding: 0 }}>
                                {showPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot password (sign in only) */}
                    {tab === 'signin' && (
                        <div style={{ textAlign: 'right', marginTop: '0.625rem' }}>
                            <a href="#" style={{ fontSize: '0.875rem', color: '#FF6B6B', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
                        </div>
                    )}

                    {/* Submit */}
                    <button onClick={handleSubmit} style={{
                        width: '100%', marginTop: '1.5rem',
                        padding: '0.9375rem', borderRadius: '0.875rem',
                        background: loading ? '#f0a0a0' : 'linear-gradient(135deg, #FF6B6B, #E85555)',
                        color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '1rem',
                        boxShadow: '0 6px 24px rgba(255,107,107,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        transition: 'all 0.2s',
                    }}>
                        {loading ? (
                            <>
                                <svg style={{ animation: 'spin 1s linear infinite', width: '1rem', height: '1rem' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                                {tab === 'signin' ? 'Signing in…' : 'Creating account…'}
                            </>
                        ) : (
                            <>{tab === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight style={{ width: '1rem', height: '1rem' }} /></>
                        )}
                    </button>

                    {/* Switch tab */}
                    <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#8A94A6' }}>
                        {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}
                            style={{ color: '#FF6B6B', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                            {tab === 'signin' ? 'Sign up free' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
