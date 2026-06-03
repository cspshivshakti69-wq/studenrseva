'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export default function StudentLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', grade: '', password: '' });
    const [error, setError] = useState('');

    // If already logged in, skip to portal
    useEffect(() => {
        const raw = localStorage.getItem('sp_student_user');
        if (raw) router.replace('/student');
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.grade.trim()) {
            setError('Please fill in Name, Email, and Grade.');
            return;
        }
        localStorage.setItem('sp_student_user', JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            grade: form.grade,
        }));
        router.push('/student');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.1),transparent_50%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1),transparent_50%)]" />

            <div className="w-full max-w-md z-10">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-purple to-neon-teal flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.4)] mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-neon-teal to-neon-purple bg-clip-text text-transparent tracking-wide">
                        Student Portal
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 font-mono">Kannada Seva · Exam Prep Hub</p>
                </div>

                {/* Card */}
                <form onSubmit={handleLogin}
                    className="p-6 rounded-2xl border border-neon-teal/20 bg-[rgba(7,4,32,0.85)] backdrop-blur-xl shadow-[0_0_40px_rgba(20,184,166,0.1)] space-y-4">

                    {/* Name */}
                    <div>
                        <label className="text-xs text-slate-400 font-mono mb-1.5 block">Your Name</label>
                        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-neon-teal/50 transition-colors">
                            <User className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Ravi Kumar"
                                autoComplete="name"
                                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-xs text-slate-400 font-mono mb-1.5 block">Email</label>
                        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-neon-teal/50 transition-colors">
                            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                placeholder="ravi@school.edu"
                                autoComplete="email"
                                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Grade */}
                    <div>
                        <label className="text-xs text-slate-400 font-mono mb-1.5 block">Class / Grade</label>
                        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-neon-teal/50 transition-colors">
                            <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                            <select
                                value={form.grade}
                                onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                                className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                            >
                                <option value="" className="bg-[#030014]">Select your class</option>
                                {['8th', '9th', '10th', '11th Science', '11th Commerce',
                                    '12th Science', '12th Commerce', 'Degree 1st Year', 'Degree 2nd Year'
                                ].map(g => <option key={g} value={g} className="bg-[#030014]">{g}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-xs text-slate-400 font-mono mb-1.5 block">Password</label>
                        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 focus-within:border-neon-teal/50 transition-colors">
                            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-neon-pink bg-neon-pink/10 border border-neon-pink/20 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button type="submit"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-teal to-neon-purple text-white hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all mt-2">
                        <span>Enter Portal</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <p className="text-center text-xs text-slate-500 pt-1">
                        Admin?{' '}
                        <Link href="/login" className="text-neon-cyan hover:underline">Go to Admin Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
