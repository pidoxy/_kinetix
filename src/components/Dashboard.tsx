"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Video, User, Square, Pause, Mic, MicOff, Heart } from 'lucide-react';
import { useGeminiSession } from '@/hooks/useGeminiSession';
import { KinetixLogo } from './k-logo';
import { Timer } from './Timer';

import { ActiveSession } from './ActiveSession';
import { IdleScreen } from './IdleScreen';
import { SessionSummary } from './SessionSummary';
import { AgentLog } from './AgentLog';
import { ActiveMetricsSidebar } from './ActiveMetricsSidebar';
import { StatusBadge } from './StatusBadge';


const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

type SessionState = 'idle' | 'active' | 'generating_summary' | 'summary';

const GeneratingSummaryScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-950/80 animate-fade-in">
        <KinetixLogo className="h-12 w-12 text-primary mb-4" />
        <p className="text-xl text-slate-300 tracking-wider">Generating your session summary...</p>
        <p className="text-slate-500">The AI is analyzing your performance.</p>
    </div>
);


export default function Dashboard() {
    const [sessionState, setSessionState] = useState<SessionState>('idle');
    const [frameInterval, setFrameInterval] = useState(4);
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

    const { 
        isConnected, 
        thoughtLogs, 
        speechLogs,
        error, 
        sendFrame, 
        latestStatus,
        isProcessing, 
        sessionSummary,
        endSession,
        resetSession,
        greenCount,
        yellowCount,
        redCount,
        isMuted,
        setIsMuted,
    } = useGeminiSession();

    useEffect(() => {
        if (sessionSummary && sessionState === 'generating_summary') {
            setSessionState('summary');
        }
    }, [sessionSummary, sessionState]);

    const switchCamera = useCallback(() => {
        setFacingMode(
            (prevState) =>
                prevState === FACING_MODE_USER
                    ? FACING_MODE_ENVIRONMENT
                    : FACING_MODE_USER
        );
    }, []);

    const handleStartSession = () => {
        resetSession();
        setSessionStartTime(Date.now());
        setSessionState('active');
    };

    const handleStopSession = () => {
        setSessionState('generating_summary');
        endSession();
    };

    const handleCloseSummary = () => {
        setSessionState('idle');
        setSessionStartTime(null);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    }

    const isLive = sessionState === 'active' || sessionState === 'generating_summary';

    return (
        <div className="flex flex-col h-screen bg-background text-slate-200 font-sans">
             <header className="flex items-center justify-between p-2 border-b border-border/50 shrink-0">
                <KinetixLogo />
                {sessionState === 'active' && (
                    <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-md text-cyan-400">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        <Timer startTime={sessionStartTime || Date.now()} />
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    {sessionState === 'active' && <StatusBadge status={latestStatus} />}
                    <Button variant="ghost" size="icon"><Settings /></Button>
                    <Button variant="ghost" size="icon"><User /></Button>
                </div>
            </header>
            
            <main className="flex-1 relative overflow-hidden flex items-center justify-center">
                {sessionState === 'idle' && <IdleScreen onStart={handleStartSession} />}
                {sessionState === 'generating_summary' && <GeneratingSummaryScreen />}
                {sessionState === 'summary' && sessionSummary && <SessionSummary summary={sessionSummary} onClose={handleCloseSummary} />}
                
                {sessionState === 'active' && (
                     <div className="w-full h-full flex">
                        <ActiveMetricsSidebar greenCount={greenCount} yellowCount={yellowCount} redCount={redCount} />
                        <ActiveSession 
                            frameInterval={frameInterval}
                            facingMode={facingMode}
                            isConnected={isConnected}
                            sendFrame={sendFrame}
                            latestStatus={latestStatus}
                            isProcessing={isProcessing}
                        />
                        <AgentLog thoughtLogs={thoughtLogs} speechLogs={speechLogs} error={error} isProcessing={isProcessing} />
                    </div>
                )}
            </main>

             {sessionState === 'active' && (
                <footer className="flex items-center justify-between p-2 border-t border-border/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-card px-4 py-2 rounded-md text-center">
                            <p className="text-xs text-slate-400">SESSION ACCURACY</p>
                            <p className="text-lg font-bold text-cyan-400">-%</p>
                        </div>
                         <div className="bg-card px-4 py-2 rounded-md text-center">
                            <p className="text-xs text-slate-400">EST. CALORIES</p>
                            <p className="text-lg font-bold">--</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline"><Pause /></Button>
                        <Button onClick={handleStopSession} variant="destructive" className="font-bold px-6">
                            <Square className="mr-2"/> END SESSION
                        </Button>
                        <Button size="icon" variant="outline" onClick={toggleMute}>
                           {isMuted ? <MicOff /> : <Mic />}
                        </Button>
                    </div>
                     <div className="w-48"></div>
                </footer>
             )}
        </div>
    );
}
