
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080';

export type ThoughtLog = {
    timestamp: number;
    text: string;
};

export function useGeminiSession() {
    const [isConnected, setIsConnected] = useState(false);
    const [thoughtLogs, setThoughtLogs] = useState<ThoughtLog[]>([]);
    const [error, setError] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);

    const audioQueue = useRef<ArrayBuffer[]>([]);
    const audioContext = useRef<AudioContext | null>(null);
    const isPlaying = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("AudioContext is not supported by this browser.", e);
                setError("AudioContext is not supported by this browser.");
            }
        }

        const socket = new WebSocket(WEBSOCKET_URL);
        ws.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
            setError(null);
        };

        socket.onmessage = async (event) => {
            if (typeof event.data === 'string') {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'THOUGHT') {
                        setThoughtLogs((prevLogs) => [...prevLogs, { timestamp: Date.now(), text: message.data }]);
                    }
                } catch (e) {
                    console.error('Error parsing JSON message:', e);
                }
            } else if (event.data instanceof Blob) {
                const arrayBuffer = await event.data.arrayBuffer();
                audioQueue.current.push(arrayBuffer);
                playAudioFromQueue();
            }
        };

        socket.onerror = (event) => {
            console.error("WebSocket error:", event);
            setError("WebSocket connection failed. Please ensure the backend is running.");
            setIsConnected(false);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            setIsConnected(false);
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
                isPlaying.current = false;
                playAudioFromQueue();
            }
        } else {
            isPlaying.current = false;
        }
    }, []);


    const sendFrame = (base64Image: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'VIDEO_FRAME', data: base64Image }));
        }
    };

    return { isConnected, thoughtLogs, error, sendFrame };
}
