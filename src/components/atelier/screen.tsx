import type { ReactNode } from "react";
import { Squiggle } from "./decor";
import { cn } from "@/lib/utils";

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-background">
      <div className={cn("safe-bottom px-4 pt-6", className)}>{children}</div>
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mt-7 mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate font-display text-xl font-semibold text-ink">{title}</h2>
        <Squiggle className="mt-1 h-2 w-20" />
      </div>
      {action}
    </div>
  );
}
