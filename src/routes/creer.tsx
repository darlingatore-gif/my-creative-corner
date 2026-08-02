import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus, Check } from "lucide-react";
import { toast } from "sonner";
import { Screen, SectionTitle } from "@/components/atelier/screen";
import { coverBackground, Tape } from "@/components/atelier/decor";
import {
  actions,
  categories,
  paletteLabels,
  type CoverStyle,
  type Palette,
} from "@/lib/atelier-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/creer")({
  head: () => ({
    meta: [
      { title: "Créer un carnet — Mon Atelier" },
      { name: "description", content: "Choisissez un titre, une couverture, une couleur et un modèle visuel." },
      { property: "og:title", content: "Créer un carnet — Mon Atelier" },
      { property: "og:description", content: "Titre, couverture, couleur et modèles visuels." },
    ],
  }),
  component: Create,
});

const palettes: Palette[] = ["rose", "mauve", "cream", "beige", "gold", "sage"];
const covers: { id: CoverStyle; label: string }[] = [
  { id: "uni", label: "Uni" },
  { id: "rayures", label: "Rayures" },
  { id: "pois", label: "Pois" },
  { id: "fleurs", label: "Fleurs" },
  { id: "degrade", label: "Dégradé" },
  { id: "quadrille", label: "Quadrillé" },
];
const emojis = ["📖", "✨", "🌸", "🕊️", "🖋️", "🌿", "🍯", "🎀"];

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]!);
  const [palette, setPalette] = useState<Palette>("rose");
  const [cover, setCover] = useState<CoverStyle>("fleurs");
  const [emoji, setEmoji] = useState("🌸");

  return (
    <Screen>
      <h1 className="font-display text-[28px] font-semibold text-ink">Nouveau carnet</h1>
      <p className="text-sm text-muted-foreground">Composez sa couverture avant de l'ouvrir.</p>

      <div className="mt-5 flex justify-center">
        <div
          className="paper-soft relative aspect-[3/4] w-44 overflow-hidden rounded-2xl shadow-lift ring-1 ring-border/70"
          style={coverBackground(palette, cover)}
        >
          <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3" />
          <span className="absolute top-3 right-3 text-xl">{emoji}</span>
          <div className="absolute inset-x-3 bottom-3 rounded-xl bg-card/80 px-3 py-2">
            <p className="font-display text-base leading-tight font-semibold text-ink">
              {title || "Titre du carnet"}
            </p>
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{category}</p>
          </div>
        </div>
      </div>

      <SectionTitle title="Titre" />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex. Carnet d'automne"
        className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm shadow-paper outline-none focus:ring-2 focus:ring-ring"
      />

      <SectionTitle title="Catégorie" />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium",
              category === c ? "border-transparent bg-mauve text-accent-foreground" : "border-border bg-card",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <SectionTitle title="Couleur" />
      <div className="grid grid-cols-3 gap-3">
        {palettes.map((p) => (
          <button
            key={p}
            onClick={() => setPalette(p)}
            className={cn(
              "relative flex h-16 flex-col justify-end rounded-2xl p-2 text-[11px] font-medium text-ink ring-1 ring-border",
              palette === p && "ring-2 ring-mauve-deep",
            )}
            style={coverBackground(p, "uni")}
          >
            {palette === p && (
              <Check className="absolute top-2 right-2 h-4 w-4 rounded-full bg-card/80 p-0.5" />
            )}
            {paletteLabels[p]}
          </button>
        ))}
      </div>

      <SectionTitle title="Modèles de couverture" />
      <div className="grid grid-cols-3 gap-3">
        {covers.map((c) => (
          <button key={c.id} onClick={() => setCover(c.id)} className="text-left">
            <div
              className={cn(
                "aspect-[3/4] rounded-xl ring-1 ring-border",
                cover === c.id && "ring-2 ring-mauve-deep",
              )}
              style={coverBackground(palette, c.id)}
            />
            <p className="mt-1 text-center text-[11px] text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>

      <SectionTitle title="Petit emblème" />
      <div className="flex flex-wrap gap-2">
        {emojis.map((e) => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            className={cn(
              "h-11 w-11 rounded-2xl border border-border bg-card text-lg",
              emoji === e && "border-mauve-deep bg-accent",
            )}
          >
            {e}
          </button>
        ))}
      </div>

      <button
        onClick={() => toast("Import d'image simulé dans cette maquette")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/60 px-4 py-4 text-sm text-muted-foreground"
      >
        <ImagePlus className="h-4 w-4" /> Importer une image de couverture
      </button>

      <button
        onClick={() => {
          const id = actions.createNotebook({ title, category, palette, cover, emoji });
          toast.success("Carnet créé");
          navigate({ to: "/carnets/$id", params: { id } });
        }}
        className="mt-5 w-full rounded-full bg-primary px-6 py-4 font-display text-lg font-semibold text-primary-foreground shadow-lift active:scale-[0.98]"
      >
        Créer le carnet
      </button>
    </Screen>
  );
}
