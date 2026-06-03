'use client';

import React, { useState } from 'react';
import StudentShell from '@/components/StudentShell';
import { studentDB, CalendarNote } from '@/lib/studentData';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar, BookMarked, AlarmClock, Star } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TYPE_META = {
    exam: { label: 'Exam', color: 'text-neon-pink', bg: 'bg-neon-pink/10', border: 'border-neon-pink/30', dot: 'bg-neon-pink', icon: Star },
    task: { label: 'Task', color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30', dot: 'bg-neon-cyan', icon: BookMarked },
    reminder: { label: 'Reminder', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30', dot: 'bg-neon-purple', icon: AlarmClock },
};

export default function CalendarPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [calNotes, setCalNotes] = useState<CalendarNote[]>(() => studentDB.getCalendarNotes());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ text: '', type: 'task' as CalendarNote['type'] });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
    while (cells.length % 7 !== 0) cells.push(null);

    const toKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const notesFor = (k: string) => calNotes.filter(n => n.date === k);
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
    const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

    const addNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !form.text.trim()) return;
        studentDB.addCalendarNote({ date: selectedDate, text: form.text.trim(), type: form.type, isExamDate: form.type === 'exam' });
        setCalNotes(studentDB.getCalendarNotes());
        setForm({ text: '', type: 'task' });
        setShowForm(false);
    };

    const upcomingExams = calNotes.filter(n => n.type === 'exam' && n.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
    const selectedNotes = selectedDate ? notesFor(selectedDate) : [];

    return (
        <StudentShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Exam Calendar</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Track exam dates and add study tasks to any day</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar grid */}
                    <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-5">
                            <button onClick={prevMonth} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                            <h2 className="text-base font-bold text-white">{MONTHS[month]} {year}</h2>
                            <button onClick={nextMonth} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                        <div className="grid grid-cols-7 mb-2">
                            {DAYS.map(d => <div key={d} className="text-center text-[10px] font-mono text-slate-500 uppercase py-1">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {cells.map((day, idx) => {
                                if (!day) return <div key={`e-${idx}`} />;
                                const key = toKey(day);
                                const dayNotes = notesFor(key);
                                const isToday = key === todayKey;
                                const isSelected = key === selectedDate;
                                const hasExam = dayNotes.some(n => n.type === 'exam');
                                return (
                                    <button key={key} onClick={() => { setSelectedDate(isSelected ? null : key); setShowForm(false); }}
                                        className={`relative aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-xs font-semibold transition-all ${isSelected ? 'bg-neon-purple/20 border border-neon-purple/50 text-white' : isToday ? 'bg-neon-teal/10 border border-neon-teal/30 text-neon-teal' : 'text-slate-300 hover:bg-slate-900/60 hover:text-white border border-transparent'}`}>
                                        <span>{day}</span>
                                        {dayNotes.length > 0 && (
                                            <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                                                {dayNotes.slice(0, 3).map(n => <span key={n.id} className={`w-1.5 h-1.5 rounded-full ${TYPE_META[n.type].dot}`} />)}
                                            </div>
                                        )}
                                        {hasExam && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-slate-800">
                            {Object.entries(TYPE_META).map(([key, m]) => (
                                <div key={key} className="flex items-center space-x-1.5">
                                    <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                                    <span className="text-[10px] text-slate-500 font-mono">{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="space-y-4">
                        {selectedDate ? (
                            <div className="p-5 rounded-2xl border border-neon-purple/20 bg-cyber-card/60 backdrop-blur-md space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-neon-purple" />
                                        <span>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
                                    </h3>
                                    <button onClick={() => setShowForm(!showForm)}
                                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-neon-purple/20 text-neon-purple text-xs font-bold hover:bg-neon-purple/30 transition-all">
                                        <Plus className="w-3.5 h-3.5" /><span>Add</span>
                                    </button>
                                </div>
                                {showForm && (
                                    <form onSubmit={addNote} className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                        <div className="flex gap-2">
                                            {(['task', 'exam', 'reminder'] as const).map(t => {
                                                const m = TYPE_META[t];
                                                return (
                                                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${form.type === t ? `${m.bg} ${m.border} ${m.color}` : 'border-slate-800 text-slate-500 hover:text-white'}`}>
                                                        {m.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <input value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="What's on this day?"
                                            className="w-full bg-transparent border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple/50" />
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white">Cancel</button>
                                            <button type="submit" className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-neon-purple to-neon-teal text-white text-xs font-bold">Save</button>
                                        </div>
                                    </form>
                                )}
                                {selectedNotes.length === 0
                                    ? <p className="text-xs text-slate-500 text-center py-3">No entries. Click Add to create one.</p>
                                    : (
                                        <div className="space-y-2">
                                            {selectedNotes.map(note => {
                                                const m = TYPE_META[note.type];
                                                const Icon = m.icon;
                                                return (
                                                    <div key={note.id} className={`flex items-start justify-between p-3 rounded-xl border ${m.border} ${m.bg}`}>
                                                        <div className="flex items-start space-x-2">
                                                            <Icon className={`w-4 h-4 ${m.color} shrink-0 mt-0.5`} />
                                                            <div>
                                                                <p className={`text-xs font-semibold ${m.color}`}>{m.label}</p>
                                                                <p className="text-xs text-slate-300 mt-0.5">{note.text}</p>
                                                            </div>
                                                        </div>
                                                        {!note.isExamDate && (
                                                            <button onClick={() => { studentDB.deleteCalendarNote(note.id); setCalNotes(studentDB.getCalendarNotes()); }}
                                                                className="text-slate-600 hover:text-neon-pink ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md text-center py-10">
                                <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <p className="text-xs text-slate-500">Click any date to view or add notes</p>
                            </div>
                        )}

                        {/* Upcoming exams */}
                        <div className="p-5 rounded-2xl border border-neon-pink/20 bg-cyber-card/60 backdrop-blur-md space-y-3">
                            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                                <Star className="w-4 h-4 text-neon-pink" /><span>Upcoming Exams</span>
                            </h3>
                            {upcomingExams.length === 0
                                ? <p className="text-xs text-slate-500">No upcoming exams.</p>
                                : (
                                    <div className="space-y-2">
                                        {upcomingExams.map(exam => {
                                            const d = new Date(exam.date + 'T00:00:00');
                                            const diff = Math.ceil((d.getTime() - new Date(todayKey).getTime()) / 86400000);
                                            return (
                                                <div key={exam.id} className="flex items-center justify-between p-2.5 rounded-lg bg-neon-pink/5 border border-neon-pink/20">
                                                    <div>
                                                        <p className="text-xs font-semibold text-white">{exam.text}</p>
                                                        <p className="text-[10px] text-slate-500 font-mono">{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${diff <= 7 ? 'bg-neon-pink/20 text-neon-pink' : 'bg-slate-900 text-slate-400'}`}>
                                                        {diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${diff}d`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </StudentShell>
    );
}
