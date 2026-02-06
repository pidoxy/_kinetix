'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, SlidersHorizontal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThoughtLog } from '@/hooks/useGeminiSession';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type AgentLogProps = {
    thoughtLogs: ThoughtLog[],
    speechLogs: ThoughtLog[],
    error: string | null,
    isProcessing: boolean;
};

type ViewMode = 'coach' | 'pro';

export const AgentLog = ({ thoughtLogs, speechLogs, error, isProcessing }: AgentLogProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>('coach');
    const scrollRef = useRef<HTMLDivElement>(null);

    const logsToDisplay = viewMode === 'coach' ? speechLogs : thoughtLogs;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [thoughtLogs, speechLogs, viewMode]);


    return (
        <div className="bg-card/40 backdrop-blur-sm h-full w-full max-w-md flex flex-col p-4">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-400 mb-4">// AGENT LOG</h2>

            <div className="flex items-center justify-center gap-2 mb-4 bg-slate-900/50 p-1 rounded-md">
                <Button
                    size="sm"
                    variant={viewMode === 'coach' ? 'secondary' : 'ghost'}
                    className="flex-1"
                    onClick={() => setViewMode('coach')}
                >
                    <BookOpen className="mr-2 h-4 w-4" /> Coach Log
                </Button>
                <Button
                    size="sm"
                    variant={viewMode === 'pro' ? 'secondary' : 'ghost'}
                    className="flex-1"
                    onClick={() => setViewMode('pro')}
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Pro Log
                </Button>
            </div>
            
            <Separator className="mb-4 bg-white/10" />

            <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 space-y-3 text-sm font-mono">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {logsToDisplay.map((log) => (
                     <p key={log.timestamp} className="animate-fade-in break-words whitespace-pre-wrap opacity-80 hover:opacity-100 transition-opacity">
                        <span className="text-cyan-400/50 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                        <span className={cn(viewMode === 'pro' && 'text-green-400/90')}>{`> ${log.text}`}</span>
                    </p>
                ))}
                 {isProcessing && logsToDisplay.length > 0 && <div className="text-slate-500 animate-pulse pl-24">... analyzing</div>}
            </div>
        </div>
    );
};
