'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Shield, Mail, Lock, User, Globe, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { toggleLanguage, t } = useTranslation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'school_admin' | 'dept_officer' | 'ngo_viewer'>('dept_officer');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push('/login');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Mesh grid details */}
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

        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 transition-all text-xs font-semibold"
        >
          <Globe className="w-4 h-4" />
          <span>{t('nav.toggle_language')}</span>
        </button>
      </header>

      {/* Main Area */}
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-12 z-10 flex flex-col justify-center">
        <div className="p-6 md:p-8 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-xl shadow-glow-purple/5">
          
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-neon-cyan transition-colors mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-white font-mono">
              {t('auth.sign_up')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Create an official credential profile to log actions.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs text-center font-semibold font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex flex-col items-center justify-center font-bold font-mono">
              <CheckCircle className="w-5 h-5 mb-1.5" />
              <span>ACCOUNT PROVISIONED • DIRECTING TO PORTAL</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Officer Name / Teacher Name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-purple focus:shadow-glow-purple/10 hover:border-slate-700 transition-all"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@karnataka.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-purple focus:shadow-glow-purple/10 hover:border-slate-700 transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Authority Role */}
            <div>
              <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">
                {t('auth.role_select')}
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-purple focus:shadow-glow-purple/10 hover:border-slate-700 transition-colors appearance-none cursor-pointer"
                >
                  <option value="school_admin">{t('role.school_admin')}</option>
                  <option value="dept_officer">{t('role.dept_officer')}</option>
                  <option value="ngo_viewer">{t('role.ngo_viewer')}</option>
                </select>
                <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-neon-purple focus:shadow-glow-purple/10 hover:border-slate-700 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-glow-purple/40 hover:scale-102 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <span className="animate-pulse">{t('common.loading')}</span>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-[11px] text-slate-500 font-mono">
            <span>{t('auth.have_account')} </span>
            <Link href="/login" className="text-neon-purple hover:underline">
              {t('auth.sign_in')}
            </Link>
          </div>

        </div>
      </div>

      <footer className="w-full py-5 text-center border-t border-slate-950 bg-slate-950/80 z-10 text-[10px] text-slate-500 font-mono">
        OFFICIAL SYSTEM PROVISIONING CLIENT
      </footer>
    </div>
  );
}
