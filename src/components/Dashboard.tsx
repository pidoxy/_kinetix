"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Play, MicOff, RefreshCw, Bot, Square, Radio, Settings } from 'lucide-react';
import { useGeminiSession, ThoughtLog } from '@/hooks/useGeminiSession';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StatusIndicator } from '@/components/status-indicator';
import { SkeletonOverlay } from '@/components/skeleton-overlay';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const AgentLog = ({ logs, error, isConnected }: { logs: ThoughtLog[], error: string | null, isConnected: boolean }) => {

    return (
        <div className="w-1/4 h-screen bg-black/80 backdrop-blur-md border-l-2 border-cyan-500/30 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Bot className="text-cyan-400" />
                <h2 className="text-lg font-bold text-cyan-400 tracking-wider">Agent Log</h2>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <div className="font-mono text-sm text-green-400 flex-grow overflow-y-auto space-y-2">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Connection Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {logs.map((log, index) => (
                    <p key={index} className="animate-fade-in">{`> ${log.text}`}</p>
                ))}
                 <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
        </div>
    );
};


export default function Dashboard() {
    const webcamRef = useRef<Webcam>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [frameInterval, setFrameInterval] = useState(4); // Default to 4 seconds
    
    const { isConnected, thoughtLogs, error, sendFrame, latestStatus, isProcessing } = useGeminiSession();

    const FACING_MODE_USER = "user";
    const FACING_MODE_ENVIRONMENT = "environment";
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSessionActive && isConnected) {
            interval = setInterval(() => {
                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) {
                    const base64Image = imageSrc.split(',')[1];
                    sendFrame(base64Image);
                }
            }, frameInterval * 1000); // Use the state for interval
        }
        return () => clearInterval(interval);
    }, [isSessionActive, isConnected, sendFrame, frameInterval]);

    const switchCamera = useCallback(() => {
        setFacingMode(
            (prevState) =>
                prevState === FACING_MODE_USER
                    ? FACING_MODE_ENVIRONMENT
                    : FACING_MODE_USER
        );
    }, []);

    const toggleSession = () => {
        setIsSessionActive(!isSessionActive);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };


    return (
        <div className="flex h-screen bg-slate-900 text-slate-100">
            <div className="relative w-3/4 h-screen">
                <Webcam
                    ref={webcamRef}
                    audio={!isMuted}
                    mirrored={facingMode === FACING_MODE_USER}
                    videoConstraints={{ facingMode }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {isSessionActive && <SkeletonOverlay />}
                
                <div className='absolute top-6 left-6 z-20'>
                    <Badge variant={isSessionActive ? "destructive" : "secondary"} className={cn(
                        "text-lg transition-all duration-300",
                        isSessionActive && "animate-pulse"
                    )}>
                        <Radio className={cn("mr-2 h-4 w-4", isSessionActive && "text-red-400")} />
                        {isSessionActive ? "LIVE" : "IDLE"}
                    </Badge>
                </div>

                {isSessionActive && <StatusIndicator status={latestStatus} isProcessing={isProcessing} />}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <Button
                        onClick={toggleSession}
                        variant="outline"
                        disabled={!isConnected}
                        className={`rounded-full px-6 py-3 text-lg font-semibold border-2 transition-all duration-300
                            ${isSessionActive
                                ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/40 hover:text-red-300 shadow-lg shadow-red-500/50'
                                : 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/40 hover:text-cyan-300 shadow-lg shadow-cyan-500/50'
                            }
                            disabled:bg-slate-700/50 disabled:border-slate-600 disabled:text-slate-500 disabled:shadow-none`}
                    >
                        {isSessionActive ? <Square className="mr-2" /> : <Play className="mr-2" />}
                        {isSessionActive ? 'Stop Session' : 'Start Session'}
                    </Button>
                    <Button
                        onClick={toggleMute}
                        variant="outline"
                        size="icon"
                        className={`rounded-full w-12 h-12 border-2 transition-all duration-300
                            ${!isMuted
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/40'
                                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <MicOff />
                    </Button>
                    <Button
                        onClick={switchCamera}
                        variant="outline"
                        size="icon"
                        className="rounded-full w-12 h-12 border-2 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-300"
                    >
                        <RefreshCw />
                    </Button>

                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-12 h-12 border-2 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-300"
                            >
                                <Settings />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-slate-800 border-slate-700 text-slate-200">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Settings</h4>
                                    <p className="text-sm text-slate-400">
                                        Adjust session parameters.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="frame-interval">Frame Interval ({frameInterval}s)</Label>
                                    <Slider
                                        id="frame-interval"
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[frameInterval]}
                                        onValueChange={(value) => setFrameInterval(value[0])}
                                    />
                                    <p className="text-xs text-slate-500">
                                        Lower values send data more often but use more API quota.
                                    </p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>

            <AgentLog logs={thoughtLogs} error={error} isConnected={isConnected} />
        </div>
    );
}
