'use client';

import React from 'react';
import StudentShell from '@/components/StudentShell';
import { Video, PlayCircle, Clock, BookOpen, Wifi } from 'lucide-react';

const PLACEHOLDER_SUBJECTS = [
    { name: 'Physics', color: 'text-neon-cyan', border: 'border-neon-cyan/20', bg: 'bg-neon-cyan/5' },
    { name: 'Chemistry', color: 'text-neon-teal', border: 'border-neon-teal/20', bg: 'bg-neon-teal/5' },
    { name: 'Mathematics', color: 'text-neon-purple', border: 'border-neon-purple/20', bg: 'bg-neon-purple/5' },
    { name: 'Biology', color: 'text-neon-pink', border: 'border-neon-pink/20', bg: 'bg-neon-pink/5' },
    { name: 'General Knowledge', color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
    { name: 'Previous Year Papers', color: 'text-slate-300', border: 'border-slate-700', bg: 'bg-slate-900/30' },
];

export default function VideosPage() {
    return (
        <StudentShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Educational Videos</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Subject-wise lecture videos for exam preparation</p>
                </div>

                {/* Coming soon banner */}
                <div className="p-6 rounded-2xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/10 to-neon-teal/5 backdrop-blur-md flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-purple to-neon-teal flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-extrabold text-white">Video Library — Coming Soon</h2>
                        <p className="text-sm text-slate-400 mt-1 max-w-xl">
                            Curated lecture videos, concept explainers, and problem-solving walkthroughs for NEET, JEE, CET, and CUET will be added here by your teachers and administrators.
                        </p>
                    </div>
                </div>

                {/* Feature preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: PlayCircle, label: 'Lecture Videos', desc: 'Full chapter-wise lectures from expert educators', color: 'text-red-400' },
                        { icon: Clock, label: 'Quick Revision', desc: '5–10 min concept clips before your exam', color: 'text-neon-cyan' },
                        { icon: BookOpen, label: 'Solved Papers', desc: 'Video solutions for previous year papers', color: 'text-neon-teal' },
                    ].map(f => {
                        const Icon = f.icon;
                        return (
                            <div key={f.label} className="p-4 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md text-center space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto">
                                    <Icon className={`w-5 h-5 ${f.color}`} />
                                </div>
                                <p className="text-sm font-bold text-white">{f.label}</p>
                                <p className="text-xs text-slate-400">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Subject channels */}
                <div>
                    <h2 className="text-sm font-bold text-white mb-4">Upcoming Subject Channels</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PLACEHOLDER_SUBJECTS.map(sub => (
                            <div key={sub.name} className={`p-4 rounded-2xl border ${sub.border} ${sub.bg} backdrop-blur-md`}>
                                <div className="flex items-center justify-between mb-3">
                                    <p className={`text-sm font-bold ${sub.color}`}>{sub.name}</p>
                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800">0 videos</span>
                                </div>
                                <div className="flex items-center space-x-2 text-slate-600">
                                    <Wifi className="w-4 h-4" />
                                    <span className="text-xs">Videos will appear here</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StudentShell>
    );
}
