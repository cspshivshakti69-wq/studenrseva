'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, Student, Intervention } from '@/lib/mockData';
import { 
  ShieldAlert, BrainCircuit, Sliders, ArrowUpRight, 
  Sparkles, CheckCircle2, User, Search, MapPin, Plus, X
} from 'lucide-react';

export default function RiskPredictionsPage() {
  const { language, t } = useTranslation();

  // States
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Medium'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bulk intervention action state
  const [bulkSuccess, setBulkSuccess] = useState(false);

  // Individual intervention form state
  const [assigningStudent, setAssigningStudent] = useState<Student | null>(null);
  const [intervTitleEn, setIntervTitleEn] = useState('');
  const [intervTitleKn, setIntervTitleKn] = useState('');
  const [intervDescEn, setIntervDescEn] = useState('');
  const [intervDescKn, setIntervDescKn] = useState('');
  const [intervCategory, setIntervCategory] = useState<'bilingual' | 'attendance' | 'kits' | 'transport'>('bilingual');
  const [targetDate, setTargetDate] = useState('2026-06-30');
  const [formSuccess, setFormSuccess] = useState(false);

  const loadData = () => {
    setStudents(mockDB.getStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter students exhibiting elevated risk
  const riskStudents = students.filter(s => s.risk_level === 'High' || s.risk_level === 'Medium');

  const filteredStudents = riskStudents.filter(std => {
    const matchesRisk = selectedRiskFilter === 'All' ? true : std.risk_level === selectedRiskFilter;
    const matchesSearch = searchQuery === '' ? true : (
      std.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.name_kn.includes(searchQuery) ||
      std.school_name_en.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesRisk && matchesSearch;
  });

  // Bulk operation: deploy bilingual materials to all students with language risk
  const handleBulkDeploy = () => {
    const langTrigStudents = riskStudents.filter(s => s.risk_reasons.includes('language'));
    let deployedCount = 0;

    langTrigStudents.forEach(std => {
      // Check if already has a bilingual intervention
      const activeInt = mockDB.getInterventions().find(i => i.student_id === std.id && i.category === 'bilingual');
      if (!activeInt) {
        mockDB.addIntervention({
          school_id: std.school_id,
          school_name_en: std.school_name_en,
          school_name_kn: std.school_name_kn,
          student_id: std.id,
          student_name_en: std.name_en,
          student_name_kn: std.name_kn,
          title_en: 'Targeted Bilingual Learning Kit',
          title_kn: 'ದ್ವಿಭಾಷಾ ಕಲಿಕಾ ಪ್ರಗತಿ ಸೇತುವೆ ಕಿಟ್',
          description_en: 'Custom English-Kannada bridging worksheets deployed based on early warnings.',
          description_kn: 'ಕನ್ನಡ ಭಾಷಾ ಕಲಿಕಾ ಅಂತರವನ್ನು ನಿವಾರಿಸಲು ಮುನ್ನೆಚ್ಚರಿಕೆ ಆಧಾರಿತ ದ್ವಿಭಾಷಾ ಕಲಿಕಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ.',
          category: 'bilingual',
          status: 'pending',
          assigned_to_name: 'Dr. Ramesh Rao',
          target_date: '2026-06-25'
        });
        deployedCount++;
      }
    });

    if (deployedCount > 0) {
      setBulkSuccess(true);
      // Register notification
      const notifs = mockDB.getNotifications();
      notifs.unshift({
        id: `nt-${Date.now()}`,
        title_en: 'Bulk AI Intervention Deployed',
        title_kn: 'ಸಾಮೂಹಿಕ ಕಲಿಕಾ ಕಿಟ್ ನಿಯೋಜನೆ',
        desc_en: `Auto-assigned bilingual transition kits to ${deployedCount} language-delayed government school students.`,
        desc_kn: `ಕಲಿಕಾ ತೊಂದರೆ ಹೊಂದಿರುವ ೯ ಸರ್ಕಾರಿ ಶಾಲೆಯ ${deployedCount} ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ದ್ವಿಭಾಷಾ ಕಿಟ್‌ಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ.`,
        time: 'Just now',
        read: false,
        type: 'success'
      });
      localStorage.setItem('ks_notifications', JSON.stringify(notifs));
      
      setTimeout(() => {
        setBulkSuccess(false);
      }, 2500);
    }
  };

  // Submit individual intervention creation form
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningStudent) return;

    mockDB.addIntervention({
      school_id: assigningStudent.school_id,
      school_name_en: assigningStudent.school_name_en,
      school_name_kn: assigningStudent.school_name_kn,
      student_id: assigningStudent.id,
      student_name_en: assigningStudent.name_en,
      student_name_kn: assigningStudent.name_kn,
      title_en: intervTitleEn || `${intervCategory.toUpperCase()} Campaign - ${assigningStudent.name_en.split(' ')[0]}`,
      title_kn: intervTitleKn || `${t(`interv.cat.${intervCategory}`)} - ${assigningStudent.name_kn.split(' ')[0]}`,
      description_en: intervDescEn || 'Assigned target campaign action plans.',
      description_kn: intervDescKn || 'ವಿಶೇಷ ಶೈಕ್ಷಣಿಕ ಸುಧಾರಣಾ ಜಾಗೃತಿ ಕ್ರಮ.',
      category: intervCategory,
      status: 'pending',
      assigned_to_name: 'Dr. Ramesh Rao',
      target_date: targetDate
    });

    setFormSuccess(true);

    setTimeout(() => {
      setFormSuccess(false);
      setAssigningStudent(null);
      setIntervTitleEn('');
      setIntervTitleKn('');
      setIntervDescEn('');
      setIntervDescKn('');
    }, 1000);
  };

  const triggerAssignForm = (std: Student) => {
    setAssigningStudent(std);
    setIntervCategory(std.risk_reasons.includes('language') ? 'bilingual' : 'attendance');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{t('risk.title')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {t('risk.subtitle')}
          </p>
        </div>
      </div>

      {/* AI Action Command Center Panel ( WOW Feature ) */}
      <div className="p-5 rounded-2xl border border-neon-cyan/25 bg-cyber-glass-cyan relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 hover-glow-sweep">
        
        {/* Glow Radar dot */}
        <div className="absolute top-4 right-4 flex items-center space-x-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
          </span>
          <span className="text-[10px] text-neon-cyan font-mono tracking-widest">AI RADAR</span>
        </div>

        <div className="text-left space-y-1 max-w-xl">
          <h3 className="text-sm md:text-base font-extrabold text-white font-mono flex items-center space-x-1.5">
            <BrainCircuit className="w-5 h-5 text-neon-cyan" />
            <span>{t('risk.bulk_title')}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('risk.bulk_description')} Our prediction algorithm has isolated students having high Kannada literacy delays. Click the button to mass-assign daily bridge campaign workbooks.
          </p>
        </div>

        {bulkSuccess && (
          <div className="px-4 py-2 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs font-bold font-mono animate-bounce">
            BILINGUAL MATERIALS BATCH DEPLOYED!
          </div>
        )}

        {!bulkSuccess && (
          <button
            onClick={handleBulkDeploy}
            className="w-full md:w-auto px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-neon-cyan via-neon-teal to-neon-purple text-white hover:shadow-glow-cyan/40 hover:scale-102 active:scale-98 transition-all text-xs font-mono"
            id="bulk-deploy-btn"
          >
            {t('risk.bulk_btn')}
          </button>
        )}
      </div>

      {/* Roster Controls */}
      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm flex flex-col sm:flex-row gap-3 items-center">
        
        {/* Search student / school */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or school..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-purple hover:border-slate-700 transition-all font-mono"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
        </div>

        {/* Risk Level Filter Toggle */}
        <div className="flex bg-slate-950/80 border border-slate-850 rounded-xl p-1 w-full sm:w-auto">
          {(['All', 'High', 'Medium'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRiskFilter(r)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedRiskFilter === r
                  ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/20 shadow-glow-purple/5'
                  : 'bg-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {r} Risk
            </button>
          ))}
        </div>
      </div>

      {/* Roster Listing Grid */}
      <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-md">
        <div className="overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-mono text-xs">
              {t('common.no_records')}
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="pb-3 pr-2">{t('risk.student_name')}</th>
                  <th className="pb-3 pr-2">{t('dash.school_name')}</th>
                  <th className="pb-3 pr-2 text-center">{t('risk.grade')}</th>
                  <th className="pb-3 pr-2 text-center">{t('risk.attendance')}</th>
                  <th className="pb-3 pr-2 text-center">{t('risk.language_gap')}</th>
                  <th className="pb-3 pr-2 text-center">Dropout Risk</th>
                  <th className="pb-3 pr-2 text-center">{t('risk.risk_factor')}</th>
                  <th className="pb-3 pr-2 text-right">{t('dash.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950 font-medium">
                {filteredStudents.map((std) => {
                  const isHigh = std.risk_level === 'High';
                  return (
                    <tr key={std.id} className="hover:bg-slate-950/30 transition-all">
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded bg-slate-900 border border-slate-850 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white text-xs md:text-sm">
                              {language === 'en' ? std.name_en : std.name_kn}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">ID: {std.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-slate-400">
                        <div className="flex flex-col">
                          <span className="text-slate-300 truncate max-w-[180px]">
                            {language === 'en' ? std.school_name_en : std.school_name_kn}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono flex items-center space-x-0.5 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-neon-cyan" />
                            <span>Karnataka</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-center text-slate-400 font-mono">Grade {std.grade}</td>
                      <td className="py-3.5 pr-2 text-center font-mono">
                        <span className={std.attendance_rate < 85 ? 'text-neon-pink' : 'text-slate-300'}>
                          {std.attendance_rate}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-center font-mono text-neon-cyan">{std.kannada_proficiency}%</td>
                      <td className="py-3.5 pr-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isHigh ? 'bg-neon-pink/15 text-neon-pink' : 'bg-neon-purple/15 text-neon-purple'
                        }`}>
                          {std.risk_level} ({std.risk_score}%)
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {std.risk_reasons.map((reason, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-[4px] bg-slate-900 text-[10px] text-slate-400 font-mono uppercase">
                              {t(`risk.reasons.${reason}`).split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => triggerAssignForm(std)}
                          className="px-2.5 py-1 rounded border border-slate-800 hover:border-neon-cyan/40 bg-slate-950/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all inline-flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-neon-cyan" />
                          <span>{t('risk.action.assign')}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Individual Campaign Deployment Dialog Form */}
      {assigningStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-neon-cyan/30 bg-cyber-card p-6 shadow-glow-cyan/15 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setAssigningStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-neon-pink border border-transparent hover:border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 text-left">
              <span className="text-[10px] uppercase text-neon-cyan font-mono tracking-widest block">{t('risk.action.assign')}</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Assign Plan for {language === 'en' ? assigningStudent.name_en : assigningStudent.name_kn}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {language === 'en' ? assigningStudent.school_name_en : assigningStudent.school_name_kn} Roster
              </p>
            </div>

            {formSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex items-center justify-center space-x-2 font-bold font-mono">
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                <span>Intervention Campaign deployed successfully!</span>
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Intervention Category selection */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase text-slate-400 font-mono tracking-widest mb-1.5">{t('interv.add.type')}</label>
                  <select
                    value={intervCategory}
                    onChange={(e) => setIntervCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none font-mono"
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
                    placeholder="ಉದಾ: ದ್ವಿಭಾಷಾ ಸೇತುವೆ ಕಿಟ್"
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
                    placeholder="Action plan notes..."
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
                    placeholder="ಕನ್ನಡ ಭಾಷಾ ಸುಧಾರಣಾ ಕ್ರಮ..."
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
                  onClick={() => setAssigningStudent(null)}
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
