'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export default function PuterAIChat() {
    const [prompt, setPrompt] = useState(
        'What are the major differences between renewable and non-renewable energy sources?'
    );
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [puterReady, setPuterReady] = useState(false);

    // Confirm puter is available after script loads
    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof window !== 'undefined' && window.puter) {
                setPuterReady(true);
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, []);

    const handleAsk = async () => {
        if (!puterReady || !prompt.trim()) return;
        setLoading(true);
        setResponse('');
        try {
            const result = await window.puter.ai.chat(prompt, {
                model: 'gemini-2.0-flash',
            });
            // Result can be a string or an object with message.content
            if (typeof result === 'string') {
                setResponse(result);
            } else {
                setResponse(result?.message?.content ?? JSON.stringify(result, null, 2));
            }
        } catch (err) {
            setResponse(`Error: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Load puter.js from CDN — this is the browser SDK */}
            <Script
                src="https://js.puter.com/v2/"
                strategy="afterInteractive"
                onLoad={() => setPuterReady(true)}
            />

            <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl border border-neon-cyan/20 bg-cyber-card/60 backdrop-blur-md space-y-4">
                <h2 className="text-lg font-bold text-neon-cyan font-mono tracking-wider">
                    Puter AI Chat
                    {puterReady && (
                        <span className="ml-2 text-xs text-neon-teal">● ready</span>
                    )}
                    {!puterReady && (
                        <span className="ml-2 text-xs text-slate-500">○ loading SDK…</span>
                    )}
                </h2>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 resize-none"
                    placeholder="Ask something…"
                />

                <button
                    onClick={handleAsk}
                    disabled={!puterReady || loading}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-neon-purple to-neon-cyan text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-glow-cyan/30 transition-all"
                >
                    {loading ? 'Thinking…' : 'Ask AI'}
                </button>

                {response && (
                    <div className="mt-2 p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {response}
                    </div>
                )}
            </div>
        </>
    );
}
