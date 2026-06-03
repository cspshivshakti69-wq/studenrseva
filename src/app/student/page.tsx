'use client';

import React, { useEffect, useState } from 'react';
import StudentShell from '@/components/StudentShell';
import { studentDB, ExamScore, MOTIVATIONAL_QUOTES } from '@/lib/studentData';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Plus, Trash2, TrendingUp, Target, Award, Brain, Sparkles } from 'lucide-react';
import Script from 'next/script';

const COLORS = ['#06b6d4', '#a855f7', '#14b8a6', '#ec4899', '#f59e0b'];

export default function StudentDashboardPage() {
    const [scores, setScores] = useState<ExamScore[]>([]);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ examName: '', subject: '', score: '', maxScore: '100', date: new Date().toISOString().split('T')[0] });

    useEffect(() => { setScores(studentDB.getScores()); }, []);

    const subjects = [...new Set(scores.map(s => s.subject))];
    const examNames = [...new Set(scores.map(s => s.examName))];

    const progressData = examNames.map(exam => {
        const row: Record<string, string | number> = { exam };
        subjects.forEach(sub => {
            const s = scores.find(sc => sc.examName === exam && sc.subject === sub);
            if (s) row[sub] = Math.round((s.score / s.maxScore) * 100);
        });
        return row;
    });

    const subjectAvg = subjects.map(sub => {
        const ss = scores.filter(s => s.subject === sub);
        const avg = ss.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / ss.length;
        return { subject: sub, average: Math.round(avg) };
    });

    const overallAvg = scores.length
        ? Math.round(scores.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / scores.length)
        : 0;

    const getAISuggestion = async () => {
        if (!window.puter?.ai?.chat) {
            setAiSuggestion('Puter AI loading — a sign-in popup may appear on first use.');
            return;
        }
        setAiLoading(true);
        setAiSuggestion('');
        try {
            const summary = subjectAvg.map(s => `${s.subject}: ${s.average}%`).join(', ');
            const prompt = `Student exam averages: ${summary}. Overall: ${overallAvg}%. Give 3-4 concise, motivational bullet-point study suggestions to improve weak areas and maintain strengths.`;
            const res = await window.puter.ai.chat(prompt, { model: 'claude-3-5-haiku' });
            const text = typeof res === 'string' ? res : res?.message?.content?.[0]?.text ?? String(res);
            setAiSuggestion(text.trim());
        } catch {
            setAiSuggestion('Could not fetch AI suggestions. Please try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.examName || !form.subject || !form.score) return;
        studentDB.addScore({ examName: form.examName, subject: form.subject, score: Number(form.score), maxScore: Number(form.maxScore), date: form.date });
        setScores(studentDB.getScores());
        setShowAdd(false);
        setForm({ examName: '', subject: '', score: '', maxScore: '100', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <StudentShell>
            <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">My Dashboard</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Track your exam progress and get AI-powered study advice</p>
                    </div>
                    <button onClick={() => setShowAdd(true)}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-teal to-neon-purple text-white text-sm font-bold hover:shadow-[0_0_16px_rgba(20,184,166,0.4)] transition-all">
                        <Plus className="w-4 h-4" /><span>Add Score</span>
                    </button>
                </div>

                {/* Quote */}
                <div className="p-4 rounded-2xl border border-neon-teal/20 bg-neon-teal/5">
                    <div className="flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-neon-teal shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-white italic">"{quote.text}"</p>
                            <p className="text-xs text-neon-teal font-mono mt-1">— {quote.author}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Overall Average', val: `${overallAvg}%`, icon: TrendingUp, color: 'text-neon-cyan', border: 'border-neon-cyan/20' },
                        { label: 'Exams Logged', val: scores.length, icon: Target, color: 'text-neon-purple', border: 'border-neon-purple/20' },
                        { label: 'Best Subject', val: subjectAvg.sort((a, b) => b.average - a.average)[0]?.subject ?? '—', icon: Award, color: 'text-neon-teal', border: 'border-neon-teal/20' },
                        { label: 'Subjects', val: subjects.length, icon: Brain, color: 'text-neon-pink', border: 'border-neon-pink/20' },
                    ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className={`p-4 rounded-2xl border ${s.border} bg-cyber-card/60 backdrop-blur-md`}>
                                <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                                <p className={`text-xl font-extrabold font-mono ${s.color}`}>{s.val}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md">
                        <h2 className="text-sm font-bold text-white mb-4">Score Progress (%)</h2>
                        {progressData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={progressData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="exam" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: '#070420', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8 }} />
                                    {subjects.map((sub, i) => (
                                        <Line key={sub} type="monotone" dataKey={sub} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <p className="text-slate-500 text-sm text-center py-10">Add scores to see progress</p>}
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md">
                        <h2 className="text-sm font-bold text-white mb-4">Subject Average (%)</h2>
                        {subjectAvg.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={subjectAvg}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: '#070420', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8 }} />
                                    <Bar dataKey="average" fill="#a855f7" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <p className="text-slate-500 text-sm text-center py-10">No data yet</p>}
                    </div>
                </div>

                {/* AI Suggestions */}
                <div className="p-5 rounded-2xl border border-neon-purple/20 bg-cyber-card/60 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Brain className="w-5 h-5 text-neon-purple" />
                            <h2 className="text-sm font-bold text-white">AI Study Suggestions</h2>
                        </div>
                        <button onClick={getAISuggestion} disabled={aiLoading}
                            className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-neon-purple to-neon-teal text-white disabled:opacity-40 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all">
                            {aiLoading ? 'Thinking…' : 'Get AI Advice'}
                        </button>
                    </div>
                    {aiSuggestion
                        ? <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-950/60 rounded-xl p-4 border border-slate-800">{aiSuggestion}</div>
                        : <p className="text-xs text-slate-500 italic">Click "Get AI Advice" for personalised suggestions based on your marks.</p>}
                </div>

                {/* Score log */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md">
                    <h2 className="text-sm font-bold text-white mb-4">Exam Score Log</h2>
                    {scores.length === 0
                        ? <p className="text-slate-500 text-sm text-center py-6">No scores yet — add your first result above.</p>
                        : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-left">
                                            {['Exam', 'Subject', 'Score', '%', 'Date', ''].map(h => (
                                                <th key={h} className="pb-2 pr-4 text-xs font-mono text-slate-500 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-900">
                                        {[...scores].reverse().map(s => {
                                            const pct = Math.round((s.score / s.maxScore) * 100);
                                            return (
                                                <tr key={s.id} className="hover:bg-slate-950/40">
                                                    <td className="py-2.5 pr-4 text-white font-medium">{s.examName}</td>
                                                    <td className="py-2.5 pr-4 text-neon-cyan text-xs font-mono">{s.subject}</td>
                                                    <td className="py-2.5 pr-4 text-slate-300">{s.score}/{s.maxScore}</td>
                                                    <td className="py-2.5 pr-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pct >= 75 ? 'bg-neon-teal/15 text-neon-teal' : pct >= 50 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-neon-pink/15 text-neon-pink'}`}>
                                                            {pct}%
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 pr-4 text-slate-500 font-mono text-xs">{s.date}</td>
                                                    <td className="py-2.5">
                                                        <button onClick={() => { studentDB.deleteScore(s.id); setScores(studentDB.getScores()); }}
                                                            className="text-slate-600 hover:text-neon-pink transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </div>
            </div>

            {/* Add modal */}
            {showAdd && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <form onSubmit={handleAdd} className="w-full max-w-sm rounded-2xl border border-neon-teal/30 bg-cyber-dark p-6 space-y-4 shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                        <h3 className="text-base font-bold text-white">Add Exam Score</h3>
                        {[
                            { label: 'Exam Name', key: 'examName', placeholder: 'Mock Test 3' },
                            { label: 'Subject', key: 'subject', placeholder: 'Physics' },
                            { label: 'Score Obtained', key: 'score', placeholder: '78', type: 'number' },
                            { label: 'Out of (Max)', key: 'maxScore', placeholder: '100', type: 'number' },
                            { label: 'Date', key: 'date', type: 'date' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-xs text-slate-400 font-mono block mb-1">{f.label}</label>
                                <input type={f.type ?? 'text'} value={form[f.key as keyof typeof form]}
                                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal/50" />
                            </div>
                        ))}
                        <div className="flex space-x-3 pt-1">
                            <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-sm font-semibold hover:text-white">Cancel</button>
                            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-teal to-neon-purple text-white text-sm font-bold">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </StudentShell>
    );
}
