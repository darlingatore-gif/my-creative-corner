import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, ChevronLeft, Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Screen } from "@/components/atelier/screen";
import { coverBackground, Paperclip, Tape } from "@/components/atelier/decor";
import { PageCanvas } from "@/components/atelier/page-canvas";
import { NotebookMenu } from "./carnets.index";
import { actions, useAtelier } from "@/lib/atelier-store";

export const Route = createFileRoute("/carnets/$id/")({
  head: () => ({
    meta: [
      { title: "Carnet ouvert — Mon Atelier" },
      { name: "description", content: "Parcourez les pages du carnet, ajoutez-en une ou passez en lecture." },
      { property: "og:title", content: "Carnet ouvert — Mon Atelier" },
      { property: "og:description", content: "Pages, miniatures et lecture immersive." },
    ],
  }),
  component: NotebookDetail,
});

function NotebookDetail() {
  const { id } = Route.useParams();
  const { notebooks } = useAtelier();
  const navigate = useNavigate();
  const notebook = notebooks.find((n) => n.id === id);

  useEffect(() => {
    if (notebook) actions.touch(notebook.id);
  }, [notebook?.id]);

  if (!notebook) {
    return (
      <Screen>
        <p className="mt-20 text-center text-sm text-muted-foreground">Ce carnet n'existe plus.</p>
        <Link to="/carnets" className="mt-4 block text-center text-sm font-semibold text-mauve-deep">
          Retour à la bibliothèque
        </Link>
      </Screen>
    );
  }

  return (
    <Screen className="pt-4">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/carnets"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
          aria-label="Retour"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex gap-2">
          <button
            aria-label="Favori"
            onClick={() => actions.toggleFavorite(notebook.id)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card"
          >
            <Heart className={notebook.favorite ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
          </button>
          <NotebookMenu notebook={notebook} className="h-10 w-10" />
        </div>
      </div>

      <div
        className="paper-soft relative mt-4 overflow-hidden rounded-3xl p-5 shadow-lift ring-1 ring-border/70"
        style={coverBackground(notebook.palette, notebook.cover)}
      >
        <Paperclip className="-top-3 right-6 rotate-6" />
        <p className="font-hand text-lg text-ink/70">{notebook.category}</p>
        <h1 className="font-display text-[30px] leading-tight font-semibold text-ink">{notebook.title}</h1>
        <p className="mt-1 text-xs text-ink/70">
          {notebook.pages.length} pages · modifié {notebook.updated.toLowerCase()}
        </p>
        <Link
          to="/carnets/$id/lecture"
          params={{ id: notebook.id }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-card/90 px-4 py-2.5 text-sm font-medium text-ink shadow-paper"
        >
          <BookOpen className="h-4 w-4" /> Lecture immersive
        </Link>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Pages</h2>
        <button
          onClick={() => {
            const pid = actions.addPage(notebook.id);
            toast.success("Page ajoutée");
            navigate({ to: "/carnets/$id/page/$pageId", params: { id: notebook.id, pageId: pid } });
          }}
          className="flex items-center gap-1 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-paper"
        >
          <Plus className="h-4 w-4" /> Nouvelle page
        </button>
      </div>

      <div className="mt-4 space-y-5">
        {notebook.pages.map((p, i) => (
          <Link
            key={p.id}
            to="/carnets/$id/page/$pageId"
            params={{ id: notebook.id, pageId: p.id }}
            className="block"
          >
            <div className="relative rounded-3xl bg-card p-2 shadow-lift ring-1 ring-border/70">
              <Tape className="-top-2 left-8 -rotate-6" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-border/60">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-1/2 z-10 w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-ink/10 to-transparent"
                />
                <PageCanvas page={p} />
              </div>
              <div className="flex items-center justify-between px-2 py-2">
                <p className="truncate font-display text-sm font-semibold text-ink">{p.title}</p>
                <p className="shrink-0 text-[11px] text-muted-foreground">Page {i + 1}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-display text-lg font-semibold text-ink">Miniatures</h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {notebook.pages.map((p, i) => (
          <Link
            key={p.id}
            to="/carnets/$id/page/$pageId"
            params={{ id: notebook.id, pageId: p.id }}
            className="w-16 shrink-0"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-lg ring-1 ring-border/70">
              <PageCanvas page={p} compact />
            </div>
            <p className="mt-1 text-center text-[10px] text-muted-foreground">{i + 1}</p>
          </Link>
        ))}
      </div>
    </Screen>
  );
}
