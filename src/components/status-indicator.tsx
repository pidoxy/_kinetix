"use client";

import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

type StatusIndicatorProps = {
  status: "good" | "bad" | "idle";
  isProcessing: boolean;
};

export function StatusIndicator({ status, isProcessing }: StatusIndicatorProps) {
  const statusConfig = {
    idle: {
      bgColor: "bg-muted",
      borderColor: "border-muted-foreground/50",
      text: "IDLE",
      textColor: "text-muted-foreground",
    },
    good: {
      bgColor: "bg-green-500/80",
      borderColor: "border-green-300/80",
      text: "GOOD",
      textColor: "text-white",
    },
    bad: {
      bgColor: "bg-red-500/80",
      borderColor: "border-red-300/80",
      text: "STOP",
      textColor: "text-white",
    },
  };

  const config = statusConfig[status];
  const isBad = status === 'bad';

  return (
    <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        {isProcessing && status !== 'idle' && <Loader className="w-8 h-8 text-cyan-400 animate-spin" />}
        <div
            className={cn(
                "relative flex items-center justify-center w-24 h-24 rounded-full border-4 shadow-2xl transition-all duration-300",
                "backdrop-blur-sm",
                config.borderColor,
                config.bgColor,
                isBad && "animate-pulse"
            )}
        >
            <span
                className={cn(
                "font-bold text-lg tracking-wider",
                config.textColor,
                isBad && "animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                )}
            ></span>
            <span
                 className={cn(
                    "relative inline-flex font-bold text-lg tracking-wider",
                    config.textColor
                )}
            >{config.text}</span>
        </div>
    </div>
  );
}
