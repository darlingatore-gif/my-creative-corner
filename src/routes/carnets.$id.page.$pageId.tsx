import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Link2,
  Loader2,
  Redo2,
  RotateCw,
  Shapes,
  Smile,
  StickyNote,
  Trash2,
  Type,
  Undo2,
  Video,
} from "lucide-react";
import { ElementView, pageBackground } from "@/components/atelier/page-canvas";
import {
  actions,
  newElement,
  paletteCss,
  useAtelier,
  type ElementKind,
  type NotebookPage,
  type Palette,
} from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/carnets/$id/page/$pageId")({
  head: () => ({
    meta: [
      { title: "Éditeur de page — Mon Atelier" },
      { name: "description", content: "Composez librement votre page : texte, photos, stickers, formes et notes." },
      { property: "og:title", content: "Éditeur de page — Mon Atelier" },
      { property: "og:description", content: "Zone de création libre avec outils simples." },
    ],
  }),
  component: Editor,
});

const tools: { kind: ElementKind; label: string; icon: typeof Type }[] = [
  { kind: "texte", label: "Texte", icon: Type },
  { kind: "photo", label: "Photo", icon: ImageIcon },
  { kind: "video", label: "Vidéo", icon: Video },
  { kind: "sticker", label: "Sticker", icon: Smile },
  { kind: "forme", label: "Forme", icon: Shapes },
  { kind: "lien", label: "Lien", icon: Link2 },
  { kind: "note", label: "Note", icon: StickyNote },
];

const backgrounds: NotebookPage["background"][] = ["papier", "cream", "rose", "mauve", "beige", "sage", "gold"];

function Editor() {
  const { id, pageId } = Route.useParams();
  const { notebooks } = useAtelier();
  const navigate = useNavigate();
  const notebook = notebooks.find((n) => n.id === id);
  const index = notebook?.pages.findIndex((p) => p.id === pageId) ?? -1;
  const page = index >= 0 ? notebook!.pages[index]! : undefined;

  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("il y a un instant");
  const history = useRef<{ past: NotebookPage[]; future: NotebookPage[] }>({ past: [], future: [] });
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ elId: string; startX: number; startY: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (!saving) return;
    const t = setTimeout(() => {
      setSaving(false);
      setSavedAt("à l'instant");
    }, 900);
    return () => clearTimeout(t);
  }, [saving]);

  if (!notebook || !page) {
    return (
      <div className="mx-auto max-w-[480px] p-8 text-center">
        <p className="text-sm text-muted-foreground">Cette page est introuvable.</p>
        <Link to="/carnets" className="mt-3 block text-sm font-semibold text-mauve-deep">
          Retour aux carnets
        </Link>
      </div>
    );
  }

  const commit = (updater: (p: NotebookPage) => NotebookPage) => {
    history.current.past.push(page);
    history.current.future = [];
    actions.updatePage(notebook.id, page.id, updater);
    setSaving(true);
  };

  const undo = () => {
    const prev = history.current.past.pop();
    if (!prev) return;
    history.current.future.push(page);
    actions.updatePage(notebook.id, page.id, () => prev);
    setSaving(true);
  };

  const redo = () => {
    const next = history.current.future.pop();
    if (!next) return;
    history.current.past.push(page);
    actions.updatePage(notebook.id, page.id, () => next);
    setSaving(true);
  };

  const selectedEl = page.elements.find((e) => e.id === selected) ?? null;

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!d || !rect) return;
    const dx = ((e.clientX - d.startX) / rect.width) * 100;
    const dy = ((e.clientY - d.startY) / rect.height) * 100;
    actions.updatePage(notebook.id, page.id, (p) => ({
      ...p,
      elements: p.elements.map((el) =>
        el.id === d.elId
          ? { ...el, x: Math.min(92, Math.max(-4, d.ox + dx)), y: Math.min(94, Math.max(-2, d.oy + dy)) }
          : el,
      ),
    }));
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/70 bg-background/90 px-3 py-2 backdrop-blur">
        <Link
          to="/carnets/$id"
          params={{ id: notebook.id }}
          aria-label="Retour au carnet"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-card"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold text-ink">{page.title}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Sauvegarde…
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-sage" /> Enregistré {savedAt}
              </>
            )}
          </p>
        </div>
        <button
          aria-label="Annuler"
          onClick={undo}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          aria-label="Rétablir"
          onClick={redo}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </header>

      <div className="px-3 pt-3">
        <div
          ref={canvasRef}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerLeave={() => (drag.current = null)}
          className="paper-soft relative aspect-[3/4] w-full touch-none overflow-hidden rounded-3xl shadow-lift ring-1 ring-border/70"
          style={pageBackground(page.background)}
        >
          {page.elements.map((el) => (
            <div
              key={el.id}
              onPointerDown={(e) => {
                setSelected(el.id);
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                drag.current = { elId: el.id, startX: e.clientX, startY: e.clientY, ox: el.x, oy: el.y };
              }}
              onPointerUp={() => {
                if (drag.current) setSaving(true);
                drag.current = null;
              }}
              className={cn(
                "absolute touch-none select-none",
                selected === el.id && "rounded-lg outline-2 outline-mauve-deep outline-dashed outline-offset-4",
              )}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.w}%`,
                transform: `rotate(${el.rotation}deg)`,
              }}
            >
              <ElementView element={el} />
            </div>
          ))}
          {page.elements.length === 0 && (
            <p className="absolute inset-0 grid place-items-center font-hand text-2xl text-muted-foreground">
              Ajoutez votre premier élément
            </p>
          )}
        </div>
      </div>

      {selectedEl && (
        <div className="mx-3 mt-3 rounded-2xl border border-border bg-card p-3 shadow-paper">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-xs font-semibold text-ink capitalize">
              {selectedEl.kind} sélectionné
            </p>
            <button
              aria-label="Pivoter"
              onClick={() =>
                commit((p) => ({
                  ...p,
                  elements: p.elements.map((e) =>
                    e.id === selectedEl.id ? { ...e, rotation: e.rotation + 5 } : e,
                  ),
                }))
              }
              className="grid h-9 w-9 place-items-center rounded-full border border-border"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              aria-label="Supprimer"
              onClick={() => {
                commit((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== selectedEl.id) }));
                setSelected(null);
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <label className="mt-2 block text-[11px] text-muted-foreground">Taille</label>
          <input
            type="range"
            min={10}
            max={92}
            value={selectedEl.w}
            onChange={(e) => {
              const w = Number(e.target.value);
              actions.updatePage(notebook.id, page.id, (p) => ({
                ...p,
                elements: p.elements.map((el) => (el.id === selectedEl.id ? { ...el, w } : el)),
              }));
              setSaving(true);
            }}
            className="w-full accent-primary"
          />
          {(selectedEl.kind === "texte" || selectedEl.kind === "note" || selectedEl.kind === "lien") && (
            <input
              value={selectedEl.content}
              onChange={(e) => {
                const content = e.target.value;
                actions.updatePage(notebook.id, page.id, (p) => ({
                  ...p,
                  elements: p.elements.map((el) => (el.id === selectedEl.id ? { ...el, content } : el)),
                }));
                setSaving(true);
              }}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
            />
          )}
        </div>
      )}

      <div className="mt-3 px-3">
        <p className="text-[11px] text-muted-foreground">Fond de page</p>
        <div className="mt-1.5 flex gap-2">
          {backgrounds.map((b) => (
            <button
              key={b}
              aria-label={`Fond ${b}`}
              onClick={() => commit((p) => ({ ...p, background: b }))}
              className={cn(
                "h-8 w-8 rounded-full ring-1 ring-border",
                page.background === b && "ring-2 ring-mauve-deep",
              )}
              style={{
                backgroundColor:
                  b === "papier" ? "oklch(0.985 0.012 85)" : paletteCss[b as Palette].bg,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-3 pb-2">
        <button
          disabled={index === 0}
          onClick={() =>
            navigate({
              to: "/carnets/$id/page/$pageId",
              params: { id: notebook.id, pageId: notebook.pages[index - 1]!.id },
            })
          }
          className="flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2.5 text-xs disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Précédente
        </button>
        <span className="text-[11px] text-muted-foreground">
          {index + 1} / {notebook.pages.length}
        </span>
        <button
          disabled={index === notebook.pages.length - 1}
          onClick={() =>
            navigate({
              to: "/carnets/$id/page/$pageId",
              params: { id: notebook.id, pageId: notebook.pages[index + 1]!.id },
            })
          }
          className="flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2.5 text-xs disabled:opacity-40"
        >
          Suivante <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="sticky bottom-0 mt-auto border-t border-border/70 bg-background/95 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {tools.map(({ kind, label, icon: Icon }) => (
            <button
              key={kind}
              onClick={() => {
                const el = newElement(kind);
                commit((p) => ({ ...p, elements: [...p.elements, el] }));
                setSelected(el.id);
              }}
              className="flex min-w-[68px] shrink-0 flex-col items-center gap-1 rounded-2xl border border-border bg-card px-3 py-2.5 text-[11px] font-medium text-ink"
            >
              <Icon className="h-5 w-5 text-mauve-deep" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
