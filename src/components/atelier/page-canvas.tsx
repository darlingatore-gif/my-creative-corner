import type { CSSProperties } from "react";
import { Link2, Play } from "lucide-react";
import { paletteCss, type NotebookPage, type PageElement } from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

export function pageBackground(bg: NotebookPage["background"]): CSSProperties {
  if (bg === "papier") {
    return {
      backgroundColor: "oklch(0.985 0.012 85)",
      backgroundImage:
        "linear-gradient(oklch(0.72 0.09 12 / 0.12) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.09 12 / 0.06) 1px, transparent 1px)",
      backgroundSize: "100% 26px, 26px 100%",
    };
  }
  return { backgroundColor: paletteCss[bg].bg };
}

export function ElementView({ element, compact }: { element: PageElement; compact?: boolean | undefined }) {
  const tone = element.color ? paletteCss[element.color] : paletteCss.rose;
  switch (element.kind) {
    case "texte":
      return (
        <p className={cn("font-display leading-tight font-semibold text-ink", compact ? "text-[7px]" : "text-2xl")}>
          {element.content}
        </p>
      );
    case "note":
      return (
        <div
          className={cn("rounded-xl px-3 py-2 shadow-paper", compact && "px-1 py-0.5")}
          style={{ backgroundColor: tone.bg }}
        >
          <p className={cn("font-hand text-ink", compact ? "text-[6px] leading-tight" : "text-lg leading-snug")}>
            {element.content}
          </p>
        </div>
      );
    case "photo":
      return (
        <div
          className={cn(
            "flex aspect-[4/3] items-end rounded-md bg-card p-1.5 shadow-paper ring-1 ring-border/60",
            compact && "p-0.5",
          )}
        >
          <div
            className="flex h-full w-full items-end rounded-sm p-1.5"
            style={{
              backgroundImage:
                "linear-gradient(150deg, oklch(0.9 0.05 15), oklch(0.87 0.055 315) 60%, oklch(0.89 0.07 88))",
            }}
          >
            {!compact && <span className="font-hand text-sm text-ink/80">{element.content}</span>}
          </div>
        </div>
      );
    case "video":
      return (
        <div
          className={cn(
            "relative flex aspect-video items-center justify-center rounded-xl bg-ink/85 shadow-paper",
            compact && "rounded-sm",
          )}
        >
          <Play className={cn("text-cream", compact ? "h-2 w-2" : "h-7 w-7")} fill="currentColor" />
          {!compact && (
            <span className="absolute bottom-1.5 left-2 text-[10px] text-cream/80">{element.content}</span>
          )}
        </div>
      );
    case "sticker":
      return <span className={cn(compact ? "text-[10px]" : "text-4xl")}>{element.content}</span>;
    case "forme":
      return (
        <div
          className={cn("aspect-square w-full", element.content === "cercle" ? "rounded-full" : "rounded-xl")}
          style={{ backgroundColor: tone.deep, opacity: 0.35 }}
        />
      );
    case "lien":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-mauve-deep shadow-paper ring-1 ring-border/60",
            compact ? "px-1 py-0 text-[5px]" : "text-xs",
          )}
        >
          <Link2 className={compact ? "h-1.5 w-1.5" : "h-3.5 w-3.5"} /> {element.content}
        </span>
      );
    default:
      return null;
  }
}

export function PageCanvas({
  page,
  compact,
  className,
  onSelect,
  selectedId,
}: {
  page: NotebookPage;
  compact?: boolean;
  className?: string;
  onSelect?: (id: string) => void;
  selectedId?: string | null;
}) {
  return (
    <div
      className={cn("paper-soft relative h-full w-full overflow-hidden", className)}
      style={pageBackground(page.background)}
    >
      {page.elements.map((e) => (
        <div
          key={e.id}
          onPointerDown={onSelect ? () => onSelect(e.id) : undefined}
          className={cn(
            "absolute",
            onSelect && "cursor-pointer",
            selectedId === e.id && "rounded-lg outline-2 outline-mauve-deep outline-dashed outline-offset-4",
          )}
          style={{
            left: `${e.x}%`,
            top: `${e.y}%`,
            width: `${e.w}%`,
            transform: `rotate(${e.rotation}deg)`,
          }}
        >
          <ElementView element={e} compact={compact} />
        </div>
      ))}
    </div>
  );
}
