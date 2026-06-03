'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, BookOpen, FileText, Video,
    Calendar, LogOut, Menu, X, GraduationCap,
} from 'lucide-react';
import ChatBot from '@/components/ChatBot';

export interface StudentUser {
    name: string;
    email: string;
    grade: string;
}

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'Quiz', href: '/student/quiz', icon: BookOpen },
    { label: 'My Notes', href: '/student/notes', icon: FileText },
    { label: 'Videos', href: '/student/videos', icon: Video },
    { label: 'Calendar', href: '/student/calendar', icon: Calendar },
];

interface Props {
    children: React.ReactNode;
}

export default function StudentShell({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<StudentUser | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const raw = localStorage.getItem('sp_student_user');
        if (!raw) {
            router.replace('/student/login');
            return;
        }
        try {
            setUser(JSON.parse(raw) as StudentUser);
        } catch {
            localStorage.removeItem('sp_student_user');
            router.replace('/student/login');
            return;
        }
        setChecking(false);
    }, [router]);

    const logout = () => {
        localStorage.removeItem('sp_student_user');
        router.replace('/student/login');
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg border-2 border-neon-cyan border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* bg glow */}
            <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_60%)]" />

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-40 w-full cyber-glass border-b border-cyber-border px-4 md:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-400 hover:text-neon-cyan" aria-label="menu">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/student" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-teal flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.5)]">
                            <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold tracking-wider bg-gradient-to-r from-neon-teal to-neon-purple bg-clip-text text-transparent">Student Portal</p>
                            <p className="text-[10px] text-slate-500 font-mono">Kannada Seva</p>
                        </div>
                    </Link>
                </div>

                {/* Desktop links */}
                <nav className="hidden md:flex items-center space-x-1">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-neon-purple/15 text-white border border-neon-purple/30' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                    }`}>
                                <Icon className={`w-3.5 h-3.5 ${active ? 'text-neon-purple' : ''}`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center space-x-2">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-xs font-semibold text-white">{user.name}</span>
                        <span className="text-[10px] text-neon-teal font-mono">{user.grade}</span>
                    </div>
                    <button onClick={logout}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-neon-pink hover:border-neon-pink/30 transition-all text-xs">
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sign out</span>
                    </button>
                </div>
            </header>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col">
                    <div className="bg-cyber-dark/98 border-b border-cyber-border p-4 space-y-1">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-white font-mono">NAVIGATION</span>
                            <button onClick={() => setMenuOpen(false)} className="p-1 text-slate-400 hover:text-neon-pink">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {NAV_ITEMS.map(item => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-neon-purple/15 text-white border border-neon-purple/30' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                                        }`}>
                                    <Icon className={`w-5 h-5 ${active ? 'text-neon-purple' : ''}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex-1 bg-black/50" onClick={() => setMenuOpen(false)} />
                </div>
            )}

            {/* Page content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10 pb-24 md:pb-8">
                {children}
            </main>

            {/* Mobile bottom nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-cyber-dark/95 backdrop-blur-xl border-t border-cyber-border flex justify-around items-center py-1 px-2">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}
                            className={`flex flex-col items-center flex-1 py-1 transition-all ${active ? 'text-neon-purple' : 'text-slate-500'}`}>
                            <Icon className={`w-5 h-5 mb-0.5 ${active ? 'scale-110' : ''}`} />
                            <span className="text-[9px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <ChatBot />
        </div>
    );
}
