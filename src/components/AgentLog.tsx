'use client';

import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThoughtLog } from '@/hooks/useGeminiSession';

export const AgentLog = ({ logs, error, isConnected }: { logs: ThoughtLog[], error: string | null, isConnected: boolean }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="w-1/4 h-full bg-black/80 backdrop-blur-sm p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <Bot className="text-cyan-400" />
                <h2 className="text-lg font-bold text-cyan-400 tracking-wider">Agent Log</h2>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <div ref={scrollRef} className="font-mono text-sm text-green-400 flex-grow overflow-y-auto space-y-2 pr-2">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {logs.map((log, index) => (
                    <p key={index} className="animate-fade-in break-words whitespace-pre-wrap">{`> ${log.text}`}</p>
                ))}
            </div>
        </div>
    );
};
