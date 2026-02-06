import { cn } from "@/lib/utils";
import type { SVGProps } from "react";
import { Activity } from 'lucide-react';


export function KinetixLogo({ className, ...props }: SVGProps<SVGSVGElement> & {className?: string}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <div className="p-1.5 bg-cyan-400/20 rounded-md">
            <Activity className="h-5 w-5 text-cyan-400" {...props} />
        </div>
        <span className="font-bold tracking-widest text-md text-slate-200">KINETIX</span>
    </div>
  );
}
