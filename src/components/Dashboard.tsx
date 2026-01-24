"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play, Settings, Video, User, GaugeCircle, Grid3x3, Bot } from 'lucide-react';
import { useGeminiSession, ThoughtLog } from '@/hooks/useGeminiSession';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StatusIndicator } from '@/components/status-indicator';
import { SkeletonOverlay } from '@/components/skeleton-overlay';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { KinetixLogo } from '@/components/k-logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const AgentLog = ({ logs, error, isConnected }: { logs: ThoughtLog[], error: string | null, isConnected: boolean }) => {
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

const IdleScreen = ({ onStart }: { onStart: () => void }) => {
    const bgImage = PlaceHolderImages.find(img => img.id === 'webcam-background');

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {bgImage && (
                 <Image
                    src={bgImage.imageUrl}
                    alt={bgImage.description}
                    fill
                    className="object-cover scale-105"
                    data-ai-hint={bgImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-slate-950/50" />

            <div className="relative flex flex-col items-center justify-center bg-card/60 backdrop-blur-md border border-primary/30 rounded-2xl shadow-cyan-glow p-8 md:p-12 max-w-lg text-center">
                <KinetixLogo className="h-8 w-8 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4">Ready for your session?</h1>
                <p className="text-slate-300 mb-8 max-w-sm">
                    Ensure your full body is visible in the frame and the lighting is clear.
                </p>
                <Button
                    onClick={onStart}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-cyan-glow transition-all duration-300"
                >
                    <Play className="mr-3" />
                    START SESSION
                </Button>
            </div>
        </div>
    );
}

const ActiveSession = ({ frameInterval, facingMode }: { frameInterval: number, facingMode: string }) => {
    const webcamRef = useRef<Webcam>(null);
    const { isConnected, thoughtLogs, error, sendFrame, latestStatus, isProcessing } = useGeminiSession();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            interval = setInterval(() => {
                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) {
                    const base64Image = imageSrc.split(',')[1];
                    sendFrame(base64Image);
                }
            }, frameInterval * 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected, sendFrame, frameInterval]);

    return (
        <div className="flex h-full w-full">
            <div className="relative flex-1">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={facingMode === FACING_MODE_USER}
                    videoConstraints={{ facingMode, width: 1920, height: 1080 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <SkeletonOverlay />
                <StatusIndicator status={latestStatus} isProcessing={isProcessing} />
            </div>
            <AgentLog logs={thoughtLogs} error={error} isConnected={isConnected} />
        </div>
    );
}

export default function Dashboard() {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [latency] = useState(12); // Mock latency
    const [frameInterval, setFrameInterval] = useState(4);
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

    const toggleSession = () => {
        setIsSessionActive(!isSessionActive);
    };
    
    const switchCamera = useCallback(() => {
        setFacingMode(
            (prevState) =>
                prevState === FACING_MODE_USER
                    ? FACING_MODE_ENVIRONMENT
                    : FACING_MODE_USER
        );
    }, []);

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
            <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                <Badge variant={isSessionActive ? "destructive" : "secondary"} className={cn(
                    "text-md transition-all duration-300 border-0",
                    isSessionActive ? "bg-red-500/80 text-white" : "bg-primary/80 text-white",
                )}>
                    <div className={cn("w-2.5 h-2.5 rounded-full mr-2", isSessionActive ? "bg-white" : "bg-white/70")} />
                    SYSTEM {isSessionActive ? "LIVE" : "IDLE"}
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
                {isSessionActive ? <ActiveSession frameInterval={frameInterval} facingMode={facingMode}/> : <IdleScreen onStart={toggleSession} />}
            </main>

            <footer className="flex items-center justify-between p-4 border-t border-white/10 text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Grid3x3 className="h-3.5 w-3.5"/>
                        <span>Calibration: Automatic</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GaugeCircle className="h-3.5 w-3.5"/>
                        <span>Latency: {latency}ms</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="link" className="text-slate-400 hover:text-primary p-0 h-auto">Help Center</Button>
                    <Button variant="link" className="text-slate-400 hover:text-primary p-0 h-auto">Privacy Policy</Button>
                </div>
            </footer>
        </div>
    );
}
