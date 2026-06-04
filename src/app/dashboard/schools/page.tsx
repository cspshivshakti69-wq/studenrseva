'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, School } from '@/lib/mockData';
import {
  Building, Search, Plus, MapPin, SlidersHorizontal, ArrowUpRight, X, Sparkles, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function SchoolsPage() {
  const { language, t } = useTranslation();

  // Datasets state
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameKn, setNewNameKn] = useState('');
  const [newDistrict, setNewDistrict] = useState('Dakshina Kannada');
  const [newTaluk, setNewTaluk] = useState('');
  const [newMedium, setNewMedium] = useState<'kannada' | 'english' | 'both'>('kannada');
  const [newDecline, setNewDecline] = useState('4.0');

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadSchools = () => {
    setSchools(mockDB.getSchools());
  };

  useEffect(() => {
    loadSchools();
  }, []);

  // Districts for filters
  const districtsList = Array.from(new Set(schools.map(s => s.district)));

  // Taluks list depending on selected district
  const taluksList = Array.from(new Set(
    schools
      .filter(s => selectedDistrict === 'all' ? true : s.district === selectedDistrict)
      .map(s => s.taluk)
  ));

  // Filter logic
  const filteredSchools = schools.filter(sch => {
    const matchesDist = selectedDistrict === 'all' ? true : sch.district === selectedDistrict;
    const matchesTaluk = selectedTaluk === 'all' ? true : sch.taluk === selectedTaluk;
    const matchesSearch = searchQuery === '' ? true : (
      sch.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.name_kn.includes(searchQuery) ||
      sch.taluk.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesDist && matchesTaluk && matchesSearch;
  });

  // Handle school addition
  const handleAddSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newNameEn || !newNameKn || !newTaluk) {
      setFormError('Please fill in all bilingual school details.');
      return;
    }
    try {
      mockDB.addSchool({
        name_en: newNameEn, name_kn: newNameKn,
        district: newDistrict, taluk: newTaluk,
        enrolment_decline_rate: parseFloat(newDecline) || 3.0,
        primary_medium: newMedium,
      });
      setFormSuccess(true);
      loadSchools();
      setTimeout(() => {
        setFormSuccess(false); setShowAddDialog(false);
        setNewNameEn(''); setNewNameKn(''); setNewTaluk('');
      }, 1000);
    } catch {
      setFormError('Failed to register school.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{t('school.title')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Bilingual government directory managing enrolment decline records.
          </p>
        </div>

        {/* Add School button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-teal text-white hover:shadow-glow-cyan/40 hover:scale-102 transition-all text-xs md:text-sm"
          id="add-school-btn"
        >
          <Plus className="w-4 h-4" />
          <span>{t('school.add_school')}</span>
        </button>
      </div>

      {/* Directory Filter Panel */}
      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm flex flex-col md:flex-row gap-3 items-center">

        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('school.search_placeholder')}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan/5 hover:border-slate-700 transition-all font-mono"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
        </div>

        {/* District Filter */}
        <div className="w-full md:w-48 relative">
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedTaluk('all'); // reset taluk
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
          >
            <option value="all">All Districts</option>
            {districtsList.map((dist, idx) => (
              <option key={idx} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Taluk Filter */}
        <div className="w-full md:w-48 relative">
          <select
            value={selectedTaluk}
            onChange={(e) => setSelectedTaluk(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
            disabled={selectedDistrict === 'all' && taluksList.length > 20}
          >
            <option value="all">All Taluks</option>
            {taluksList.map((taluk, idx) => (
              <option key={idx} value={taluk}>{taluk}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid of Schools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchools.length === 0 ? (
          <div className="col-span-full text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm font-mono">
            {t('common.no_records')}
          </div>
        ) : (
          filteredSchools.map((sch) => {
            const isHigh = sch.risk_score >= 70;
            const isElevated = sch.risk_score >= 50 && sch.risk_score < 70;
            return (
              <div
                key={sch.id}
                className={`p-5 rounded-2xl border transition-all duration-200 hover:translate-y-[-2px] cyber-glass flex flex-col justify-between ${isHigh ? 'border-glow-purple border-neon-pink/20 hover:border-neon-pink/40' :
                  isElevated ? 'border-glow-purple border-neon-purple/20 hover:border-neon-purple/40' :
                    'border-glow-teal border-neon-teal/20 hover:border-neon-teal/40'
                  }`}
              >
                <div>
                  {/* District / Taluk Badge */}
                  <div className="flex justify-between items-start mb-3.5">
                    <div className="flex items-center space-x-1 text-slate-500 font-mono text-[10px] uppercase">
                      <MapPin className="w-3 h-3 text-neon-cyan" />
                      <span>{sch.district} • {sch.taluk}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${isHigh ? 'bg-neon-pink/15 text-neon-pink' :
                      isElevated ? 'bg-neon-purple/15 text-neon-purple' :
                        'bg-neon-teal/15 text-neon-teal'
                      }`}>
                      {t('school.risk_index')}: {sch.risk_score}%
                    </span>
                  </div>

                  {/* School Name */}
                  <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-neon-cyan transition-colors line-clamp-2 min-h-[40px] leading-snug">
                    {language === 'en' ? sch.name_en : sch.name_kn}
                  </h3>

                  {/* Micro stats info */}
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-900 pt-3.5 mt-3.5 text-center">
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-mono block">{t('school.total_students')}</span>
                      <span className="text-xs font-bold text-slate-200 font-mono block mt-0.5">{sch.total_students}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-mono block">{t('school.medium')}</span>
                      <span className="text-[10px] font-semibold text-neon-cyan font-mono block mt-0.5 uppercase">{sch.primary_medium}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 font-mono block">{t('school.decline_rate')}</span>
                      <span className="text-xs font-bold text-neon-pink font-mono block mt-0.5">-{sch.enrolment_decline_rate}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-950 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-mono">REGISTRY ID: {sch.id.slice(0, 8).toUpperCase()}</span>
                  <Link
                    href={`/dashboard/schools/${sch.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-neon-cyan/40 bg-slate-950/60 text-[10px] font-bold text-slate-300 hover:text-white hover:shadow-glow-cyan/5 transition-all flex items-center space-x-1"
                  >
                    <span>{t('school.action.view')}</span>
                    <ArrowUpRight className="w-3 h-3 text-neon-cyan" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Popup Dialog Box to Add New Government School ( WOW Feature ) */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-neon-cyan/30 bg-cyber-card p-6 shadow-glow-cyan/15 relative animate-in zoom-in-95 duration-200">

            {/* Close Button */}
            <button
              onClick={() => setShowAddDialog(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-neon-pink border border-transparent hover:border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 text-left">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center space-x-2 font-mono">
                <Sparkles className="w-4.5 h-4.5 text-neon-cyan animate-pulse" />
                <span>{t('school.add.title')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Establish new education records.
              </p>
            </div>

            {formError && (
              <div className="p-2.5 mb-4 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs text-center font-semibold font-mono">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex items-center justify-center space-x-2 font-bold font-mono">
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                <span>{t('school.add.success')}</span>
              </div>
            )}

            <form onSubmit={handleAddSchoolSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School Name (EN) */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('school.add.name_en')}</label>
                  <input
                    type="text"
                    required
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="e.g. GHPS Mysore East"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan transition-all"
                  />
                </div>

                {/* School Name (KN) */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('school.add.name_kn')}</label>
                  <input
                    type="text"
                    required
                    value={newNameKn}
                    onChange={(e) => setNewNameKn(e.target.value)}
                    placeholder="ಉದಾ: ಸರ್ಕಾರಿ ಶಾಲೆ ಮೈಸೂರು"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan transition-all font-semibold"
                  />
                </div>

                {/* District Selection */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('school.district')}</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
                  >
                    <option value="Dakshina Kannada">Dakshina Kannada</option>
                    <option value="Udupi">Udupi</option>
                    <option value="Mysore">Mysore</option>
                    <option value="Tumkur">Tumkur</option>
                    <option value="Bangalore Urban">Bangalore Urban</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Shimoga">Shimoga</option>
                    <option value="Chamarajanagar">Chamarajanagar</option>
                  </select>
                </div>

                {/* Taluk name */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('school.taluk')}</label>
                  <input
                    type="text"
                    required
                    value={newTaluk}
                    onChange={(e) => setNewTaluk(e.target.value)}
                    placeholder="e.g. Mangaluru / Puttur"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan transition-all font-mono"
                  />
                </div>

                {/* Medium Option */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('school.add.medium')}</label>
                  <select
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
                  >
                    <option value="kannada">Kannada Medium</option>
                    <option value="english">English Medium</option>
                    <option value="both">Bilingual</option>
                  </select>
                </div>

                {/* Decline rate */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('school.decline_rate')} (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    required
                    value={newDecline}
                    onChange={(e) => setNewDecline(e.target.value)}
                    placeholder="e.g. 4.5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan transition-all font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-all"
                >
                  {t('common.cancel')}
                </button>

                <button
                  type="submit"
                  disabled={formSuccess}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-glow-cyan/40 hover:scale-102 transition-all disabled:opacity-50"
                >
                  {t('school.add.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
