'use client';

import React, { useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, LucideAlertCircle, SlidersHorizontal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThoughtLog } from '@/hooks/useGeminiSession';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

type AgentLogProps = {
    logs: ThoughtLog[],
    error: string | null,
    isProcessing: boolean;
};

const LogIcon = ({ level }: { level: string }) => {
    switch (level) {
        case 'SYSTEM': return <SlidersHorizontal className="h-4 w-4 text-cyan-400" />;
        case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-400" />;
        case 'INFO': return <Info className="h-4 w-4 text-sky-400" />;
        case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
        case 'ALERT': return <LucideAlertCircle className="h-4 w-4 text-red-500" />;
        default: return <Info className="h-4 w-4 text-sky-400" />;
    }
}

const getLogLevel = (text: string): { level: string, message: string, action?: string } => {
    text = text.toLowerCase();
    if (text.includes("user's back is rounding") || text.includes('lumbar curvature') || text.includes('shear force')) {
        return { level: 'ALERT', message: "User's back is rounding...", action: 'Engage core muscles and straighten spine immediately.' };
    }
    if (text.includes('valgus collapse')) {
        return { level: 'WARNING', message: 'Knee valgus detected.' };
    }
    if (text.includes('kinematic alignment optimal')) {
        return { level: 'SUCCESS', message: 'Calibration complete. Tracking active.' };
    }
     if (text.startsWith('connection established')) {
        return { level: 'SYSTEM', message: 'Calibrating skeleton tracking...' };
    }
    if (text.includes('repetition')) {
         return { level: 'INFO', message: text };
    }
    return { level: 'INFO', message: text };
};


export const AgentLog = ({ logs, error, isProcessing }: AgentLogProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);


    return (
        <div className="bg-card/80 backdrop-blur-sm h-full w-full max-w-md flex flex-col p-4">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-400 mb-4">// AGENT LOG</h2>
            <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 space-y-4 text-sm font-mono">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {logs.map((log) => {
                    const { level, message, action } = getLogLevel(log.text);
                    const isAlert = level === 'ALERT';

                    return (
                        <div key={log.timestamp} className={cn('flex items-start gap-3 text-slate-300', isAlert && 'p-3 bg-destructive/20 border border-destructive/50 rounded-md')}>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-xs mt-0.5">[{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                <LogIcon level={level} />
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    level === 'SUCCESS' && 'text-green-400',
                                    level === 'WARNING' && 'text-yellow-400',
                                    level === 'ALERT' && 'text-red-400',
                                    'font-medium'
                                )}>
                                    {message}
                                </p>
                                {action && <p className="text-slate-400 text-xs mt-1">Action: {action}</p>}
                            </div>
                        </div>
                    )
                })}
                 {isProcessing && <div className="text-slate-500 animate-pulse pl-20">... analyzing</div>}
            </div>
        </div>
    );
};
