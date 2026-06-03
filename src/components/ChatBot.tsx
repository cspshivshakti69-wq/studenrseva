'use client';

/**
 * ChatBot.tsx — Kannada Seva AI Assistant
 *
 * Uses puter.js CDN (https://js.puter.com/v2/) for free AI via the "User-Pays" model.
 * Users may be prompted to sign in to Puter on first use — that is expected behaviour.
 * Response shape: puter.ai.chat() returns an object whose .toString() yields the text.
 * For multi-turn we keep a plain conversationHistory array (role/content objects).
 */

import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import {
    MessageCircle, X, Send, Bot, User,
    Loader2, Trash2, Minimize2, Maximize2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface UIMessage extends ChatMessage {
    id: string;
    ts: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Model that works reliably with puter.js CDN
const MODEL = 'claude-3-5-haiku';

const SYSTEM_MSG: ChatMessage = {
    role: 'user',
    content:
        'You are KaSe AI, the assistant for "Kannada Seva" — an AI-powered education analytics dashboard for Karnataka government schools. Help with school enrolment, dropout risk scores, interventions, analytics, and dashboard features. Be concise. Reply in the same language the user writes in.',
};

const SYSTEM_ACK: ChatMessage = {
    role: 'assistant',
    content: 'Understood. I am KaSe AI, ready to assist with Kannada Seva.',
};

const WELCOME: UIMessage = {
    id: 'welcome',
    role: 'assistant',
    content:
        "ನಮಸ್ಕಾರ! I'm KaSe AI. Ask me anything about schools, dropout risks, interventions, or how to use the dashboard. I support English and Kannada. 🙏",
    ts: Date.now(),
};

const SUGGESTIONS = [
    'What is the Early Warning System?',
    'How do I add an intervention?',
    'ಶಾಲೆಯ ಅಪಾಯದ ಸೂಚ್ಯಂಕ ಏನು?',
    'Show high risk schools',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [uiMessages, setUiMessages] = useState<UIMessage[]>([WELCOME]);
    // The actual history we send to puter — starts with system seed
    const historyRef = useRef<ChatMessage[]>([SYSTEM_MSG, SYSTEM_ACK]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [sdkReady, setSdkReady] = useState(false);

    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Poll for window.puter after CDN script loads
    useEffect(() => {
        if (window.puter?.ai) { setSdkReady(true); return; }
        const t = setInterval(() => {
            if (window.puter?.ai) { setSdkReady(true); clearInterval(t); }
        }, 400);
        return () => clearInterval(t);
    }, []);

    // Scroll to bottom
    useEffect(() => {
        if (open && !minimized) endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [uiMessages, open, minimized]);

    // Badge count while closed
    useEffect(() => {
        const last = uiMessages[uiMessages.length - 1];
        if (!open && last?.role === 'assistant' && uiMessages.length > 1) {
            setUnread(n => n + 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uiMessages]);

    const openChat = () => {
        setOpen(true);
        setMinimized(false);
        setUnread(0);
        setTimeout(() => inputRef.current?.focus(), 120);
    };

    const clearChat = () => {
        historyRef.current = [SYSTEM_MSG, SYSTEM_ACK];
        setUiMessages([{ ...WELCOME, id: `w-${Date.now()}`, ts: Date.now() }]);
    };

    // ── Send ──────────────────────────────────────────────────────────────────

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        // Append user message to UI and history
        const userUI: UIMessage = { id: `u-${Date.now()}`, role: 'user', content: text, ts: Date.now() };
        setUiMessages(prev => [...prev, userUI]);
        historyRef.current.push({ role: 'user', content: text });
        setInput('');
        setLoading(true);

        try {
            if (!window.puter?.ai?.chat) {
                throw new Error(
                    'Puter SDK not ready yet. Please wait a moment — it may prompt you to sign in to Puter on first use.'
                );
            }

            // Pass conversation history array + model option (official multi-turn pattern from docs)
            const result = await window.puter.ai.chat(
                [...historyRef.current],
                { model: MODEL }
            );

            // puter.ai.chat result: .toString() gives the text (from SDK source transform)
            // Also handles plain string responses
            let reply = '';
            if (typeof result === 'string') {
                reply = result.trim();
            } else if (typeof result?.message?.content === 'string') {
                reply = result.message.content.trim();
            } else if (result?.message?.content?.[0]?.text) {
                // Claude-style nested array content
                reply = result.message.content[0].text.trim();
            } else {
                reply = String(result).trim();
            }

            if (!reply) reply = 'I received an empty response. Please try again.';

            // Push assistant reply to both history and UI
            historyRef.current.push({ role: 'assistant', content: reply });
            setUiMessages(prev => [
                ...prev,
                { id: `a-${Date.now()}`, role: 'assistant', content: reply, ts: Date.now() },
            ]);
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. If a Puter sign-in window appeared, please complete it and try again.';
            setUiMessages(prev => [
                ...prev,
                { id: `e-${Date.now()}`, role: 'assistant', content: `⚠️ ${msg}`, ts: Date.now() },
            ]);
            // Remove the user message from history since we never got a reply
            historyRef.current.pop();
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 60);
        }
    };

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const fmt = (ts: number) =>
        new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Puter CDN — loads window.puter in the browser */}
            <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />

            {/* ── FAB ── */}
            {!open && (
                <button
                    onClick={openChat}
                    aria-label="Open AI Chat"
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan shadow-[0_0_24px_rgba(168,85,247,0.5)] hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-pink text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background animate-pulse">
                            {unread > 9 ? '9+' : unread}
                        </span>
                    )}
                    <span className="absolute right-16 bg-cyber-dark border border-neon-purple/30 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Ask KaSe AI
                    </span>
                </button>
            )}

            {/* ── Chat Window ── */}
            {open && (
                <div
                    className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-neon-purple/30 bg-cyber-dark/95 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.2)] transition-all duration-300 ${minimized ? 'h-14 w-80' : 'w-[360px] md:w-[420px] h-[580px]'
                        }`}
                    style={{ maxHeight: 'calc(100vh - 3rem)' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white font-mono">KaSe AI</p>
                                <div className="flex items-center space-x-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${sdkReady ? 'bg-neon-teal animate-pulse' : 'bg-yellow-500 animate-pulse'}`} />
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {sdkReady ? 'Claude · Online' : 'Loading SDK…'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button onClick={clearChat} aria-label="Clear" className="p-1.5 rounded-lg text-slate-500 hover:text-neon-pink hover:bg-neon-pink/10 transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setMinimized(v => !v)} aria-label="Minimize" className="p-1.5 rounded-lg text-slate-500 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all">
                                {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => setOpen(false)} aria-label="Close" className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    {!minimized && (
                        <>
                            {/* Notice if SDK not ready */}
                            {!sdkReady && (
                                <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[11px] text-yellow-400 font-mono shrink-0">
                                    Loading Puter AI SDK… On first use, a Puter sign-in window may appear.
                                </div>
                            )}

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                                {uiMessages.map((msg) => (
                                    <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center ${msg.role === 'assistant'
                                            ? 'bg-gradient-to-tr from-neon-purple to-neon-cyan'
                                            : 'bg-slate-800 border border-slate-700'
                                            }`}>
                                            {msg.role === 'assistant'
                                                ? <Bot className="w-3.5 h-3.5 text-white" />
                                                : <User className="w-3.5 h-3.5 text-slate-300" />}
                                        </div>
                                        <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === 'user'
                                                ? 'bg-neon-purple/20 border border-neon-purple/30 text-white rounded-br-sm'
                                                : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-bl-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-slate-600 mt-1 font-mono px-1">{fmt(msg.ts)}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {loading && (
                                    <div className="flex items-end gap-2">
                                        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center shrink-0">
                                            <Bot className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-900/80 border border-slate-800">
                                            <div className="flex space-x-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce [animation-delay:0ms]" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-bounce [animation-delay:150ms]" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-neon-teal animate-bounce [animation-delay:300ms]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={endRef} />
                            </div>

                            {/* Suggestions */}
                            {uiMessages.length === 1 && !loading && (
                                <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                                    {SUGGESTIONS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); inputRef.current?.focus(); }}
                                            className="text-[11px] px-2.5 py-1 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 transition-all truncate max-w-[190px]"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className="px-4 pb-4 pt-2 shrink-0 border-t border-slate-800/60">
                                <div className="flex items-end gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-neon-purple/40 transition-colors">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKey}
                                        rows={1}
                                        placeholder="Ask about schools, risks, or interventions…"
                                        className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none max-h-24 overflow-y-auto leading-relaxed py-0.5"
                                        style={{ minHeight: '24px' }}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={loading || !input.trim()}
                                        aria-label="Send"
                                        className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-cyan flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-glow-purple transition-all active:scale-95"
                                    >
                                        {loading
                                            ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                            : <Send className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-600 mt-1.5 text-center font-mono">
                                    Powered by Puter.js · Claude 3.5 Haiku
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
