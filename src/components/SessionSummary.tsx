'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface SessionSummaryProps {
    summary: string;
    onClose: () => void;
}

export function SessionSummary({ summary, onClose }: SessionSummaryProps) {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-950/80 animate-fade-in">
            <Card className="max-w-2xl w-full bg-card/80 backdrop-blur-md border-primary/30 shadow-cyan-glow">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Award className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="text-3xl">Session Summary</CardTitle>
                            <CardDescription>Here's a breakdown of your performance.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-48 pr-4">
                        <p className="text-slate-300 leading-relaxed">
                            {summary}
                        </p>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={onClose}
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    >
                        Start New Session
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
