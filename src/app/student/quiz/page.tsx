'use client';

import React, { useState, useEffect, useRef } from 'react';
import StudentShell from '@/components/StudentShell';
import { QUIZ_QUESTIONS, QuizQuestion, studentDB } from '@/lib/studentData';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Play, Clock, ChevronRight } from 'lucide-react';

type Subject = 'All' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'General Knowledge';
type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';
type Phase = 'setup' | 'quiz' | 'result';

const SUBJECTS: Subject[] = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'General Knowledge'];
const DIFFS: Difficulty[] = ['All', 'Easy', 'Medium', 'Hard'];

export default function QuizPage() {
    const [phase, setPhase] = useState<Phase>('setup');
    const [subject, setSubject] = useState<Subject>('All');
    const [difficulty, setDifficulty] = useState<Difficulty>('All');
    const [qCount, setQCount] = useState(10);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [showExplain, setShowExplain] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [attempts, setAttempts] = useState(() => studentDB.getAttempts());

    useEffect(() => {
        if (phase === 'quiz') {
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase]);

    const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const startQuiz = () => {
        let pool = QUIZ_QUESTIONS;
        if (subject !== 'All') pool = pool.filter(q => q.subject === subject);
        if (difficulty !== 'All') pool = pool.filter(q => q.difficulty === difficulty);
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(qCount, pool.length));
        if (!shuffled.length) return;
        setQuestions(shuffled);
        setAnswers(new Array(shuffled.length).fill(null));
        setCurrent(0); setSelected(null); setShowExplain(false); setElapsed(0);
        setPhase('quiz');
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx); setShowExplain(true);
        const a = [...answers]; a[current] = idx; setAnswers(a);
    };

    const next = () => {
        if (current + 1 < questions.length) {
            setCurrent(c => c + 1); setSelected(null); setShowExplain(false);
        } else {
            const correct = answers.filter((a, i) => a === questions[i].correctIndex).length;
            studentDB.addAttempt({ subject: subject === 'All' ? 'Mixed' : subject, date: new Date().toISOString().split('T')[0], totalQuestions: questions.length, correctAnswers: correct, timeTaken: elapsed });
            setAttempts(studentDB.getAttempts());
            setPhase('result');
        }
    };

    const correct = answers.filter((a, i) => a !== null && a === questions[i]?.correctIndex).length;
    const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;

    if (phase === 'setup') return (
        <StudentShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Mock Quiz Arena</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Practice competitive exam questions across 5 subjects</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md space-y-5">
                        <h2 className="text-sm font-bold text-white">Configure Quiz</h2>
                        <div>
                            <label className="text-xs text-slate-400 font-mono block mb-2">Subject</label>
                            <div className="flex flex-wrap gap-2">
                                {SUBJECTS.map(s => (
                                    <button key={s} onClick={() => setSubject(s)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${subject === s ? 'bg-neon-purple/20 border-neon-purple/50 text-white' : 'border-slate-800 text-slate-400 hover:text-white'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-mono block mb-2">Difficulty</label>
                            <div className="flex gap-2">
                                {DIFFS.map(d => (
                                    <button key={d} onClick={() => setDifficulty(d)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${difficulty === d ? 'bg-neon-teal/20 border-neon-teal/50 text-white' : 'border-slate-800 text-slate-400 hover:text-white'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-mono block mb-2">Questions: {qCount}</label>
                            <input type="range" min={5} max={40} step={5} value={qCount} onChange={e => setQCount(Number(e.target.value))} className="w-full accent-neon-purple" />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1"><span>5</span><span>40</span></div>
                        </div>
                        <button onClick={startQuiz}
                            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-teal text-white font-bold text-sm hover:shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all">
                            <Play className="w-4 h-4" /><span>Start Quiz</span>
                        </button>
                    </div>
                    <div className="p-6 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md space-y-3">
                        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                            <Trophy className="w-4 h-4 text-yellow-400" /><span>Past Attempts</span>
                        </h2>
                        {attempts.length === 0
                            ? <p className="text-slate-500 text-xs py-6 text-center">No attempts yet. Start your first quiz!</p>
                            : (
                                <div className="space-y-2 max-h-72 overflow-y-auto">
                                    {[...attempts].reverse().slice(0, 10).map(a => {
                                        const pct = Math.round((a.correctAnswers / a.totalQuestions) * 100);
                                        return (
                                            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                                                <div>
                                                    <p className="text-xs font-semibold text-white">{a.subject}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{a.date} · {fmt(a.timeTaken)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-bold font-mono ${pct >= 75 ? 'text-neon-teal' : pct >= 50 ? 'text-yellow-400' : 'text-neon-pink'}`}>{pct}%</p>
                                                    <p className="text-[10px] text-slate-500">{a.correctAnswers}/{a.totalQuestions}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </StudentShell>
    );

    if (phase === 'quiz') {
        const q = questions[current];
        return (
            <StudentShell>
                <div className="space-y-5 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono text-slate-400">Q {current + 1}/{questions.length}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${q.difficulty === 'Easy' ? 'border-neon-teal/30 text-neon-teal bg-neon-teal/10' : q.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-neon-pink/30 text-neon-pink bg-neon-pink/10'}`}>
                                {q.difficulty}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-sm">
                            <Clock className="w-4 h-4" /><span>{fmt(elapsed)}</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-neon-purple to-neon-teal h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
                    </div>
                    <div className="p-5 rounded-2xl border border-neon-purple/20 bg-cyber-card/60 backdrop-blur-md">
                        <p className="text-[10px] font-mono text-neon-purple uppercase tracking-widest mb-3">{q.subject}</p>
                        <p className="text-base font-semibold text-white leading-relaxed">{q.question}</p>
                    </div>
                    <div className="space-y-3">
                        {q.options.map((opt, i) => {
                            const isSelected = selected === i;
                            const isCorrect = i === q.correctIndex;
                            let style = 'border-slate-800 text-slate-300 hover:border-neon-purple/40 hover:text-white';
                            if (selected !== null) {
                                if (isCorrect) style = 'border-neon-teal/60 bg-neon-teal/10 text-neon-teal';
                                else if (isSelected) style = 'border-neon-pink/60 bg-neon-pink/10 text-neon-pink';
                                else style = 'border-slate-800 text-slate-500 opacity-60';
                            }
                            return (
                                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl border text-sm font-medium text-left transition-all ${style} disabled:cursor-default`}>
                                    <span className={`w-6 h-6 rounded-md border text-xs font-bold flex items-center justify-center shrink-0 ${isSelected || (selected !== null && isCorrect) ? 'border-current' : 'border-slate-700'}`}>
                                        {['A', 'B', 'C', 'D'][i]}
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                    {selected !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-neon-teal shrink-0" />}
                                    {selected !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-neon-pink shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                    {showExplain && (
                        <div className="p-4 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 text-sm text-slate-200">
                            <span className="font-bold text-neon-cyan font-mono">EXPLANATION: </span>{q.explanation}
                        </div>
                    )}
                    {selected !== null && (
                        <button onClick={next}
                            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-teal text-white font-bold text-sm hover:shadow-[0_0_16px_rgba(168,85,247,0.3)] transition-all">
                            <span>{current + 1 < questions.length ? 'Next Question' : 'See Results'}</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </StudentShell>
        );
    }

    return (
        <StudentShell>
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="p-6 rounded-2xl border border-neon-purple/20 bg-cyber-card/60 backdrop-blur-md text-center space-y-4">
                    <Trophy className={`w-12 h-12 mx-auto ${score >= 75 ? 'text-yellow-400' : score >= 50 ? 'text-neon-teal' : 'text-slate-400'}`} />
                    <h1 className="text-3xl font-extrabold font-mono text-white">{score}%</h1>
                    <p className="text-slate-400">{correct}/{questions.length} correct · {fmt(elapsed)}</p>
                    <p className={`text-sm font-semibold ${score >= 75 ? 'text-neon-teal' : score >= 50 ? 'text-yellow-400' : 'text-neon-pink'}`}>
                        {score >= 75 ? 'Excellent! 🎉' : score >= 50 ? 'Good effort! Keep going 💪' : 'Keep trying — every attempt counts 🌟'}
                    </p>
                    <button onClick={() => setPhase('setup')}
                        className="flex items-center space-x-2 mx-auto px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-teal text-white font-bold text-sm hover:shadow-[0_0_16px_rgba(168,85,247,0.3)] transition-all">
                        <RotateCcw className="w-4 h-4" /><span>Try Another Quiz</span>
                    </button>
                </div>
                <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md space-y-3">
                    <h2 className="text-sm font-bold text-white">Answer Review</h2>
                    {questions.map((q, i) => {
                        const isCorrect = answers[i] === q.correctIndex;
                        return (
                            <div key={q.id} className={`p-3 rounded-xl border text-sm ${isCorrect ? 'border-neon-teal/20 bg-neon-teal/5' : 'border-neon-pink/20 bg-neon-pink/5'}`}>
                                <div className="flex items-start space-x-2">
                                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-neon-teal shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-neon-pink shrink-0 mt-0.5" />}
                                    <div>
                                        <p className="text-slate-200 text-xs">{q.question}</p>
                                        {!isCorrect && <p className="text-neon-teal text-[11px] mt-1">Correct: {q.options[q.correctIndex]}</p>}
                                        <p className="text-slate-500 text-[11px] mt-1 italic">{q.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </StudentShell>
    );
}
