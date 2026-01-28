"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://kinetix-production-31f3.up.railway.app/ws/session';

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
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    const audioQueue = useRef<ArrayBuffer[]>([]);
    const audioContext = useRef<AudioContext | null>(null);
    const isPlaying = useRef(false);

    const connect = useCallback(() => {
        if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
            console.log("WebSocket is already open or connecting.");
            return;
        }

        const socket = new WebSocket(WEBSOCKET_URL);
        ws.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
            setError(null);
            setThoughtLogs([{ timestamp: Date.now(), text: "Connection established. Ready for session." }]);
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };

        socket.onmessage = async (event) => {
            if (typeof event.data === 'string') {
                try {
                    const message = JSON.parse(event.data);
                    
                    if (message.type === 'THOUGHT' && message.data) {
                        setIsProcessing(false);
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
                        try {
                            const audioData = atob(message.data);
                            const audioBytes = new Uint8Array(audioData.length);
                            for (let i = 0; i < audioData.length; i++) {
                                audioBytes[i] = audioData.charCodeAt(i);
                            }
                            audioQueue.current.push(audioBytes.buffer);
                            playAudioFromQueue();
                        } catch (e) {
                            console.error("Failed to decode base64 audio data:", e);
                            setThoughtLogs((prev) => [...prev, { timestamp: Date.now(), text: `ERROR: Could not decode audio.`}]);
                        }
                    }

                } catch (e) {
                    setIsProcessing(false);
                    console.error('Error parsing JSON message:', e);
                    setThoughtLogs((prev) => [...prev, { timestamp: Date.now(), text: `ERROR: Invalid message from server.`}]);
                }
            }
        };

        socket.onerror = (event) => {
            console.error(`WebSocket error attempting to connect to: ${WEBSOCKET_URL}`);
            setError(`Connection failed. Check if the backend is running at ${WEBSOCKET_URL}.`);
            setIsConnected(false);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
            if(navigator.onLine) {
                setThoughtLogs((prev) => [...prev, { timestamp: Date.now(), text: "Connection lost. Attempting to reconnect in 5 seconds..."}]);
                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current);
                }
                reconnectTimeout.current = setTimeout(connect, 5000);
            } else {
                 setThoughtLogs((prev) => [...prev, { timestamp: Date.now(), text: "Connection lost. Please check your internet connection."}]);
            }
        };

    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && !audioContext.current) {
            try {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("AudioContext is not supported by this browser.", e);
                setError("Audio is not supported by this browser.");
            }
        }
        
        connect();

        return () => {
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (ws.current) {
                ws.current.onclose = null; 
                ws.current.close();
            }
        };
    }, [connect]);


    const playAudioFromQueue = useCallback(async () => {
        if (isPlaying.current || audioQueue.current.length === 0 || !audioContext.current) {
            return;
        }

        isPlaying.current = true;
        const audioData = audioQueue.current.shift();

        if (audioData) {
            try {
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
