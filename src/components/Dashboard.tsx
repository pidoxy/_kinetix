"use client";

import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Play, MicOff, CameraReverse, Bot, Square } from 'lucide-react';

const AgentLog = () => {
    const [logs, setLogs] = useState(['AGENT: Standby...', 'AGENT: System Initialized.']);

    return (
        <div className="w-1/4 h-screen bg-black/50 backdrop-blur-md border-l-2 border-cyan-500/30 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Bot className="text-cyan-400" />
                <h2 className="text-lg font-bold text-cyan-400 tracking-wider">Agent Log</h2>
            </div>
            <div className="font-mono text-sm text-green-400 flex-grow overflow-y-auto space-y-2">
                {logs.map((log, index) => (
                    <p key={index} className="animate-fade-in">{`> ${log}`}</p>
                ))}
            </div>
        </div>
    );
};


export default function Dashboard() {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const FACING_MODE_USER = "user";
    const FACING_MODE_ENVIRONMENT = "environment";
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

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
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full bg-transparent"
                />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <Button
                        onClick={toggleSession}
                        variant="outline"
                        className={`rounded-full px-6 py-3 text-lg font-semibold border-2 transition-all duration-300
                            ${isSessionActive
                                ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/40 hover:text-red-300 shadow-lg shadow-red-500/50'
                                : 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/40 hover:text-cyan-300 shadow-lg shadow-cyan-500/50'
                            }`}
                    >
                        {isSessionActive ? <Square className="mr-2" /> : <Play className="mr-2" />}
                        {isSessionActive ? 'Stop Session' : 'Start Session'}
                    </Button>
                    <Button
                        onClick={toggleMute}
                        variant="outline"
                        size="icon"
                        className={`rounded-full w-12 h-12 border-2 transition-all duration-300
                            ${isMuted
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
                        <CameraReverse />
                    </Button>
                </div>
            </div>

            <AgentLog />
        </div>
    );
}
