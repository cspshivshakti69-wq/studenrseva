'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, School, Student } from '@/lib/mockData';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  BarChart3, Sliders, Calendar, BookOpen, AlertTriangle
} from 'lucide-react';

export default function AnalyticsPage() {
  const { language, t } = useTranslation();

  // States
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedTaluk, setSelectedTaluk] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');

  useEffect(() => {
    setSchools(mockDB.getSchools());
    setStudents(mockDB.getStudents());
  }, []);

  const districtsList = Array.from(new Set(schools.map(s => s.district)));
  const taluksList = Array.from(new Set(
    schools
      .filter(s => selectedDistrict === 'all' ? true : s.district === selectedDistrict)
      .map(s => s.taluk)
  ));

  // Filtered Students and Schools for charts
  const filteredSchools = schools.filter(s => selectedDistrict === 'all' ? true : s.district === selectedDistrict);
  const schoolIds = filteredSchools.map(s => s.id);
  
  const filteredStudents = students.filter(std => {
    const matchesSchool = schoolIds.includes(std.school_id);
    const matchedSchoolObj = schools.find(s => s.id === std.school_id);
    const matchesTaluk = selectedTaluk === 'all' ? true : (matchedSchoolObj ? matchedSchoolObj.taluk === selectedTaluk : true);
    return matchesSchool && matchesTaluk;
  });

  // 1. Grade-wise performance aggregate
  const getGradeScoreData = () => {
    const grades = [5, 6, 7, 8];
    return grades.map(g => {
      const list = filteredStudents.filter(s => s.grade === g);
      if (list.length === 0) return { name: `Grade ${g}`, Kannada: 0, English: 0 };
      
      const kanSum = list.reduce((sum, s) => sum + s.kannada_proficiency, 0);
      const engSum = list.reduce((sum, s) => sum + s.english_proficiency, 0);
      
      return {
        name: `Grade ${g}`,
        [t('analytics.kan_comp')]: Math.round(kanSum / list.length),
        [t('analytics.eng_comp')]: Math.round(engSum / list.length)
      };
    });
  };

  const gradeScoreData = getGradeScoreData();

  // 2. Attendance rates aggregate
  const attendanceTrends = [
    { week: 'Week 1', [t('analytics.att_rate')]: 92.4 },
    { week: 'Week 2', [t('analytics.att_rate')]: 91.8 },
    { week: 'Week 3', [t('analytics.att_rate')]: 89.5 },
    { week: 'Week 4', [t('analytics.att_rate')]: 88.2 },
    { week: 'Week 5', [t('analytics.att_rate')]: 90.6 },
    { week: 'Week 6', [t('analytics.att_rate')]: 92.1 },
    { week: 'Week 7', [t('analytics.att_rate')]: 93.5 },
    { week: 'Week 8', [t('analytics.att_rate')]: 91.0 },
    { week: 'Week 9', [t('analytics.att_rate')]: 87.4 }, // Harvest season decline mock
    { week: 'Week 10', [t('analytics.att_rate')]: 86.1 },
    { week: 'Week 11', [t('analytics.att_rate')]: 89.2 },
    { week: 'Week 12', [t('analytics.att_rate')]: 91.4 },
  ];

  // 3. Language proficiency distribution chart (Scatter-ish mock using bucketed bar ranges)
  const getLanguageProfDistribution = () => {
    const ranges = [
      { name: '0-40%', Kannada: 0, English: 0 },
      { name: '40-60%', Kannada: 0, English: 0 },
      { name: '60-80%', Kannada: 0, English: 0 },
      { name: '80-100%', Kannada: 0, English: 0 },
    ];

    filteredStudents.forEach(std => {
      // Kannada
      if (std.kannada_proficiency < 40) ranges[0].Kannada++;
      else if (std.kannada_proficiency < 60) ranges[1].Kannada++;
      else if (std.kannada_proficiency < 80) ranges[2].Kannada++;
      else ranges[3].Kannada++;

      // English
      if (std.english_proficiency < 40) ranges[0].English++;
      else if (std.english_proficiency < 60) ranges[1].English++;
      else if (std.english_proficiency < 80) ranges[2].English++;
      else ranges[3].English++;
    });

    return ranges;
  };

  const profDistribution = getLanguageProfDistribution();

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{t('analytics.title')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {t('analytics.subtitle')}
          </p>
        </div>
      </div>

      {/* Analytics Dropdown Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* District select */}
        <div>
          <label className="block text-[10px] uppercase text-slate-500 font-mono tracking-widest mb-1.5">{t('analytics.filter.district')}</label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedTaluk('all');
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
            >
              <option value="all">All Districts</option>
              {districtsList.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Taluk select */}
        <div>
          <label className="block text-[10px] uppercase text-slate-500 font-mono tracking-widest mb-1.5">{t('analytics.filter.taluk')}</label>
          <div className="relative">
            <select
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
            >
              <option value="all">All Taluks</option>
              {taluksList.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Year select */}
        <div>
          <label className="block text-[10px] uppercase text-slate-500 font-mono tracking-widest mb-1.5">{t('analytics.filter.year')}</label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
            >
              <option value="2026">2025 - 2026 (Active)</option>
              <option value="2025">2024 - 2025</option>
              <option value="2024">2023 - 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Rates Over Time */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-neon-cyan animate-pulse" />
            <span>{t('analytics.attendance_title')}</span>
          </h3>
          <p className="text-[10px] text-slate-500 mb-4">
            Aggregated district attendance percentages. Visualizes warning declines during agricultural harvests.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="week" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={11} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                <Area 
                  type="monotone" 
                  dataKey={t('analytics.att_rate')} 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorAtt)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade performance breakdown */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-neon-purple" />
            <span>{t('analytics.grade_perf_title')}</span>
          </h3>
          <p className="text-[10px] text-slate-500 mb-4">
            Compares Kannada and English comprehension ratings across core state grade cohorts.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeScoreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey={t('analytics.kan_comp')} fill="#06b6d4" radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Bar dataKey={t('analytics.eng_comp')} fill="#a855f7" radius={[3, 3, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language distribution histogram ( 2 Column visual ) */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-md lg:col-span-2">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-neon-teal" />
            <span>{t('analytics.gaps_title')}</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {t('analytics.gaps_desc')}
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Kannada" name="Students in Kannada Range" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={25} />
                <Bar dataKey="English" name="Students in English Range" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
