import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Plus, Sparkles } from "lucide-react";
import { Screen, SectionTitle } from "@/components/atelier/screen";
import { Flower, NotebookCover, Paperclip, Tape, coverBackground } from "@/components/atelier/decor";
import { useAtelier } from "@/lib/atelier-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mon Atelier — accueil créatif" },
      {
        name: "description",
        content: "Retrouvez vos carnets récents, vos favoris et créez un nouveau carnet en un geste.",
      },
      { property: "og:title", content: "Mon Atelier — accueil créatif" },
      {
        property: "og:description",
        content: "Retrouvez vos carnets récents, vos favoris et créez un nouveau carnet en un geste.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { notebooks, recent } = useAtelier();
  const active = notebooks.filter((n) => !n.archived);
  const recents = recent
    .map((id) => active.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .slice(0, 4);
  const favorites = active.filter((n) => n.favorite);
  const mosaic = active.slice(0, 6);

  return (
    <Screen>
      <header className="relative">
        <Flower className="-top-3 right-0 h-10 w-10 opacity-70" tone="mauve" />
        <p className="font-hand text-xl text-mauve-deep">Bonjour Camille</p>
        <h1 className="mt-1 font-display text-[32px] leading-[1.1] font-semibold text-ink">
          Bienvenue dans
          <br />
          <span className="italic">Mon Atelier</span>
        </h1>
        <p className="mt-2 max-w-[16rem] text-sm text-muted-foreground">
          Vos carnets, vos souvenirs et vos idées, réunis dans un joli désordre organisé.
        </p>
      </header>

      <Link
        to="/creer"
        className="mt-5 flex items-center justify-between rounded-3xl bg-primary px-5 py-4 text-primary-foreground shadow-lift transition-transform active:scale-[0.98]"
      >
        <span>
          <span className="block font-display text-lg font-semibold">Créer un carnet</span>
          <span className="text-xs opacity-85">Couverture, couleur et modèle</span>
        </span>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-foreground/20">
          <Plus className="h-6 w-6" />
        </span>
      </Link>

      <SectionTitle
        title="Récemment ouverts"
        action={
          <Link to="/carnets" className="text-xs font-semibold text-mauve-deep">
            Tout voir
          </Link>
        }
      />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {recents.map((n) => (
          <Link key={n.id} to="/carnets/$id" params={{ id: n.id }} className="w-[132px] shrink-0">
            <NotebookCover notebook={n} />
            <p className="mt-1.5 truncate text-[11px] text-muted-foreground">{n.updated}</p>
          </Link>
        ))}
      </div>

      <SectionTitle
        title="Mes favoris"
        action={
          <Link to="/favoris" className="text-xs font-semibold text-mauve-deep">
            Voir tout
          </Link>
        }
      />
      <div className="space-y-3">
        {favorites.map((n) => (
          <Link
            key={n.id}
            to="/carnets/$id"
            params={{ id: n.id }}
            className="paper relative flex items-center gap-3 rounded-2xl border border-border/70 p-3 shadow-paper"
          >
            <Paperclip className="-top-3 right-5 rotate-6" />
            <div
              className="h-14 w-14 shrink-0 rounded-xl ring-1 ring-border/60"
              style={coverBackground(n.palette, n.cover)}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-semibold text-ink">{n.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {n.category} · {n.pages.length} pages
              </p>
            </div>
            <Heart className="h-5 w-5 shrink-0 fill-primary text-primary" />
          </Link>
        ))}
      </div>

      <SectionTitle title="Inspirations du jour" />
      <div className="columns-2 gap-3 [column-fill:_balance]">
        {mosaic.map((n, i) => (
          <Link
            key={n.id}
            to="/carnets/$id"
            params={{ id: n.id }}
            className="mb-3 block break-inside-avoid"
          >
            <div
              className="paper-soft relative overflow-hidden rounded-2xl p-3 shadow-paper ring-1 ring-border/60"
              style={{ ...coverBackground(n.palette, n.cover), height: [176, 132, 208, 150, 190, 138][i % 6] }}
            >
              <Tape className="-top-2 left-4 -rotate-6" />
              <span className="absolute right-3 bottom-3 text-2xl">{n.emoji}</span>
              <p className="absolute inset-x-3 bottom-3 pr-8 font-hand text-lg leading-tight text-ink">
                {n.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-gold" /> Maquette · fonctions simulées
      </p>
    </Screen>
  );
}
