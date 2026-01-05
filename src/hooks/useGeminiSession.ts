
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws/session';

export type ThoughtLog = {
    timestamp: number;
    text: string;
};

export type FormStatus = "idle" | "good" | "bad";

export function useGeminiSession() {
    const [isConnected, setIsConnected] = useState(false);
    const [thoughtLogs, setThoughtLogs] = useState<ThoughtLog[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [latestStatus, setLatestStatus] = useState<FormStatus>("idle");
    const [isProcessing, setIsProcessing] = useState(false);
    
    const ws = useRef<WebSocket | null>(null);

    const audioQueue = useRef<ArrayBuffer[]>([]);
    const audioContext = useRef<AudioContext | null>(null);
    const isPlaying = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContext.current) {
            try {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("AudioContext is not supported by this browser.", e);
                setError("Audio is not supported by this browser.");
            }
        }

        const socket = new WebSocket(WEBSOCKET_URL);
        ws.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
            setError(null);
            setThoughtLogs([{ timestamp: Date.now(), text: "Connection established. Ready for session." }]);
        };

        socket.onmessage = async (event) => {
            if (typeof event.data === 'string') {
                setIsProcessing(false);
                try {
                    const message = JSON.parse(event.data);
                    
                    if (message.type === 'THOUGHT' && message.data) {
                        setThoughtLogs((prevLogs) => [...prevLogs, { timestamp: Date.now(), text: message.data }]);
                    }
                    
                    if (message.type === 'STATUS' && message.data) {
                        const status = message.data.toLowerCase();
                        if (status === 'green') {
                            setLatestStatus('good');
                        } else if (status === 'red') {
                            setLatestStatus('bad');
                        }
                    }
                    
                    if (message.type === 'SPEECH' && message.data) {
                        const audioData = atob(message.data);
                        const audioBytes = new Uint8Array(audioData.length);
                        for (let i = 0; i < audioData.length; i++) {
                            audioBytes[i] = audioData.charCodeAt(i);
                        }
                        audioQueue.current.push(audioBytes.buffer);
                        playAudioFromQueue();
                    }

                } catch (e) {
                    console.error('Error parsing JSON message:', e);
                    setThoughtLogs((prev) => [...prev, { timestamp: Date.now(), text: `ERROR: Invalid message from server.`}]);
                }
            }
        };

        socket.onerror = (event) => {
            console.error("WebSocket error:", event);
            setError("Connection failed. Is the backend running?");
            setIsConnected(false);
            setThoughtLogs([{ timestamp: Date.now(), text: "Connection failed." }]);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
            setLatestStatus('idle');
            setThoughtLogs((prev) => [...prev, { timestamp: Date.now(), text: "Connection closed."}]);
        };

        return () => {
            socket.close();
        };
    }, []);

    const playAudioFromQueue = useCallback(async () => {
        if (isPlaying.current || audioQueue.current.length === 0 || !audioContext.current) {
            return;
        }

        isPlaying.current = true;
        const audioData = audioQueue.current.shift();

        if (audioData) {
            try {
                // Check if context is suspended and resume it
                if (audioContext.current.state === 'suspended') {
                    await audioContext.current.resume();
                }

                const audioBuffer = await audioContext.current.decodeAudioData(audioData);
                const source = audioContext.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.current.destination);
                source.start();

                source.onended = () => {
                    isPlaying.current = false;
                    playAudioFromQueue();
                };
            } catch (e) {
                console.error("Error decoding or playing audio:", e);
                setError("Failed to play audio feedback.");
                isPlaying.current = false;
                playAudioFromQueue();
            }
        } else {
            isPlaying.current = false;
        }
    }, []);


    const sendFrame = (base64Image: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            setIsProcessing(true);
            ws.current.send(JSON.stringify({ type: 'VIDEO_FRAME', data: base64Image }));
        } else {
            setIsProcessing(false);
        }
    };

    return { isConnected, thoughtLogs, error, sendFrame, latestStatus, isProcessing };
}
