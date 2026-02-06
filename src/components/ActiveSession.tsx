'use client';

import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { SkeletonOverlay } from '@/components/skeleton-overlay';
import { FormStatus } from '@/hooks/useGeminiSession';

const FACING_MODE_USER = "user";

interface ActiveSessionProps {
    frameInterval: number;
    facingMode: string;
    isConnected: boolean;
    sendFrame: (frame: string) => void;
    latestStatus: FormStatus;
    isProcessing: boolean;
}

export const ActiveSession = ({
    frameInterval,
    facingMode,
    isConnected,
    sendFrame,
    latestStatus,
    isProcessing,
}: ActiveSessionProps) => {
    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected && !isProcessing) {
            interval = setInterval(() => {
                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) {
                    const base64Image = imageSrc.split(',')[1];
                    sendFrame(base64Image);
                }
            }, frameInterval * 1000);
        }
        return () => {
            if(interval) clearInterval(interval);
        }
    }, [isConnected, isProcessing, sendFrame, frameInterval]);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
            <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={facingMode === FACING_MODE_USER}
                videoConstraints={{ facingMode, width: 1920, height: 1080 }}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <SkeletonOverlay status={latestStatus} />
            <div className="absolute inset-0 scanline" />
        </div>
    );
}
