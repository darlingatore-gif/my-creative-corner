import type { CSSProperties } from "react";
import { paletteCss, type CoverStyle, type Notebook, type Palette } from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

export function Tape({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-6 w-20 rounded-[2px] opacity-70 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className,
      )}
      style={{
        background:
          "repeating-linear-gradient(135deg, oklch(0.93 0.03 320 / 0.75) 0 6px, oklch(0.96 0.02 320 / 0.6) 6px 12px)",
        ...style,
      }}
    />
  );
}

export function Paperclip({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 48"
      className={cn("pointer-events-none absolute h-10 w-5 text-gold", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M16 6v28a5 5 0 0 1-10 0V8a3.2 3.2 0 0 1 6.4 0v25" />
    </svg>
  );
}

export function Flower({ className, tone = "rose" }: { className?: string; tone?: Palette }) {
  const c = paletteCss[tone].deep;
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={cn("pointer-events-none absolute", className)}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="20" cy="11" rx="5.2" ry="8.5" fill={c} opacity="0.35" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4" fill="oklch(0.79 0.1 85)" opacity="0.85" />
    </svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 12" className={cn("pointer-events-none", className)} fill="none">
      <path
        d="M2 8C14 2 22 10 34 6s20-8 32-2 20 8 32 4"
        stroke="oklch(0.79 0.1 85)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const alpha = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, transparent)`;

export function coverBackground(palette: Palette, cover: CoverStyle): CSSProperties {
  const { bg, deep } = paletteCss[palette];
  const a = (pct: number) => alpha(deep, pct);
  const base: CSSProperties = { backgroundColor: bg };
  switch (cover) {
    case "rayures":
      return {
        ...base,
        backgroundImage: `repeating-linear-gradient(115deg, ${a(24)} 0 8px, transparent 8px 20px)`,
      };
    case "pois":
      return {
        ...base,
        backgroundImage: `radial-gradient(${a(32)} 1.8px, transparent 2px)`,
        backgroundSize: "16px 16px",
      };
    case "quadrille":
      return {
        ...base,
        backgroundImage: `linear-gradient(${a(20)} 1px, transparent 1px), linear-gradient(90deg, ${a(20)} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
      };
    case "degrade":
      return {
        backgroundImage: `linear-gradient(160deg, ${bg}, oklch(0.97 0.02 80) 55%, ${a(34)})`,
      };
    case "fleurs":
      return {
        ...base,
        backgroundImage: `radial-gradient(circle at 22% 28%, ${a(32)} 0 9%, transparent 10%), radial-gradient(circle at 70% 62%, oklch(0.79 0.1 85 / 0.35) 0 7%, transparent 8%), radial-gradient(circle at 84% 18%, ${a(26)} 0 6%, transparent 7%)`,
      };
    default:
      return base;
  }
}

export function NotebookCover({
  notebook,
  className,
  ratio = "aspect-[3/4]",
}: {
  notebook: Notebook;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "paper-soft relative w-full overflow-hidden rounded-2xl shadow-paper ring-1 ring-border/70",
        ratio,
        className,
      )}
      style={coverBackground(notebook.palette, notebook.cover)}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/10 to-transparent"
      />
      <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3" />
      <div className="absolute inset-x-3 bottom-3 rounded-xl bg-card/80 px-3 py-2 backdrop-blur-[2px]">
        <p className="font-display text-[15px] leading-tight font-semibold text-ink">{notebook.title}</p>
        <p className="mt-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
          {notebook.pages.length} page{notebook.pages.length > 1 ? "s" : ""} · {notebook.category}
        </p>
      </div>
      <span className="absolute top-3 right-3 text-lg">{notebook.emoji}</span>
    </div>
  );
}
