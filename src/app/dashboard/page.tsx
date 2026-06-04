'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, School, EnrolmentTrend } from '@/lib/mockData';
import { KarnatakaMap } from '@/components/KarnatakaMap';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Building, TrendingDown, ShieldAlert, Map, ArrowUpRight, Search, SlidersHorizontal, BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const { language, t } = useTranslation();

  // State bindings
  const [schools, setSchools] = useState<School[]>([]);
  const [enrolmentTrends, setEnrolmentTrends] = useState<EnrolmentTrend[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState<string>('all');
  const [riskSort, setRiskSort] = useState<'asc' | 'desc'>('desc');

  // Load datasets on mount
  useEffect(() => {
    const loadData = async () => {
      setSchools(mockDB.getSchools());
      setEnrolmentTrends(mockDB.getEnrolmentTrends());
    };

    loadData();
  }, []);

  // Filter school roster lists based on interactive district map, search text, and instruction medium
  const filteredSchools = schools.filter(sch => {
    const matchesDistrict = selectedDistrict ? sch.district === selectedDistrict : true;
    const matchesMedium = mediumFilter === 'all' ? true : sch.primary_medium === mediumFilter;
    const matchesSearch = searchQuery === '' ? true : (
      sch.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.name_kn.includes(searchQuery) ||
      sch.taluk.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesDistrict && matchesMedium && matchesSearch;
  });

  // Sort schools based on Risk Index
  const sortedSchools = [...filteredSchools].sort((a, b) => {
    return riskSort === 'desc' ? b.risk_score - a.risk_score : a.risk_score - b.risk_score;
  });

  // Calculate high-fidelity real-time metrics
  const totalMonitored = filteredSchools.length;

  // Total students enrolled
  const totalStudentsEnrolled = filteredSchools.reduce((sum, s) => sum + s.total_students, 0);

  // Average enrolment decline rate
  const avgDecline = filteredSchools.length > 0
    ? parseFloat((filteredSchools.reduce((sum, s) => sum + s.enrolment_decline_rate, 0) / filteredSchools.length).toFixed(1))
    : 0;

  // Total critical dropouts predicted
  const totalAtRiskCount = filteredSchools.reduce((sum, s) => sum + s.at_risk_students, 0);

  // Number of district modules mapped
  const uniqueDistricts = Array.from(new Set(filteredSchools.map(s => s.district))).length;

  // Aggregate Taluk risk scores for BarChart data
  const getTalukChartData = () => {
    const talukGroup: Record<string, { count: number; sum: number }> = {};
    filteredSchools.forEach(s => {
      if (!talukGroup[s.taluk]) {
        talukGroup[s.taluk] = { count: 0, sum: 0 };
      }
      talukGroup[s.taluk].count++;
      talukGroup[s.taluk].sum += s.risk_score;
    });

    return Object.keys(talukGroup).map(taluk => ({
      name: taluk,
      'Risk Score': Math.round(talukGroup[taluk].sum / talukGroup[taluk].count)
    })).slice(0, 8); // top 8 taluks
  };

  const talukData = getTalukChartData();

  return (
    <div className="space-y-6">

      {/* Interactive Title Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{t('nav.dashboard')}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time dropout predictive modeling and linguistic assessment analytics.
          </p>
        </div>

        {/* Selected District Status Widget */}
        <div className="flex items-center space-x-3">
          {selectedDistrict && (
            <div className="px-3.5 py-1.5 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 text-xs text-neon-cyan font-mono font-semibold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
              <span>{t('dash.selected_district')}:</span>
              <span className="text-white">{selectedDistrict}</span>
            </div>
          )}
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">SYSTEM INTEGRITY: 100%</span>
        </div>
      </div>

      {/* Numerical Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: t('dash.total_schools'),
            value: totalMonitored,
            sub: `${totalStudentsEnrolled} Students`,
            icon: Building,
            glow: 'border-glow-purple bg-gradient-to-tr from-neon-purple/5 to-transparent',
            iconColor: 'text-neon-purple'
          },
          {
            title: t('dash.enrol_decline'),
            value: `${avgDecline}%`,
            sub: 'Annualized Decline',
            icon: TrendingDown,
            glow: 'border-glow-cyan bg-gradient-to-tr from-neon-cyan/5 to-transparent',
            iconColor: 'text-neon-cyan'
          },
          {
            title: t('dash.at_risk_students'),
            value: totalAtRiskCount,
            sub: 'Requires Interventions',
            icon: ShieldAlert,
            glow: 'border-glow-purple bg-gradient-to-tr from-neon-pink/5 to-transparent',
            iconColor: 'text-neon-pink'
          },
          {
            title: t('dash.districts_covered'),
            value: uniqueDistricts,
            sub: 'Active Regions Mapped',
            icon: Map,
            glow: 'border-glow-teal bg-gradient-to-tr from-neon-teal/5 to-transparent',
            iconColor: 'text-neon-teal'
          }
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className={`p-4 md:p-5 rounded-2xl border ${metric.glow} cyber-glass flex items-start justify-between hover-glow-sweep`}>
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  {metric.title}
                </span>
                <p className="text-xl md:text-3xl font-extrabold font-mono text-white">
                  {metric.value}
                </p>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                  {metric.sub}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 md:w-5 h-5 ${metric.iconColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Visual Interactive Map Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: SVG Map representation ( Takes 1 column on big screens ) */}
        <div className="lg:col-span-1 p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md flex flex-col justify-between">
          <KarnatakaMap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            schoolsData={schools}
          />
        </div>

        {/* Right Side: Primary charts ( Takes 2 columns ) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Enrolment Trends comparing Kannada vs English ( Line Chart ) */}
          <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
            <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-neon-cyan" />
                <span>{t('dash.enrol_trends_chart')}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Medium Comparison</span>
            </h3>

            <div className="h-64 md:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrolmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                  <XAxis dataKey="year" stroke="#475569" fontSize={11} fontStyle="italic" />
                  <YAxis stroke="#475569" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }}
                    labelFormatter={(label) => `Academic Year: ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="kannada"
                    name={t('dash.kannada_medium')}
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="english"
                    name={t('dash.english_medium')}
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dropout Risk by Taluk ( Bar Chart ) */}
          <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
            <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-neon-purple animate-pulse" />
              <span>{t('dash.dropout_risk_taluk')}</span>
            </h3>

            <div className="h-60 w-full">
              {talukData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No district taluk data compiled.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={talukData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                    <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(168,85,247,0.3)', color: '#fff' }}
                    />
                    <Bar
                      dataKey="Risk Score"
                      name="Risk Score %"
                      fill="#a855f7"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Interactive At-Risk Schools Directory Checklist */}
      <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-md">

        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-900 mb-4">
          <div>
            <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-neon-cyan" />
              <span>{t('dash.at_risk_schools_table')}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Filtered and ranked government institutes requiring intervention logs.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('school.search_placeholder').split('...')[0]}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-200 focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan/5 hover:border-slate-700 transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Medium Selector */}
            <select
              value={mediumFilter}
              onChange={(e) => setMediumFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 focus:outline-none focus:border-neon-cyan cursor-pointer appearance-none"
            >
              <option value="all">All Mediums</option>
              <option value="kannada">Kannada Medium</option>
              <option value="both">Bilingual</option>
            </select>

            {/* Risk Sort Order */}
            <button
              onClick={() => setRiskSort(riskSort === 'desc' ? 'asc' : 'desc')}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/20 transition-all flex items-center space-x-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{riskSort === 'desc' ? 'High Risk first' : 'Low Risk first'}</span>
            </button>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {sortedSchools.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-mono">
              {t('common.no_records')}
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
                  <th className="pb-3 pr-2">{t('dash.school_name')}</th>
                  <th className="pb-3 pr-2">{t('school.district')}</th>
                  <th className="pb-3 pr-2">{t('school.taluk')}</th>
                  <th className="pb-3 pr-2">{t('school.total_students')}</th>
                  <th className="pb-3 pr-2">{t('school.decline_rate')}</th>
                  <th className="pb-3 pr-2 text-center">{t('dash.risk_score')}</th>
                  <th className="pb-3 pr-2 text-right">{t('dash.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950 font-medium">
                {sortedSchools.map((sch) => {
                  const isHigh = sch.risk_score >= 70;
                  const isElevated = sch.risk_score >= 50 && sch.risk_score < 70;
                  return (
                    <tr key={sch.id} className="hover:bg-slate-950/30 transition-all group">
                      <td className="py-3.5 pr-2">
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-neon-cyan transition-colors truncate max-w-[220px]">
                            {language === 'en' ? sch.name_en : sch.name_kn}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono uppercase mt-0.5 tracking-wider">
                            {sch.primary_medium} Instruction
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-slate-400 font-mono">{sch.district}</td>
                      <td className="py-3.5 pr-2 text-slate-400">{sch.taluk}</td>
                      <td className="py-3.5 pr-2 text-slate-300 font-mono">{sch.total_students}</td>
                      <td className="py-3.5 pr-2 text-neon-pink font-mono">-{sch.enrolment_decline_rate}%</td>
                      <td className="py-3.5 pr-2 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono ${isHigh ? 'bg-neon-pink/15 text-neon-pink border border-neon-pink/20 shadow-glow-purple/5' :
                          isElevated ? 'bg-neon-purple/15 text-neon-purple border border-neon-purple/20' :
                            'bg-neon-teal/15 text-neon-teal border border-neon-teal/20'
                          }`}>
                          {sch.risk_score}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <Link
                          href={`/dashboard/schools/${sch.id}`}
                          className="px-2.5 py-1 rounded border border-slate-800 hover:border-neon-cyan/40 bg-slate-950/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all inline-flex items-center space-x-1"
                        >
                          <span>{t('dash.view_dossier')}</span>
                          <ArrowUpRight className="w-3 h-3 text-neon-cyan" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
