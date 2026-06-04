'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Globe, ArrowRight, BookOpen, Brain, ShieldAlert, Award } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { toggleLanguage, t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Visual cyber mesh overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)]" />

      {/* Landing Header */}
      <header className="w-full z-10 px-4 py-4 md:px-8 flex items-center justify-between border-b border-slate-900 bg-slate-950/20 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-cyan p-0.5 flex items-center justify-center shadow-glow-purple">
            <span className="text-white font-extrabold text-lg">ಕ</span>
          </div>
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-neon-cyan to-white bg-clip-text text-transparent">
            {t('brand.name')}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 transition-all text-xs md:text-sm font-semibold"
          >
            <Globe className="w-4 h-4" />
            <span>{t('nav.toggle_language')}</span>
          </button>

          <Link
            href="/student/login"
            className="px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold border border-neon-teal/30 bg-neon-teal/5 text-neon-teal hover:bg-neon-teal/15 hover:scale-105 transition-all flex items-center space-x-1.5"
          >
            <span>Student Portal</span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-glow-cyan/40 hover:scale-105 transition-all flex items-center space-x-1.5"
          >
            <span>{t('landing.get_started')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-20 z-10 flex flex-col items-center justify-center text-center">
        {/* Glow Notification Badge */}
        <div className="mb-6 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-[11px] font-mono text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
          </span>
          <span>SYSTEM ONLINE • PROMOTING KANNADA LITERACY</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight">
          <span className="bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent block drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {t('landing.hero_title_glowing')}
          </span>
          <span className="text-white block mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {t('landing.hero_title_main')}
          </span>
        </h1>

        <p className="mt-6 text-sm md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {t('landing.hero_subtitle')}
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-teal text-white hover:shadow-glow-cyan/50 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <span>{t('landing.get_started')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold border border-slate-800 bg-slate-950/40 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>{t('landing.learn_more')}</span>
          </a>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { label: t('landing.stat.schools'), val: '350+', color: 'text-neon-cyan' },
            { label: t('landing.stat.enrolment'), val: '94.2%', color: 'text-neon-teal' },
            { label: t('landing.stat.accuracy'), val: '89.4%', color: 'text-neon-purple' },
            { label: t('landing.stat.active_users'), val: '120+', color: 'text-neon-pink' }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-sm flex flex-col items-center">
              <span className={`text-2xl md:text-4xl font-extrabold font-mono ${item.color}`}>{item.val}</span>
              <span className="text-[10px] md:text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Feature Overview Grid */}
        <section id="features" className="mt-20 md:mt-32 w-full pt-12 border-t border-slate-900">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-12">
            {t('landing.features_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: t('landing.feature.enrol_title'),
                desc: t('landing.feature.enrol_desc'),
                icon: BookOpen,
                color: 'text-neon-cyan',
                border: 'border-neon-cyan/20'
              },
              {
                title: t('landing.feature.warning_title'),
                desc: t('landing.feature.warning_desc'),
                icon: Brain,
                color: 'text-neon-purple',
                border: 'border-neon-purple/20'
              },
              {
                title: t('landing.feature.interv_title'),
                desc: t('landing.feature.interv_desc'),
                icon: ShieldAlert,
                color: 'text-neon-teal',
                border: 'border-neon-teal/20'
              }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className={`p-6 rounded-2xl border ${feat.border} bg-cyber-card/60 backdrop-blur-md text-left transition-all hover:translate-y-[-4px] hover:shadow-glow-cyan/5`}>
                  <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-4 border ${feat.border}`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-20 md:mt-32 w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 flex items-center justify-center space-x-2">
            <Award className="w-6 h-6 text-neon-purple animate-pulse" />
            <span>{t('landing.testimonial_title')}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { quote: t('landing.testimonial.quote1'), auth: t('landing.testimonial.author1') },
              { quote: t('landing.testimonial.quote2'), auth: t('landing.testimonial.author2') }
            ].map((test, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm text-left flex flex-col justify-between">
                <p className="text-xs md:text-sm text-slate-300 italic leading-relaxed">
                  {test.quote}
                </p>
                <p className="text-[11px] font-mono text-neon-cyan mt-4 font-semibold uppercase tracking-wider">
                  {test.auth}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-slate-950 bg-slate-950/80 z-10">
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
          © 2026 KANNADA SEVA • DEPT OF PUBLIC INSTRUCTION • GOVERNMENT OF KARNATAKA
        </p>
      </footer>
    </div>
  );
}
