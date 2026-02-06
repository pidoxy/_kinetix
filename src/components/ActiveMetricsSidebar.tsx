'use client';

import { AlertTriangle, CheckCircle, Percent, MessageSquareWarning } from "lucide-react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

const MetricCard = ({ title, value, unit, status, progress, children, icon: Icon }: { title: string, value: string, unit?: string, status: 'critical' | 'optimal' | 'default', progress?: number, children?: React.ReactNode, icon?: React.ElementType }) => {
    const isCritical = status === 'critical';
    return (
        <div className={cn(
            "bg-card/80 border rounded-md p-3",
            isCritical ? "border-destructive/80" : "border-border"
        )}>
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold tracking-wider text-slate-300">{title}</p>
                {Icon && <Icon className={cn("h-4 w-4", isCritical ? 'text-destructive' : 'text-slate-400')} />}
            </div>
            <div className="flex items-end gap-1">
                <p className="text-4xl font-bold">{value}</p>
                {unit && <p className="text-lg text-slate-400 mb-1">{unit}</p>}
            </div>
            {progress !== undefined && <Progress value={progress} className={cn("h-1 mt-2", isCritical ? "[&>div]:bg-destructive" : "[&>div]:bg-cyan-400")} />}
            {children}
        </div>
    )
}

interface ActiveMetricsSidebarProps {
    greenCount: number;
    yellowCount: number;
    redCount: number;
}


export const ActiveMetricsSidebar = ({ greenCount, yellowCount, redCount }: ActiveMetricsSidebarProps) => {

    const totalFrames = greenCount + yellowCount + redCount;
    const formScore = totalFrames > 0 ? (greenCount / totalFrames) * 100 : 0;
    const corrections = yellowCount + redCount;

    let scoreStatus: 'critical' | 'optimal' | 'default' = 'optimal';
    if (formScore < 75 && totalFrames > 10) scoreStatus = 'default';
    if (formScore < 50 && totalFrames > 10) scoreStatus = 'critical';

    return (
        <div className="bg-card/40 backdrop-blur-sm h-full w-full max-w-xs flex flex-col p-4 gap-4">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-400">// LIVE STATS</h2>
            
            <div className="space-y-4">
                <MetricCard 
                    title="FORM SCORE"
                    value={formScore.toFixed(0)}
                    unit="%"
                    status={scoreStatus}
                    progress={formScore}
                    icon={Percent}
                />
                <MetricCard 
                    title="GOOD FRAMES"
                    value={greenCount.toString()}
                    status={'optimal'}
                    icon={CheckCircle}
                />
                <MetricCard 
                    title="CORRECTIONS"
                    value={corrections.toString()}
                    status={redCount > 5 ? 'critical' : 'default'}
                    icon={MessageSquareWarning}
                />
            </div>
        </div>
    )
}
