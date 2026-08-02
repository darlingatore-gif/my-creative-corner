import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { PageCanvas } from "@/components/atelier/page-canvas";
import { useAtelier } from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/carnets/$id/lecture")({
  head: () => ({
    meta: [
      { title: "Lecture immersive — Mon Atelier" },
      { name: "description", content: "Vos pages en plein écran, sans outils, avec navigation par glissement." },
      { property: "og:title", content: "Lecture immersive — Mon Atelier" },
      { property: "og:description", content: "Pages en plein écran et ambiance calme." },
    ],
  }),
  component: Reader,
});

function Reader() {
  const { id } = Route.useParams();
  const { notebooks } = useAtelier();
  const notebook = notebooks.find((n) => n.id === id);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const start = useRef<number | null>(null);

  if (!notebook) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-cream">
        <Link to="/carnets" className="text-sm underline">
          Retour aux carnets
        </Link>
      </div>
    );
  }

  const page = notebook.pages[Math.min(index, notebook.pages.length - 1)]!;

  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={{ background: "linear-gradient(180deg, oklch(0.35 0.03 20), oklch(0.26 0.03 320))" }}
      onTouchStart={(e) => (start.current = e.touches[0]!.clientX)}
      onTouchEnd={(e) => {
        if (start.current === null) return;
        const dx = e.changedTouches[0]!.clientX - start.current;
        if (dx < -40) setIndex((i) => Math.min(i + 1, notebook.pages.length - 1));
        if (dx > 40) setIndex((i) => Math.max(i - 1, 0));
        start.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3">
        <p className="min-w-0 flex-1 truncate font-display text-lg text-cream/90">{notebook.title}</p>
        <button
          onClick={() => setAutoplay((v) => !v)}
          className={cn(
            "mr-2 flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[11px]",
            autoplay ? "bg-cream/90 text-ink" : "bg-cream/15 text-cream/80",
          )}
        >
          <PlayCircle className="h-3.5 w-3.5" /> Vidéos auto
        </button>
        <Link
          to="/carnets/$id"
          params={{ id: notebook.id }}
          aria-label="Quitter la lecture"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream/15 text-cream"
        >
          <X className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex flex-1 items-center px-4">
        <div className="w-full overflow-hidden rounded-3xl shadow-lift">
          <div className="relative aspect-[3/4] w-full">
            <PageCanvas page={page} />
            {autoplay && page.elements.some((e) => e.kind === "video") && (
              <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] text-cream">
                Lecture automatique
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-4 pt-5 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <p className="font-hand text-lg text-cream/80">{page.title}</p>
        <div className="flex gap-1.5">
          {notebook.pages.map((p, i) => (
            <button
              key={p.id}
              aria-label={`Page ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-cream" : "w-1.5 bg-cream/40",
              )}
            />
          ))}
        </div>
        <p className="text-[11px] text-cream/50">Glissez horizontalement pour tourner les pages</p>
      </div>
    </div>
  );
}
