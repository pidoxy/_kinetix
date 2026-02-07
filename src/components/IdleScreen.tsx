'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play, Activity } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const IdleScreen = ({ onStart }: { onStart: () => void }) => {
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
                <div className="p-3 bg-cyan-400/20 rounded-lg mb-4">
                    <Activity className="h-12 w-12 text-cyan-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-slate-100 mb-2">KINETIX</h1>
                <p className="text-lg text-slate-300 mb-8 max-w-sm">
                   Your AI personal trainer for perfect form.
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
