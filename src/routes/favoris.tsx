import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Screen } from "@/components/atelier/screen";
import { Flower, NotebookCover, coverBackground } from "@/components/atelier/decor";
import { actions, useAtelier } from "@/lib/atelier-store";

export const Route = createFileRoute("/favoris")({
  head: () => ({
    meta: [
      { title: "Mes favoris — Mon Atelier" },
      { name: "description", content: "Les carnets que vous ouvrez le plus souvent, réunis au même endroit." },
      { property: "og:title", content: "Mes favoris — Mon Atelier" },
      { property: "og:description", content: "Vos carnets préférés, réunis au même endroit." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { notebooks } = useAtelier();
  const favorites = notebooks.filter((n) => n.favorite && !n.archived);
  const suggestions = notebooks.filter((n) => !n.favorite && !n.archived).slice(0, 4);

  return (
    <Screen>
      <header className="relative">
        <Flower className="-top-2 right-1 h-9 w-9 opacity-70" tone="rose" />
        <h1 className="font-display text-[28px] font-semibold text-ink">Mes favoris</h1>
        <p className="text-sm text-muted-foreground">{favorites.length} carnet(s) épinglé(s) au cœur.</p>
      </header>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {favorites.map((n) => (
          <div key={n.id} className="relative">
            <Link to="/carnets/$id" params={{ id: n.id }}>
              <NotebookCover notebook={n} />
            </Link>
            <button
              aria-label="Retirer des favoris"
              onClick={() => actions.toggleFavorite(n.id)}
              className="absolute top-2 left-2 grid h-9 w-9 place-items-center rounded-full bg-card/90 shadow-paper"
            >
              <Heart className="h-4 w-4 fill-primary text-primary" />
            </button>
          </div>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="paper mt-6 rounded-3xl border border-dashed border-border p-8 text-center">
          <p className="font-hand text-2xl text-mauve-deep">Aucun favori pour l'instant</p>
          <p className="mt-1 text-sm text-muted-foreground">Touchez le cœur d'un carnet pour l'ajouter ici.</p>
        </div>
      )}

      <h2 className="mt-8 mb-3 font-display text-xl font-semibold text-ink">À épingler peut-être ?</h2>
      <div className="space-y-3">
        {suggestions.map((n) => (
          <div
            key={n.id}
            className="paper flex items-center gap-3 rounded-2xl border border-border/70 p-3 shadow-paper"
          >
            <div
              className="h-12 w-12 shrink-0 rounded-xl ring-1 ring-border/60"
              style={coverBackground(n.palette, n.cover)}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-semibold text-ink">{n.title}</p>
              <p className="truncate text-xs text-muted-foreground">{n.category}</p>
            </div>
            <button
              aria-label="Ajouter aux favoris"
              onClick={() => actions.toggleFavorite(n.id)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border"
            >
              <Heart className="h-4 w-4 text-primary" />
            </button>
          </div>
        ))}
      </div>
    </Screen>
  );
}
