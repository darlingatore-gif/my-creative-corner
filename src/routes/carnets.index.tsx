import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Heart,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Rows3,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Screen } from "@/components/atelier/screen";
import { NotebookCover, coverBackground } from "@/components/atelier/decor";
import {
  actions,
  categories,
  paletteLabels,
  useAtelier,
  type Notebook,
  type Palette,
} from "@/lib/atelier-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/carnets/")({
  head: () => ({
    meta: [
      { title: "Bibliothèque de carnets — Mon Atelier" },
      { name: "description", content: "Tous vos carnets : recherche, filtres par catégorie, couleur et favoris." },
      { property: "og:title", content: "Bibliothèque de carnets — Mon Atelier" },
      { property: "og:description", content: "Tous vos carnets : recherche, filtres et gestion." },
    ],
  }),
  component: Library,
});

const palettes: Palette[] = ["rose", "mauve", "cream", "beige", "gold", "sage"];

function Library() {
  const { notebooks } = useAtelier();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<string | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [favOnly, setFavOnly] = useState(false);

  const list = notebooks.filter(
    (n) =>
      !n.archived &&
      n.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!category || n.category === category) &&
      (!palette || n.palette === palette) &&
      (!favOnly || n.favorite),
  );

  return (
    <Screen>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-semibold text-ink">Mes carnets</h1>
          <p className="text-xs text-muted-foreground">{list.length} carnet(s) en atelier</p>
        </div>
        <div className="flex shrink-0 gap-1 rounded-full border border-border bg-card p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Affichage grille"
            className={cn("rounded-full p-2", view === "grid" && "bg-accent text-accent-foreground")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="Affichage liste"
            className={cn("rounded-full p-2", view === "list" && "bg-accent text-accent-foreground")}
          >
            <Rows3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-paper">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un carnet…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        <Chip active={favOnly} onClick={() => setFavOnly((v) => !v)}>
          ♡ Favoris
        </Chip>
        {categories.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">Couleur</span>
        {palettes.map((p) => (
          <button
            key={p}
            aria-label={paletteLabels[p]}
            onClick={() => setPalette(palette === p ? null : p)}
            className={cn(
              "h-6 w-6 rounded-full ring-1 ring-border transition-transform",
              palette === p && "scale-110 ring-2 ring-mauve-deep",
            )}
            style={{ backgroundColor: coverBackground(p, "uni").backgroundColor }}
          />
        ))}
      </div>

      {view === "grid" ? (
        <div className="mt-5 grid grid-cols-2 gap-4">
          {list.map((n) => (
            <div key={n.id} className="relative">
              <Link to="/carnets/$id" params={{ id: n.id }}>
                <NotebookCover notebook={n} />
              </Link>
              <NotebookMenu notebook={n} className="absolute top-2 left-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {list.map((n) => (
            <div
              key={n.id}
              className="paper flex items-center gap-3 rounded-2xl border border-border/70 p-3 shadow-paper"
            >
              <Link to="/carnets/$id" params={{ id: n.id }} className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="h-14 w-11 shrink-0 rounded-lg ring-1 ring-border/60"
                  style={coverBackground(n.palette, n.cover)}
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-ink">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.category} · {n.pages.length} pages · {n.updated}
                  </p>
                </div>
              </Link>
              <NotebookMenu notebook={n} />
            </div>
          ))}
        </div>
      )}

      {list.length === 0 && (
        <div className="paper mt-8 rounded-3xl border border-dashed border-border p-8 text-center">
          <p className="font-hand text-2xl text-mauve-deep">Rien par ici…</p>
          <p className="mt-1 text-sm text-muted-foreground">Modifiez vos filtres ou créez un nouveau carnet.</p>
          <button
            onClick={() => navigate({ to: "/creer" })}
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Créer un carnet
          </button>
        </div>
      )}
    </Screen>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
        active
          ? "border-transparent bg-mauve text-accent-foreground"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function NotebookMenu({ notebook, className }: { notebook: Notebook; className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Options du carnet"
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card/90 text-ink shadow-paper ring-1 ring-border/60",
          className,
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 rounded-2xl">
        <DropdownMenuItem
          onSelect={() => {
            const t = window.prompt("Nouveau titre", notebook.title);
            if (t) {
              actions.rename(notebook.id, t);
              toast.success("Carnet renommé");
            }
          }}
        >
          <Pencil className="mr-2 h-4 w-4" /> Renommer
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            actions.duplicate(notebook.id);
            toast.success("Carnet dupliqué");
          }}
        >
          <Copy className="mr-2 h-4 w-4" /> Dupliquer
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            actions.toggleFavorite(notebook.id);
            toast.success(notebook.favorite ? "Retiré des favoris" : "Ajouté aux favoris");
          }}
        >
          <Heart className="mr-2 h-4 w-4" /> {notebook.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            actions.setArchived(notebook.id, !notebook.archived);
            toast.success(notebook.archived ? "Carnet restauré" : "Carnet archivé");
          }}
        >
          {notebook.archived ? (
            <ArchiveRestore className="mr-2 h-4 w-4" />
          ) : (
            <Archive className="mr-2 h-4 w-4" />
          )}
          {notebook.archived ? "Restaurer" : "Archiver"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            actions.remove(notebook.id);
            toast.success("Carnet supprimé");
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
