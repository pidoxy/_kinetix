"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KinetixLogo } from "@/components/k-logo";
import { BrainCircuit, Play, Square, VideoOff, Loader } from "lucide-react";
import { provideRealTimeFormCorrection } from "@/ai/flows/provide-real-time-form-correction";
import { StatusIndicator } from "@/components/status-indicator";
import { SkeletonOverlay } from "@/components/skeleton-overlay";
import { useToast } from "@/hooks/use-toast";

type FormStatus = "good" | "bad" | "idle";

export default function KinetixPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thoughtSignatures, setThoughtSignatures] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [isCamReady, setIsCamReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    setFormStatus(prev => prev === 'idle' ? 'idle' : 'good'); // Default to good, change if feedback is bad

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setIsProcessing(false);
      return;
    };
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const poseData = canvas.toDataURL("image/jpeg", 0.5);

    try {
      const { thoughtSignature } = await provideRealTimeFormCorrection({
        poseData,
        exerciseName: "squat",
      });
      setThoughtSignatures((prev) => [thoughtSignature, ...prev]);

      if (thoughtSignature.toLowerCase().includes("incorrect") || thoughtSignature.toLowerCase().includes("bad")) {
        setFormStatus("bad");
      } else {
        setFormStatus("good");
      }
    } catch (error) {
      console.error("AI processing failed:", error);
      toast({
        title: "AI Error",
        description: "Could not get feedback from the AI.",
        variant: "destructive",
      });
      setFormStatus("bad");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, toast]);

  const startSession = useCallback(() => {
    if (!isCamReady) {
      toast({
        title: "Camera not ready",
        description: "Please allow camera access and wait for the feed to start.",
        variant: "destructive",
      });
      return;
    }
    setSessionActive(true);
    setFormStatus("good");
    setThoughtSignatures(["Session started. AI is now monitoring your form."]);
    intervalRef.current = setInterval(processFrame, 2000); // Process every 2 seconds
  }, [isCamReady, processFrame, toast]);

  const stopSession = useCallback(() => {
    setSessionActive(false);
    setFormStatus("idle");
    setThoughtSignatures(prev => ["Session stopped.", ...prev]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCamReady(true);
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access in your browser settings to use Kinetix.",
          variant: "destructive",
        });
      }
    }
    setupCamera();

    return () => {
      stopSession();
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [stopSession, toast]);

  return (
    <SidebarProvider>
      <div className="bg-background min-h-screen">
        <Sidebar side="right" collapsible="offcanvas" defaultOpen={true}>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-primary" size={24} />
              <h2 className="text-lg font-semibold text-foreground">The Brain</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              AI thought signatures analyzing your form.
            </p>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col-reverse p-4 gap-4">
                {thoughtSignatures.map((sig, index) => (
                  <div key={index} className="bg-card p-3 rounded-lg shadow-sm text-sm text-card-foreground border border-transparent animate-in fade-in-0 slide-in-from-bottom-2">
                    <p>{sig}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <KinetixLogo className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Kinetix
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {sessionActive ? (
                  <Button onClick={stopSession} variant="destructive">
                    <Square className="mr-2" /> Stop Session
                  </Button>
                ) : (
                  <Button onClick={startSession} disabled={!isCamReady || sessionActive}>
                    <Play className="mr-2" /> Start Session
                  </Button>
                )}
                <SidebarTrigger />
              </div>
            </header>
            <main className="flex-1 relative overflow-hidden bg-foreground/[.02]">
              <div className="absolute inset-0 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              </div>
              
              {!isCamReady && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4 z-20">
                    <VideoOff className="w-16 h-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-lg">Waiting for camera access...</p>
                </div>
              )}
              
              {sessionActive && (
                <>
                  <SkeletonOverlay />
                  <StatusIndicator status={formStatus} isProcessing={isProcessing} />
                </>
              )}
            </main>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
