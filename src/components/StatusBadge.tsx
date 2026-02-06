'use client';

import { cn } from '@/lib/utils';
import { FormStatus } from '@/hooks/useGeminiSession';
import { AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: FormStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status !== 'red') return null;

  return (
    <div
        className={cn(
            "flex items-center justify-center gap-2 h-10 rounded-md border-2 transition-all duration-300",
            "px-4 bg-destructive/80 border-destructive-foreground/30 text-destructive-foreground animate-pulse"
        )}
        >
        <AlertTriangle className="h-5 w-5" />
        <span className="font-bold text-sm tracking-wider">CORRECT FORM</span>
    </div>
  );
};
