'use client';

import { AlertTriangle, Heart, RefreshCw } from "lucide-react";
import { FormStatus } from "@/hooks/useGeminiSession";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";

const MetricCard = ({ title, value, unit, status, progress, children }: { title: string, value: string, unit?: string, status: 'critical' | 'optimal' | 'default', progress?: number, children?: React.ReactNode }) => {
    const isCritical = status === 'critical';
    return (
        <div className={cn(
            "bg-card/80 border rounded-md p-3",
            isCritical ? "border-destructive/80" : "border-border"
        )}>
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold tracking-wider text-slate-300">{title}</p>
                {isCritical && <AlertTriangle className="h-4 w-4 text-destructive" />}
            </div>
            <div className="flex items-end gap-1">
                <p className="text-4xl font-bold">{value}</p>
                {unit && <p className="text-lg text-slate-400 mb-1">{unit}</p>}
            </div>
            <div className="flex items-center gap-2 mt-2">
                 <p className={cn("text-xs font-bold", isCritical ? "text-destructive" : "text-cyan-400")}>{status.toUpperCase()}</p>
            </div>
            {progress !== undefined && <Progress value={progress} className={cn("h-1 mt-2", isCritical ? "[&>div]:bg-destructive" : "[&>div]:bg-cyan-400")} />}
            {children}
        </div>
    )
}

export const ActiveMetricsSidebar = ({ status }: { status: FormStatus }) => {

    const isSpineCritical = status === 'red';
    const isKneeOptimal = status === 'green' || status === 'yellow';

    return (
        <div className="bg-card/40 backdrop-blur-sm h-full w-full max-w-xs flex flex-col p-4 gap-4">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-slate-400">// ACTIVE METRICS</h2>
            
            <div className="space-y-4">
                <MetricCard 
                    title="SPINE CURVATURE"
                    value={isSpineCritical ? "15" : "5"}
                    unit="°"
                    status={isSpineCritical ? 'critical' : 'optimal'}
                    progress={isSpineCritical ? 80 : 20}
                />
                <MetricCard 
                    title="KNEE ANGLE"
                    value={isKneeOptimal ? "110" : "100"}
                    unit="°"
                    status={'optimal'}
                    progress={75}
                />
                <MetricCard 
                    title="REPETITIONS"
                    value="4"
                    unit="/ 12"
                    status="default"
                >
                    <div className="flex justify-end mt-2">
                        <RefreshCw className="h-4 w-4 text-slate-500" />
                    </div>
                </MetricCard>
            </div>
            
            <div className="mt-auto space-y-4">
                 <div className="bg-card/80 border rounded-md p-3 border-border">
                    <div className="flex items-center gap-2 mb-1">
                        <Heart className="h-4 w-4 text-slate-400" />
                        <p className="text-sm font-semibold tracking-wider text-slate-300">HEART RATE</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">112</p>
                        <p className="text-sm text-slate-400">BPM</p>
                    </div>
                    {/* Placeholder for chart */}
                    <div className="h-8 mt-2 w-full bg-slate-800 rounded-sm" />
                </div>
            </div>
        </div>
    )
}
