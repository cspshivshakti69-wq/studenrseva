'use client';

import React, { useState, useEffect, use } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, School, Student } from '@/lib/mockData';
import { 
  ArrowLeft, MapPin, Building, ShieldAlert, Award, 
  BarChart3, Edit3, Sliders, GraduationCap, ArrowUpRight, CheckCircle2, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface SchoolDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  const { language, t } = useTranslation();
  const router = useRouter();

  // Resolve asynchronous route params
  const { id } = use(params);

  // States
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Scoring update form states
  const [editAttendance, setEditAttendance] = useState('90');
  const [editKannada, setEditKannada] = useState('75');
  const [editEnglish, setEditEnglish] = useState('60');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Load school dossier data
  const loadDossierData = () => {
    const schoolsList = mockDB.getSchools();
    const matchedSchool = schoolsList.find(s => s.id === id);
    if (!matchedSchool) {
      router.push('/dashboard/schools');
      return;
    }
    setSchool(matchedSchool);

    const allStudents = mockDB.getStudents();
    const schoolRoster = allStudents.filter(std => std.school_id === id);
    setStudents(schoolRoster);
  };

  useEffect(() => {
    loadDossierData();
  }, [id]);

  if (!school) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin mb-3" />
        <span>LOADING RECORDS...</span>
      </div>
    );
  }

  // Handle student scoring update
  const handleScoreUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updated = mockDB.updateStudentScores(
      editingStudent.id,
      parseFloat(editAttendance) || 90,
      parseFloat(editKannada) || 75,
      parseFloat(editEnglish) || 60
    );

    if (updated) {
      setUpdateSuccess(true);
      loadDossierData(); // refresh dossier and school-level metrics

      setTimeout(() => {
        setUpdateSuccess(false);
        setEditingStudent(null);
      }, 1000);
    }
  };

  const triggerEditForm = (student: Student) => {
    setEditingStudent(student);
    setEditAttendance(student.attendance_rate.toString());
    setEditKannada(student.kannada_proficiency.toString());
    setEditEnglish(student.english_proficiency.toString());
  };

  // Demographics aggregates for visuals
  const gradeDistribution = [
    { grade: 'Grade 5', count: students.filter(s => s.grade === 5).length },
    { grade: 'Grade 6', count: students.filter(s => s.grade === 6).length },
    { grade: 'Grade 7', count: students.filter(s => s.grade === 7).length },
    { grade: 'Grade 8', count: students.filter(s => s.grade === 8).length },
  ];

  // Grade-wise literacy scores
  const getGradeScoreData = () => {
    const grades = [5, 6, 7, 8];
    return grades.map(g => {
      const list = students.filter(s => s.grade === g);
      if (list.length === 0) return { name: `Grade ${g}`, Kannada: 0, English: 0 };
      
      const kanAvg = list.reduce((sum, s) => sum + s.kannada_proficiency, 0) / list.length;
      const engAvg = list.reduce((sum, s) => sum + s.english_proficiency, 0) / list.length;

      return {
        name: `Grade ${g}`,
        Kannada: Math.round(kanAvg),
        English: Math.round(engAvg)
      };
    });
  };

  const gradeScoreData = getGradeScoreData();

  // Enrolment history curve ( mock school-level historical medium comparison )
  const enrolmentHistory = [
    { year: '2022', Enrolment: school.total_students + 25 },
    { year: '2023', Enrolment: school.total_students + 18 },
    { year: '2024', Enrolment: school.total_students + 10 },
    { year: '2025', Enrolment: school.total_students + 4 },
    { year: '2026', Enrolment: school.total_students }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header with back path */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div className="space-y-1">
          <Link href="/dashboard/schools" className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-neon-cyan transition-colors mb-1 font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO DIRECTORY</span>
          </Link>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
            <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block shadow-glow-cyan" />
            <span>{language === 'en' ? school.name_en : school.name_kn}</span>
          </h1>
          <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[10px] uppercase">
            <MapPin className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>{school.district} DISTRICT • {school.taluk} TALUK</span>
          </div>
        </div>

        {/* Risk score badge */}
        <div className="p-3.5 rounded-xl border border-neon-pink/20 bg-neon-pink/5 text-left flex flex-col justify-center min-w-[130px]">
          <span className="text-[10px] uppercase text-slate-500 font-mono font-semibold tracking-wider">{t('school.risk_index')}</span>
          <span className="text-2xl font-extrabold font-mono text-neon-pink mt-0.5">{school.risk_score}%</span>
        </div>
      </div>

      {/* Micro Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('school.total_students'), val: school.total_students, sub: 'Actively Registered', icon: Building, color: 'text-neon-purple' },
          { label: t('school.medium'), val: school.primary_medium, sub: 'Instruction Medium', icon: GraduationCap, color: 'text-neon-cyan' },
          { label: t('school.decline_rate'), val: `-${school.enrolment_decline_rate}%`, sub: 'Year-over-Year Decline', icon: Sliders, color: 'text-neon-pink' },
          { label: t('school.at_risk'), val: school.at_risk_students, sub: 'Requiring Action Plan', icon: ShieldAlert, color: 'text-neon-teal' }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-mono tracking-widest">{item.label}</span>
                <span className="text-xl font-bold text-white block mt-1 uppercase font-mono">{item.val}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{item.sub}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-900">
                <Icon className={`w-4 h-4 md:w-5 h-5 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Enrolment Curves history */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-neon-cyan" />
            <span>Enrolment Trajectory (2022 - 2026)</span>
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrolmentHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="year" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                <Line 
                  type="monotone" 
                  dataKey="Enrolment" 
                  stroke="#a855f7" 
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }} 
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade-wise Language Proficiency Gaps */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
          <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-neon-purple animate-pulse" />
            <span>{t('school.details.learning_gaps')}</span>
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeScoreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                <Bar dataKey="Kannada" name="Kannada Proficiency %" fill="#06b6d4" radius={[3, 3, 0, 0]} maxBarSize={20} />
                <Bar dataKey="English" name="English Proficiency %" fill="#a855f7" radius={[3, 3, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Government Student Demographics Roster Table */}
      <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-md">
        <div className="pb-4 border-b border-slate-900 mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-neon-teal" />
              <span>{t('school.details.student_roster')}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Configure student metrics in real-time. Click "Update Scores" to test ML risk recalculations.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {students.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-mono text-xs">
              No students enrolled in database.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="pb-3 pr-2">Student Name</th>
                  <th className="pb-3 pr-2 text-center">Grade</th>
                  <th className="pb-3 pr-2 text-center">Attendance</th>
                  <th className="pb-3 pr-2 text-center">Kannada Proficiency</th>
                  <th className="pb-3 pr-2 text-center">English Proficiency</th>
                  <th className="pb-3 pr-2 text-center">Risk Level</th>
                  <th className="pb-3 pr-2 text-center">Commute reasons</th>
                  <th className="pb-3 pr-2 text-right">Scoring Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950 font-medium">
                {students.map((std) => {
                  const isHighRisk = std.risk_level === 'High';
                  const isMedRisk = std.risk_level === 'Medium';
                  return (
                    <tr key={std.id} className="hover:bg-slate-950/30 transition-all">
                      <td className="py-3.5 pr-2">
                        <div className="flex flex-col">
                          <span className="text-white text-xs md:text-sm">
                            {language === 'en' ? std.name_en : std.name_kn}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            STD-ID: {std.id.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-center font-mono text-slate-300">Grade {std.grade}</td>
                      <td className="py-3.5 pr-2 text-center font-mono">
                        <span className={std.attendance_rate < 85 ? 'text-neon-pink' : 'text-slate-300'}>
                          {std.attendance_rate}%
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-center font-mono text-neon-cyan">{std.kannada_proficiency}%</td>
                      <td className="py-3.5 pr-2 text-center font-mono text-neon-purple">{std.english_proficiency}%</td>
                      <td className="py-3.5 pr-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isHighRisk ? 'bg-neon-pink/15 text-neon-pink border border-neon-pink/20' :
                          isMedRisk ? 'bg-neon-purple/15 text-neon-purple border border-neon-purple/20' :
                          'bg-neon-teal/15 text-neon-teal border border-neon-teal/20'
                        }`}>
                          {std.risk_level} ({std.risk_score}%)
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {std.risk_reasons.length === 0 ? (
                            <span className="text-slate-600 text-[10px] font-mono">None</span>
                          ) : (
                            std.risk_reasons.map((r, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-slate-900 rounded text-[9px] text-slate-400 font-mono">
                                {r}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <button
                          onClick={() => triggerEditForm(std)}
                          className="px-2.5 py-1 rounded border border-slate-800 hover:border-neon-purple/40 bg-slate-950/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all inline-flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3 text-neon-purple" />
                          <span>Update Scores</span>
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

      {/* Interactive Update Scores Dialog Modal ( Persistence Demo ) */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neon-purple/30 bg-cyber-card p-6 shadow-glow-purple/15 relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-neon-pink border border-transparent hover:border-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 text-left">
              <span className="text-[10px] uppercase text-neon-purple font-mono tracking-widest block">Update Student Dossier</span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {language === 'en' ? editingStudent.name_en : editingStudent.name_kn}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Updates directly recalculate local dropout predictive risk indicators.
              </p>
            </div>

            {updateSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex items-center justify-center space-x-2 font-bold font-mono">
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
                <span>Scores updated. Risk index re-evaluated.</span>
              </div>
            )}

            <form onSubmit={handleScoreUpdateSubmit} className="space-y-4 text-left font-mono">
              {/* Attendance */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 tracking-widest mb-1.5">
                  Attendance Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={editAttendance}
                  onChange={(e) => setEditAttendance(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-purple"
                />
              </div>

              {/* Kannada Proficiency */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 tracking-widest mb-1.5">
                  Kannada Comprehension Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={editKannada}
                  onChange={(e) => setEditKannada(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-purple"
                />
              </div>

              {/* English Proficiency */}
              <div>
                <label className="block text-[10px] uppercase text-slate-400 tracking-widest mb-1.5">
                  English Literacy Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={editEnglish}
                  onChange={(e) => setEditEnglish(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-neon-purple"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-850 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateSuccess}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-glow-cyan/40 hover:scale-102 transition-all"
                >
                  Recalculate Risk
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
