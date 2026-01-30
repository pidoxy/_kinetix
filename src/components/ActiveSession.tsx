'use client';

import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { SkeletonOverlay } from '@/components/skeleton-overlay';
import { StatusIndicator } from '@/components/status-indicator';
import { AgentLog } from '@/components/AgentLog';
import { ThoughtLog, FormStatus } from '@/hooks/useGeminiSession';

const FACING_MODE_USER = "user";

interface ActiveSessionProps {
    frameInterval: number;
    facingMode: string;
    isConnected: boolean;
    thoughtLogs: ThoughtLog[];
    error: string | null;
    sendFrame: (frame: string) => void;
    latestStatus: FormStatus;
    isProcessing: boolean;
}

export const ActiveSession = ({
    frameInterval,
    facingMode,
    isConnected,
    thoughtLogs,
    error,
    sendFrame,
    latestStatus,
    isProcessing,
}: ActiveSessionProps) => {
    const webcamRef = useRef<Webcam>(null);

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
