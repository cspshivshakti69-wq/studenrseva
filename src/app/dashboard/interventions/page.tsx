'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, Intervention, School } from '@/lib/mockData';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, Plus,
  Calendar, Building, User, ChevronRight, X, Sparkles, CheckCircle2
} from 'lucide-react';

export default function InterventionsPage() {
  const { language, t } = useTranslation();

  // States
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  // Dialog State
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [targetSchoolId, setTargetSchoolId] = useState('');
  const [intervTitleEn, setIntervTitleEn] = useState('');
  const [intervTitleKn, setIntervTitleKn] = useState('');
  const [intervDescEn, setIntervDescEn] = useState('');
  const [intervDescKn, setIntervDescKn] = useState('');
  const [intervCategory, setIntervCategory] = useState<'bilingual' | 'attendance' | 'kits' | 'transport'>('bilingual');
  const [targetDate, setTargetDate] = useState('2026-06-30');

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = () => {
    const schoolsList = mockDB.getSchools();
    setInterventions(mockDB.getInterventions());
    setSchools(schoolsList);
    if (schoolsList.length > 0 && !targetSchoolId) {
      setTargetSchoolId(schoolsList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const moveStatus = (id: string, currentStatus: 'pending' | 'in_progress' | 'completed', direction: 'forward' | 'backward') => {
    let nextStatus: 'pending' | 'in_progress' | 'completed' = currentStatus;
    if (direction === 'forward') {
      if (currentStatus === 'pending') nextStatus = 'in_progress';
      else if (currentStatus === 'in_progress') nextStatus = 'completed';
    } else {
      if (currentStatus === 'completed') nextStatus = 'in_progress';
      else if (currentStatus === 'in_progress') nextStatus = 'pending';
    }
    mockDB.updateInterventionStatus(id, nextStatus);
    loadData();
  };

  const handleAddInterventionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!targetSchoolId || !intervTitleEn || !intervTitleKn) {
      setFormError('Please select school and fill in titles.');
      return;
    }
    const matchedSch = schools.find(s => s.id === targetSchoolId);
    if (!matchedSch) { setFormError('School not found.'); return; }

    mockDB.addIntervention({
      school_id: targetSchoolId,
      school_name_en: matchedSch.name_en,
      school_name_kn: matchedSch.name_kn,
      title_en: intervTitleEn,
      title_kn: intervTitleKn,
      description_en: intervDescEn || 'Deployed active intervention strategy.',
      description_kn: intervDescKn || 'ವಿಶೇಷ ಶಾಲಾ ಅಭಿಯಾನ.',
      category: intervCategory,
      status: 'pending',
      assigned_to_name: 'Dr. Ramesh Rao',
      target_date: targetDate,
    });

    setFormSuccess(true);
    loadData();
    setTimeout(() => {
      setFormSuccess(false); setShowAddDialog(false);
      setIntervTitleEn(''); setIntervTitleKn('');
      setIntervDescEn(''); setIntervDescKn('');
    }, 1000);
  };

  // Columns filter
  const pendingList = interventions.filter(i => i.status === 'pending');
  const progressList = interventions.filter(i => i.status === 'in_progress');
  const completedList = interventions.filter(i => i.status === 'completed');

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'bilingual': return 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5';
      case 'attendance': return 'text-neon-pink border-neon-pink/20 bg-neon-pink/5';
      case 'kits': return 'text-neon-purple border-neon-purple/20 bg-neon-purple/5';
      default: return 'text-neon-teal border-neon-teal/20 bg-neon-teal/5';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{t('interv.title')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {t('interv.subtitle')}
          </p>
        </div>

        {/* Create button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-teal text-white hover:shadow-glow-cyan/40 hover:scale-102 transition-all text-xs md:text-sm"
          id="create-interv-btn"
        >
          <Plus className="w-4 h-4" />
          <span>{t('interv.create_btn')}</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Column 1: PENDING ( Assigned ) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-purple shadow-glow-purple" />
              <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">{t('interv.col_pending')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-xs font-mono text-slate-400">{pendingList.length}</span>
          </div>

          <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
            {pendingList.length === 0 ? (
              <div className="text-center py-12 text-slate-600 font-mono text-xs">No pending campaigns.</div>
            ) : (
              pendingList.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-900 bg-cyber-card/60 backdrop-blur-sm space-y-3.5 relative group">

                  {/* Category Badge */}
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold font-mono uppercase inline-block ${getCategoryColor(item.category)}`}>
                    {t(`interv.cat.${item.category}`).split(' ')[0]}
                  </span>

                  <div className="space-y-1">
                    <h4 className="text-xs md:text-sm font-extrabold text-white leading-snug">
                      {language === 'en' ? item.title_en : item.title_kn}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {language === 'en' ? item.description_en : item.description_kn}
                    </p>
                  </div>

                  {/* School / Student Roster details */}
                  <div className="space-y-1 text-[10px] text-slate-500 font-mono border-t border-slate-950 pt-2.5">
                    <div className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-neon-cyan" />
                      <span className="truncate max-w-[170px]">{language === 'en' ? item.school_name_en : item.school_name_kn}</span>
                    </div>
                    {item.student_name_en && (
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-neon-purple" />
                        <span className="truncate max-w-[170px]">{language === 'en' ? item.student_name_en : item.student_name_kn}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neon-teal" />
                      <span>{t('interv.target')}: {item.target_date}</span>
                    </div>
                  </div>

                  {/* Action Lanes movement */}
                  <div className="flex justify-end pt-2 border-t border-slate-950/60">
                    <button
                      onClick={() => moveStatus(item.id, item.status, 'forward')}
                      className="p-1 px-2.5 rounded bg-neon-purple/10 border border-neon-purple/20 hover:border-neon-purple/50 text-[10px] font-bold text-neon-purple transition-all flex items-center space-x-1"
                    >
                      <span>Start Action</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: IN PROGRESS ( In Action ) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-glow-cyan animate-pulse" />
              <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">{t('interv.col_progress')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-xs font-mono text-slate-400">{progressList.length}</span>
          </div>

          <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
            {progressList.length === 0 ? (
              <div className="text-center py-12 text-slate-600 font-mono text-xs">No active campaigns.</div>
            ) : (
              progressList.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-neon-cyan/15 bg-cyber-card/60 backdrop-blur-sm space-y-3.5 relative group">

                  {/* Category Badge */}
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold font-mono uppercase inline-block ${getCategoryColor(item.category)}`}>
                    {t(`interv.cat.${item.category}`).split(' ')[0]}
                  </span>

                  <div className="space-y-1">
                    <h4 className="text-xs md:text-sm font-extrabold text-white leading-snug">
                      {language === 'en' ? item.title_en : item.title_kn}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      {language === 'en' ? item.description_en : item.description_kn}
                    </p>
                  </div>

                  {/* School / Student Roster details */}
                  <div className="space-y-1 text-[10px] text-slate-500 font-mono border-t border-slate-950 pt-2.5">
                    <div className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-neon-cyan" />
                      <span className="truncate max-w-[170px]">{language === 'en' ? item.school_name_en : item.school_name_kn}</span>
                    </div>
                    {item.student_name_en && (
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-neon-purple" />
                        <span className="truncate max-w-[170px]">{language === 'en' ? item.student_name_en : item.student_name_kn}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neon-teal" />
                      <span>{t('interv.target')}: {item.target_date}</span>
                    </div>
                  </div>

                  {/* Action Lanes movement */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-950/60 font-mono">
                    <button
                      onClick={() => moveStatus(item.id, item.status, 'backward')}
                      className="p-1 px-2 rounded hover:bg-slate-900 border border-slate-800 text-[9px] text-slate-500 hover:text-white transition-all flex items-center space-x-0.5"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                      <span>Revert</span>
                    </button>

                    <button
                      onClick={() => moveStatus(item.id, item.status, 'forward')}
                      className="p-1 px-2.5 rounded bg-neon-cyan/10 border border-neon-cyan/20 hover:border-neon-cyan/50 text-[10px] font-bold text-neon-cyan transition-all flex items-center space-x-1"
                    >
                      <span>Mark Resolved</span>
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: RESOLVED ( Completed ) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-teal shadow-glow-teal" />
              <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">{t('interv.col_completed')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-xs font-mono text-slate-400">{completedList.length}</span>
          </div>

          <div className="space-y-3 min-h-[300px] overflow-y-auto max-h-[500px] pr-1">
            {completedList.length === 0 ? (
              <div className="text-center py-12 text-slate-600 font-mono text-xs">No resolved campaigns.</div>
            ) : (
              completedList.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-neon-teal/15 bg-cyber-card/40 backdrop-blur-sm space-y-3.5 relative group opacity-75 hover:opacity-100 transition-opacity">

                  {/* Category Badge */}
                  <span className="px-2 py-0.5 rounded border border-neon-teal/10 bg-neon-teal/5 text-neon-teal text-[9px] font-bold font-mono uppercase inline-block">
                    {t(`interv.cat.${item.category}`).split(' ')[0]}
                  </span>

                  <div className="space-y-1">
                    <h4 className="text-xs md:text-sm font-extrabold text-slate-300 leading-snug line-through">
                      {language === 'en' ? item.title_en : item.title_kn}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {language === 'en' ? item.description_en : item.description_kn}
                    </p>
                  </div>

                  {/* School / Student Roster details */}
                  <div className="space-y-1 text-[10px] text-slate-600 font-mono border-t border-slate-950 pt-2.5">
                    <div className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-650" />
                      <span className="truncate max-w-[170px]">{language === 'en' ? item.school_name_en : item.school_name_kn}</span>
                    </div>
                    {item.student_name_en && (
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-slate-650" />
                        <span className="truncate max-w-[170px]">{language === 'en' ? item.student_name_en : item.student_name_kn}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Lanes movement */}
                  <div className="flex justify-start pt-2 border-t border-slate-950/60 font-mono">
                    <button
                      onClick={() => moveStatus(item.id, item.status, 'backward')}
                      className="p-1 px-2 rounded hover:bg-slate-900 border border-slate-800 text-[9px] text-slate-500 hover:text-white transition-all flex items-center space-x-0.5"
                    >
                      <ArrowLeft className="w-2.5 h-2.5" />
                      <span>Re-activate</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Manual Intervention Design Dialog Form ( persistence demo ) */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-neon-cyan/30 bg-cyber-card p-6 shadow-glow-cyan/15 relative animate-in zoom-in-95 duration-200">

            <button
              onClick={() => setShowAddDialog(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-neon-pink border border-transparent hover:border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 text-left">
              <span className="text-[10px] uppercase text-neon-cyan font-mono tracking-widest block">Design Intervention</span>
              <h2 className="text-lg md:text-xl font-bold text-white mt-0.5 flex items-center space-x-2 font-mono">
                <Sparkles className="w-4.5 h-4.5 text-neon-cyan animate-pulse" />
                <span>{t('interv.add.title')}</span>
              </h2>
            </div>

            {formError && (
              <div className="p-2.5 mb-4 rounded-lg bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs text-center font-semibold font-mono">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex items-center justify-center space-x-2 font-bold font-mono">
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                <span>Campaign plan established successfully!</span>
              </div>
            )}

            <form onSubmit={handleAddInterventionSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Select Target School */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.add.school')}</label>
                  <select
                    value={targetSchoolId}
                    onChange={(e) => setTargetSchoolId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-350 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none font-mono"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>
                        {language === 'en' ? s.name_en : s.name_kn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Category */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.add.type')}</label>
                  <select
                    value={intervCategory}
                    onChange={(e) => setIntervCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-350 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none font-mono"
                  >
                    <option value="bilingual">{t('interv.cat.bilingual')}</option>
                    <option value="attendance">{t('interv.cat.attendance')}</option>
                    <option value="kits">{t('interv.cat.kits')}</option>
                    <option value="transport">{t('interv.cat.transport')}</option>
                  </select>
                </div>

                {/* Title (EN) */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.add.title_en')}</label>
                  <input
                    type="text"
                    required
                    value={intervTitleEn}
                    onChange={(e) => setIntervTitleEn(e.target.value)}
                    placeholder="e.g. Bilingual Bridge Kit"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Title (KN) */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.add.title_kn')}</label>
                  <input
                    type="text"
                    required
                    value={intervTitleKn}
                    onChange={(e) => setIntervTitleKn(e.target.value)}
                    placeholder="ಉದಾ: ದ್ವಿಭಾಷಾ ಸೇತುವೆ ಪುಸ್ತಕ"
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan font-semibold"
                  />
                </div>

                {/* Description (EN) */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.add.desc_en')}</label>
                  <textarea
                    rows={2}
                    required
                    value={intervDescEn}
                    onChange={(e) => setIntervDescEn(e.target.value)}
                    placeholder="Action notes..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan resize-none"
                  />
                </div>

                {/* Description (KN) */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.add.desc_kn')}</label>
                  <textarea
                    rows={2}
                    required
                    value={intervDescKn}
                    onChange={(e) => setIntervDescKn(e.target.value)}
                    placeholder="ಸುಧಾರಣಾ ಜಾಗೃತಿ ಕ್ರಮ..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan resize-none font-semibold"
                  />
                </div>

                {/* Target Date */}
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1">{t('interv.target')}</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2.5 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSuccess}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-glow-cyan/40 hover:scale-102 transition-all"
                >
                  Deploy Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
