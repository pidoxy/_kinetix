import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function KinetixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M9 9l3 3 3-3" />
      <path d="M9 15l3-3 3 3" />
      <path d="M12 12V6" />
      <path d="M12 12v6" />
    </svg>
  );
}
