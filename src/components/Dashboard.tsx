"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Video, User, Square, Loader } from 'lucide-react';
import { useGeminiSession } from '@/hooks/useGeminiSession';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

import { ActiveSession } from './ActiveSession';
import { IdleScreen } from './IdleScreen';
import { SessionSummary } from './SessionSummary';

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

type SessionState = 'idle' | 'active' | 'generating_summary' | 'summary';

const LoadingSummary = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-950/80 animate-fade-in">
        <Loader className="w-16 h-16 text-primary animate-spin" />
        <p className="text-xl text-slate-300 tracking-wider">Generating your session summary...</p>
    </div>
);


export default function Dashboard() {
    const [sessionState, setSessionState] = useState<SessionState>('idle');
    const [frameInterval, setFrameInterval] = useState(4);
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

    const { 
        isConnected, 
        thoughtLogs, 
        error, 
        sendFrame, 
        latestStatus, 
        isProcessing, 
        sessionSummary,
        endSession,
        resetSession,
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
        setSessionState('active');
    };

    const handleStopSession = () => {
        setSessionState('generating_summary');
        endSession();
    };

    const handleCloseSummary = () => {
        setSessionState('idle');
    };

    const isLive = sessionState === 'active' || sessionState === 'generating_summary';

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
            <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                <Badge variant={isLive ? "destructive" : "secondary"} className={cn(
                    "text-md transition-all duration-300 border-0",
                    isLive ? "bg-red-500/80 text-white" : "bg-primary/80 text-white",
                )}>
                    <div className={cn("w-2.5 h-2.5 rounded-full mr-2", isLive ? "bg-white animate-pulse" : "bg-white/70")} />
                    SYSTEM {isLive ? "LIVE" : "IDLE"}
                </Badge>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon"><Settings className="text-slate-300" /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Frame Interval</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Set how often to analyze your form (in seconds).
                                    </p>
                                </div>
                                <Slider
                                    id="frame-interval"
                                    defaultValue={[frameInterval]}
                                    max={10}
                                    min={1}
                                    step={1}
                                    onValueChange={(value) => setFrameInterval(value[0])}
                                    disabled={sessionState === 'active'}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Fast (1s)</span>
                                    <span>Slow (10s)</span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" onClick={switchCamera}><Video className="text-slate-300" /></Button>
                    <div className="w-px h-6 bg-white/20 mx-2"></div>
                    <Button variant="ghost" className="rounded-full h-9 w-9 p-0 bg-slate-700">
                        <User className="text-slate-300" />
                    </Button>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden">
                {sessionState === 'idle' && <IdleScreen onStart={handleStartSession} />}
                {sessionState === 'active' && 
                    <ActiveSession 
                        frameInterval={frameInterval}
                        facingMode={facingMode}
                        isConnected={isConnected}
                        thoughtLogs={thoughtLogs}
                        error={error}
                        sendFrame={sendFrame}
                        latestStatus={latestStatus}
                        isProcessing={isProcessing}
                    />
                }
                {sessionState === 'generating_summary' && <LoadingSummary />}
                {sessionState === 'summary' && sessionSummary && <SessionSummary summary={sessionSummary} onClose={handleCloseSummary} />}
            </main>

            <footer className={cn(
                "flex items-center p-4 border-t border-white/10 text-xs text-slate-400 shrink-0",
                 sessionState === 'active' ? "justify-center" : "justify-between"
            )}>
                 {sessionState === 'active' ? (
                    <Button
                        onClick={handleStopSession}
                        size="lg"
                        variant="destructive"
                        className="font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-red-glow transition-all duration-300 disabled:opacity-70"
                        disabled={isProcessing && sessionState !== 'generating_summary'}
                    >
                        <Square className="mr-3" />
                        {sessionState === 'generating_summary' ? 'GENERATING SUMMARY...' : 'STOP SESSION'}
                    </Button>
                ) : (sessionState === 'idle' || sessionState === 'summary') ? (
                    <>
                        <div className="flex items-center gap-4">
                            <span>Kinetix AI v1.0</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="link" className="text-slate-400 hover:text-primary p-0 h-auto">Help Center</Button>
                            <Button variant="link" className="text-slate-400 hover:text-primary p-0 h-auto">Privacy Policy</Button>
                        </div>
                    </>
                ) : null}
            </footer>
        </div>
    );
}
