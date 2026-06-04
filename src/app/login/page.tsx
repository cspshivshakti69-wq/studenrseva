'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB } from '@/lib/mockData';
import { supabase, isSupabaseEnabled } from '@/lib/supabaseClient';
import { Shield, Mail, Lock, LogIn, Sparkles, CheckCircle, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { toggleLanguage, t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'school_admin' | 'dept_officer' | 'ngo_viewer'>('dept_officer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.removeItem('ks_current_user');
  }, []);

  // Build a user profile object and save to localStorage
  const saveSession = (uid: string, userEmail: string) => {
    let name = 'Dr. Ramesh Rao';
    let district: string | undefined = 'Dakshina Kannada';
    if (role === 'school_admin') { name = 'Smt. Sumitra Devi'; district = 'Dakshina Kannada'; }
    if (role === 'ngo_viewer') { name = 'Asha Gowda'; district = undefined; }

    const profile = { id: uid, email: userEmail, name, role, district };
    localStorage.setItem('ks_current_user', JSON.stringify(profile));
    mockDB.setUserProfile(profile);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password.'); return; }

    setLoading(true);
    setError(null);

    // ── Real Supabase auth ──────────────────────────────────────────────
    if (isSupabaseEnabled && supabase) {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError || !data.user) {
        setError(
          authError?.message === 'Invalid login credentials'
            ? 'Incorrect email or password. Please try again.'
            : authError?.message ?? 'Sign-in failed.'
        );
        setLoading(false);
        return;
      }

      saveSession(data.user.id, data.user.email ?? email);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push('/dashboard'), 900);
      return;
    }

    // ── Mock auth fallback (no Supabase configured) ─────────────────────
    setTimeout(() => {
      saveSession(`mock-${Date.now()}`, email);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push('/dashboard'), 900);
    }, 700);
  };

  const quickLogin = (r: 'school_admin' | 'dept_officer' | 'ngo_viewer') => {
    const emails: Record<string, string> = {
      school_admin: 'headmistress.bantwal@karnataka.gov.in',
      dept_officer: 'officer.edu@karnataka.gov.in',
      ngo_viewer: 'analyst.ngo@kannadaseva.org',
    };
    setRole(r);
    setEmail(emails[r]);
    setPassword('demo1234');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />

      {/* Header */}
      <header className="w-full z-10 px-4 py-4 md:px-8 flex items-center justify-between border-b border-slate-900 bg-slate-950/20 backdrop-blur-md">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-cyan p-0.5 flex items-center justify-center shadow-glow-cyan animate-pulse">
            <span className="text-white font-extrabold text-base">ಕ</span>
          </div>
          <span className="text-lg font-bold tracking-wider bg-gradient-to-r from-neon-cyan to-white bg-clip-text text-transparent">
            {t('brand.name')}
          </span>
        </Link>
        <button onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 transition-all text-xs font-semibold">
          <Globe className="w-4 h-4" />
          <span>{t('nav.toggle_language')}</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-10 z-10 flex flex-col lg:flex-row items-center justify-center gap-10">

        {/* Demo credentials */}
        <div className="w-full lg:w-[45%] space-y-5 order-2 lg:order-1">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
              <span>{t('auth.demo_logins')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isSupabaseEnabled
                ? 'Click a role to pre-fill credentials, then sign in with your Supabase user.'
                : 'Supabase not configured — click any role to log in instantly with mock auth.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              { roleId: 'school_admin' as const, title: t('role.school_admin'), desc: t('auth.demo_admin_desc'), border: 'border-neon-purple/20 hover:border-neon-purple/60 hover:bg-neon-purple/5', dot: 'bg-neon-purple' },
              { roleId: 'dept_officer' as const, title: t('role.dept_officer'), desc: t('auth.demo_officer_desc'), border: 'border-neon-cyan/20 hover:border-neon-cyan/60 hover:bg-neon-cyan/5', dot: 'bg-neon-cyan' },
              { roleId: 'ngo_viewer' as const, title: t('role.ngo_viewer'), desc: t('auth.demo_ngo_desc'), border: 'border-neon-teal/20 hover:border-neon-teal/60 hover:bg-neon-teal/5', dot: 'bg-neon-teal' },
            ].map((d) => (
              <button key={d.roleId} onClick={() => quickLogin(d.roleId)}
                className={`w-full text-left p-4 rounded-xl border bg-slate-950/40 backdrop-blur-sm transition-all flex items-start space-x-3.5 hover:translate-x-1 ${d.border} ${role === d.roleId ? 'ring-1 ring-offset-0' : ''}`}>
                <div className={`w-3.5 h-3.5 rounded-full ${d.dot} mt-1 animate-pulse`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-bold text-white">{d.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{d.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Auth form */}
        <div className="w-full lg:w-[48%] max-w-md order-1 lg:order-2">
          <div className="p-6 md:p-8 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-xl">

            <div className="text-center mb-6">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white font-mono">{t('auth.title')}</h1>
              <p className="text-xs text-slate-400 mt-1">
                {isSupabaseEnabled ? 'Supabase Auth · Secure' : 'Mock Auth · Demo Mode'}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs text-center font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex flex-col items-center font-bold">
                <CheckCircle className="w-5 h-5 mb-1.5" />
                <span>ACCESS GRANTED · REDIRECTING…</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">{t('auth.role_select')}</label>
                <div className="relative">
                  <select value={role} onChange={e => setRole(e.target.value as typeof role)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-cyan appearance-none cursor-pointer">
                    <option value="school_admin">{t('role.school_admin')}</option>
                    <option value="dept_officer">{t('role.dept_officer')}</option>
                    <option value="ngo_viewer">{t('role.ngo_viewer')}</option>
                  </select>
                  <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="user@karnataka.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-cyan font-mono" />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">{t('auth.password')}</label>
                <div className="relative">
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-cyan font-mono" />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <button type="submit" disabled={loading || success}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-glow-cyan/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                {loading
                  ? <span className="animate-pulse">{t('common.loading')}</span>
                  : <><LogIn className="w-4 h-4" /><span>{t('auth.sign_in')}</span></>}
              </button>
            </form>

            <div className="mt-6 text-center text-[11px] text-slate-500 font-mono">
              <span>{t('auth.no_account')} </span>
              <Link href="/register" className="text-neon-cyan hover:underline">{t('auth.sign_up')}</Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-5 text-center border-t border-slate-950 bg-slate-950/80 z-10 text-[10px] text-slate-500 font-mono">
        SECURE AUTHORISATION CORE · SUPABASE AUTH
      </footer>
    </div>
  );
}
