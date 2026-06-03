'use client';

import React, { useState, useRef } from 'react';
import StudentShell from '@/components/StudentShell';
import { studentDB, Note } from '@/lib/studentData';
import { Upload, FileText, Trash2, Eye, BookOpen, Search } from 'lucide-react';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General Knowledge', 'Other'];

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>(() => studentDB.getNotes());
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [subject, setSubject] = useState('');
    const [search, setSearch] = useState('');
    const [preview, setPreview] = useState<Note | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || !files.length) return;
        setUploading(true);
        let done = 0;
        Array.from(files).forEach(file => {
            if (file.type !== 'application/pdf') { alert(`${file.name} is not a PDF.`); done++; if (done === files.length) setUploading(false); return; }
            if (file.size > 10 * 1024 * 1024) { alert(`${file.name} exceeds 10 MB.`); done++; if (done === files.length) setUploading(false); return; }
            const reader = new FileReader();
            reader.onload = e => {
                studentDB.addNote({ title: file.name.replace('.pdf', ''), fileName: file.name, fileSize: file.size, uploadedAt: new Date().toISOString(), dataUrl: e.target?.result as string, subject: subject || 'Other' });
                setNotes(studentDB.getNotes());
                done++;
                if (done === files.length) setUploading(false);
            };
            reader.readAsDataURL(file);
        });
    };

    const fmtSize = (b: number) => b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
    const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase()));

    return (
        <StudentShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">My Notes</h1>
                    <p className="text-sm text-slate-400 mt-0.5">Upload and manage your study PDF notes</p>
                </div>

                {/* Upload */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md space-y-4">
                    <h2 className="text-sm font-bold text-white">Upload PDF</h2>
                    <div>
                        <label className="text-xs text-slate-400 font-mono block mb-2">Tag Subject</label>
                        <div className="flex flex-wrap gap-2">
                            {SUBJECTS.map(s => (
                                <button key={s} onClick={() => setSubject(subject === s ? '' : s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${subject === s ? 'bg-neon-purple/20 border-neon-purple/50 text-white' : 'border-slate-800 text-slate-400 hover:text-white'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                        onClick={() => inputRef.current?.click()}
                        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all ${dragOver ? 'border-neon-purple/60 bg-neon-purple/10' : 'border-slate-700 hover:border-neon-purple/40 hover:bg-neon-purple/5'}`}>
                        {uploading
                            ? <div className="w-8 h-8 rounded-full border-2 border-neon-purple border-t-transparent animate-spin" />
                            : <>
                                <Upload className={`w-8 h-8 ${dragOver ? 'text-neon-purple' : 'text-slate-500'}`} />
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-300">Drop PDFs here or click to browse</p>
                                    <p className="text-xs text-slate-500 mt-1">PDF only · Max 10 MB per file</p>
                                </div>
                            </>}
                        <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                    </div>
                </div>

                {/* Notes list */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-cyber-card/60 backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-neon-cyan" /><span>Saved Notes ({filtered.length})</span>
                        </h2>
                        <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-500" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes…"
                                className="bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none w-32" />
                        </div>
                    </div>
                    {filtered.length === 0
                        ? <p className="text-slate-500 text-sm text-center py-8">{notes.length === 0 ? 'No notes yet. Upload a PDF above.' : 'No notes match your search.'}</p>
                        : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filtered.map(note => (
                                    <div key={note.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-neon-purple/30 transition-all">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-neon-pink" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{note.title}</p>
                                                <p className="text-[10px] text-neon-purple font-mono mt-0.5">{note.subject}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{fmtSize(note.fileSize)} · {note.uploadedAt.split('T')[0]}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 mt-3">
                                            <button onClick={() => setPreview(note)}
                                                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg border border-neon-cyan/30 text-neon-cyan text-[11px] font-semibold hover:bg-neon-cyan/10 transition-all">
                                                <Eye className="w-3.5 h-3.5" /><span>View</span>
                                            </button>
                                            <button onClick={() => { studentDB.deleteNote(note.id); setNotes(studentDB.getNotes()); if (preview?.id === note.id) setPreview(null); }}
                                                className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-neon-pink hover:border-neon-pink/30 transition-all">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>

            {preview && (
                <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-cyber-dark border-b border-slate-800">
                        <p className="text-sm font-bold text-white">{preview.title}</p>
                        <button onClick={() => setPreview(null)} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800">Close</button>
                    </div>
                    <div className="flex-1">
                        <iframe src={preview.dataUrl} className="w-full h-full" title={preview.title} />
                    </div>
                </div>
            )}
        </StudentShell>
    );
}
