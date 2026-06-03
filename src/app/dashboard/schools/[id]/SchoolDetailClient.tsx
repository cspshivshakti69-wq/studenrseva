'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { mockDB, School, Student } from '@/lib/mockData';
import {
    ArrowLeft, MapPin, Building, ShieldAlert, Award,
    BarChart3, Edit3, Sliders, GraduationCap, CheckCircle2, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function SchoolDetailClient({ id }: { id: string }) {
    const { language, t } = useTranslation();
    const router = useRouter();

    const [school, setSchool] = useState<School | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editAttendance, setEditAttendance] = useState('90');
    const [editKannada, setEditKannada] = useState('75');
    const [editEnglish, setEditEnglish] = useState('60');
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const loadDossierData = () => {
        const schoolsList = mockDB.getSchools();
        const matchedSchool = schoolsList.find(s => s.id === id);
        if (!matchedSchool) { router.push('/dashboard/schools'); return; }
        setSchool(matchedSchool);
        setStudents(mockDB.getStudents().filter(std => std.school_id === id));
    };

    useEffect(() => { loadDossierData(); }, [id]);

    if (!school) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
                <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin mb-3" />
                <span>LOADING RECORDS...</span>
            </div>
        );
    }

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
            loadDossierData();
            setTimeout(() => { setUpdateSuccess(false); setEditingStudent(null); }, 1000);
        }
    };

    const triggerEditForm = (student: Student) => {
        setEditingStudent(student);
        setEditAttendance(student.attendance_rate.toString());
        setEditKannada(student.kannada_proficiency.toString());
        setEditEnglish(student.english_proficiency.toString());
    };

    const gradeScoreData = [5, 6, 7, 8].map(g => {
        const list = students.filter(s => s.grade === g);
        if (!list.length) return { name: `Grade ${g}`, Kannada: 0, English: 0 };
        return {
            name: `Grade ${g}`,
            Kannada: Math.round(list.reduce((s, x) => s + x.kannada_proficiency, 0) / list.length),
            English: Math.round(list.reduce((s, x) => s + x.english_proficiency, 0) / list.length),
        };
    });

    const enrolmentHistory = [
        { year: '2022', Enrolment: school.total_students + 25 },
        { year: '2023', Enrolment: school.total_students + 18 },
        { year: '2024', Enrolment: school.total_students + 10 },
        { year: '2025', Enrolment: school.total_students + 4 },
        { year: '2026', Enrolment: school.total_students },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
                <div className="space-y-1">
                    <Link href="/dashboard/schools" className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-neon-cyan transition-colors mb-1 font-mono">
                        <ArrowLeft className="w-3.5 h-3.5" /><span>BACK TO DIRECTORY</span>
                    </Link>
                    <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2.5">
                        <span className="w-1.5 h-7 rounded bg-gradient-to-t from-neon-purple to-neon-cyan inline-block" />
                        <span>{language === 'en' ? school.name_en : school.name_kn}</span>
                    </h1>
                    <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[10px] uppercase">
                        <MapPin className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
                        <span>{school.district} DISTRICT • {school.taluk} TALUK</span>
                    </div>
                </div>
                <div className="p-3.5 rounded-xl border border-neon-pink/20 bg-neon-pink/5 text-left flex flex-col justify-center min-w-[130px]">
                    <span className="text-[10px] uppercase text-slate-500 font-mono font-semibold tracking-wider">{t('school.risk_index')}</span>
                    <span className="text-2xl font-extrabold font-mono text-neon-pink mt-0.5">{school.risk_score}%</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: t('school.total_students'), val: school.total_students, sub: 'Actively Registered', icon: Building, color: 'text-neon-purple' },
                    { label: t('school.medium'), val: school.primary_medium, sub: 'Instruction Medium', icon: GraduationCap, color: 'text-neon-cyan' },
                    { label: t('school.decline_rate'), val: `-${school.enrolment_decline_rate}%`, sub: 'Year-over-Year Decline', icon: Sliders, color: 'text-neon-pink' },
                    { label: t('school.at_risk'), val: school.at_risk_students, sub: 'Requiring Action Plan', icon: ShieldAlert, color: 'text-neon-teal' },
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
                    <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                        <BarChart3 className="w-4 h-4 text-neon-cyan" /><span>Enrolment Trajectory (2022–2026)</span>
                    </h3>
                    <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enrolmentHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                                <XAxis dataKey="year" stroke="#475569" fontSize={11} />
                                <YAxis stroke="#475569" fontSize={11} />
                                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                                <Line type="monotone" dataKey="Enrolment" stroke="#a855f7" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/60 backdrop-blur-md">
                    <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-neon-purple animate-pulse" /><span>{t('school.details.learning_gaps')}</span>
                    </h3>
                    <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeScoreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#070420', border: '1px solid rgba(6,182,212,0.3)', color: '#fff' }} />
                                <Bar dataKey="Kannada" fill="#06b6d4" radius={[3, 3, 0, 0]} maxBarSize={20} />
                                <Bar dataKey="English" fill="#a855f7" radius={[3, 3, 0, 0]} maxBarSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Student Roster */}
            <div className="p-5 rounded-2xl border border-slate-900 bg-cyber-card/75 backdrop-blur-md">
                <div className="pb-4 border-b border-slate-900 mb-4">
                    <h3 className="text-xs md:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center space-x-1.5">
                        <GraduationCap className="w-4 h-4 text-neon-teal" /><span>{t('school.details.student_roster')}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Click "Update Scores" to recalculate dropout risk.</p>
                </div>
                <div className="overflow-x-auto">
                    {students.length === 0
                        ? <div className="text-center py-10 text-slate-500 font-mono text-xs">No students enrolled.</div>
                        : (
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-900 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                                        <th className="pb-3 pr-3">Name</th>
                                        <th className="pb-3 pr-3 text-center">Grade</th>
                                        <th className="pb-3 pr-3 text-center">Attend.</th>
                                        <th className="pb-3 pr-3 text-center">Kannada</th>
                                        <th className="pb-3 pr-3 text-center">English</th>
                                        <th className="pb-3 pr-3 text-center">Risk</th>
                                        <th className="pb-3 pr-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-950">
                                    {students.map(std => {
                                        const isHigh = std.risk_level === 'High';
                                        const isMed = std.risk_level === 'Medium';
                                        return (
                                            <tr key={std.id} className="hover:bg-slate-950/30 transition-all">
                                                <td className="py-3 pr-3">
                                                    <span className="text-white text-xs">{language === 'en' ? std.name_en : std.name_kn}</span>
                                                    <span className="block text-[9px] text-slate-500 font-mono">{std.id.toUpperCase()}</span>
                                                </td>
                                                <td className="py-3 pr-3 text-center font-mono text-slate-300">G{std.grade}</td>
                                                <td className="py-3 pr-3 text-center font-mono">
                                                    <span className={std.attendance_rate < 85 ? 'text-neon-pink' : 'text-slate-300'}>{std.attendance_rate}%</span>
                                                </td>
                                                <td className="py-3 pr-3 text-center font-mono text-neon-cyan">{std.kannada_proficiency}%</td>
                                                <td className="py-3 pr-3 text-center font-mono text-neon-purple">{std.english_proficiency}%</td>
                                                <td className="py-3 pr-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${isHigh ? 'bg-neon-pink/15 text-neon-pink' : isMed ? 'bg-neon-purple/15 text-neon-purple' : 'bg-neon-teal/15 text-neon-teal'}`}>
                                                        {std.risk_level}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button onClick={() => triggerEditForm(std)}
                                                        className="px-2.5 py-1 rounded border border-slate-800 hover:border-neon-purple/40 bg-slate-950/60 text-[10px] font-bold text-slate-400 hover:text-white transition-all inline-flex items-center space-x-1">
                                                        <Edit3 className="w-3 h-3 text-neon-purple" /><span>Edit</span>
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

            {/* Edit modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-neon-purple/30 bg-cyber-card p-6 relative">
                        <button onClick={() => setEditingStudent(null)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-neon-pink">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-5">
                            <span className="text-[10px] uppercase text-neon-purple font-mono tracking-widest block">Update Dossier</span>
                            <h3 className="text-base font-bold text-white mt-0.5">{language === 'en' ? editingStudent.name_en : editingStudent.name_kn}</h3>
                        </div>
                        {updateSuccess && (
                            <div className="p-3 mb-4 rounded-lg bg-neon-teal/15 border border-neon-teal/40 text-neon-teal text-xs flex items-center space-x-2 font-bold">
                                <CheckCircle2 className="w-4 h-4" /><span>Scores updated. Risk re-evaluated.</span>
                            </div>
                        )}
                        <form onSubmit={handleScoreUpdateSubmit} className="space-y-4 font-mono">
                            {[
                                { label: 'Attendance Rate (%)', val: editAttendance, set: setEditAttendance },
                                { label: 'Kannada Score (%)', val: editKannada, set: setEditKannada },
                                { label: 'English Score (%)', val: editEnglish, set: setEditEnglish },
                            ].map(f => (
                                <div key={f.label}>
                                    <label className="block text-[10px] uppercase text-slate-400 tracking-widest mb-1.5">{f.label}</label>
                                    <input type="number" min="0" max="100" required value={f.val} onChange={e => f.set(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-950/60 text-sm text-slate-200 focus:outline-none focus:border-neon-purple" />
                                </div>
                            ))}
                            <div className="flex justify-end space-x-2 pt-2">
                                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" disabled={updateSuccess} className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-neon-purple to-neon-cyan text-white disabled:opacity-50">Recalculate Risk</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
