import { useSyncExternalStore } from "react";

export type CoverStyle = "uni" | "rayures" | "pois" | "fleurs" | "degrade" | "quadrille";
export type Palette = "rose" | "mauve" | "cream" | "beige" | "gold" | "sage";

export type ElementKind = "texte" | "photo" | "video" | "sticker" | "forme" | "lien" | "note";

export type PageElement = {
  id: string;
  kind: ElementKind;
  x: number; // percentage of canvas width
  y: number; // percentage of canvas height
  w: number; // percentage
  rotation: number;
  content: string;
  color?: Palette | undefined;
};

export type NotebookPage = {
  id: string;
  title: string;
  background: Palette | "papier";
  elements: PageElement[];
};

export type Notebook = {
  id: string;
  title: string;
  category: string;
  palette: Palette;
  cover: CoverStyle;
  favorite: boolean;
  archived: boolean;
  updated: string;
  emoji: string;
  pages: NotebookPage[];
};

export const paletteLabels: Record<Palette, string> = {
  rose: "Rose poudré",
  mauve: "Mauve clair",
  cream: "Crème",
  beige: "Beige",
  gold: "Doré",
  sage: "Sauge",
};

export const paletteCss: Record<Palette, { bg: string; deep: string }> = {
  rose: { bg: "oklch(0.9 0.05 15)", deep: "oklch(0.72 0.09 12)" },
  mauve: { bg: "oklch(0.87 0.055 315)", deep: "oklch(0.62 0.09 310)" },
  cream: { bg: "oklch(0.96 0.02 85)", deep: "oklch(0.78 0.06 80)" },
  beige: { bg: "oklch(0.91 0.03 70)", deep: "oklch(0.68 0.05 60)" },
  gold: { bg: "oklch(0.89 0.07 88)", deep: "oklch(0.72 0.11 82)" },
  sage: { bg: "oklch(0.87 0.04 145)", deep: "oklch(0.62 0.06 148)" },
};

export const categories = ["Lecture", "Inspiration", "Souvenirs", "Écriture", "Créatif"];

let seq = 0;
const uid = (p = "id") => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

function el(
  kind: ElementKind,
  content: string,
  x: number,
  y: number,
  w: number,
  rotation = 0,
  color?: Palette,
): PageElement {
  return { id: uid("el"), kind, content, x, y, w, rotation, color };
}

function page(title: string, background: NotebookPage["background"], elements: PageElement[]): NotebookPage {
  return { id: uid("pg"), title, background, elements };
}

const initial: Notebook[] = [
  {
    id: "journal-de-lecture",
    title: "Journal de lecture",
    category: "Lecture",
    palette: "rose",
    cover: "fleurs",
    favorite: true,
    archived: false,
    updated: "Aujourd'hui",
    emoji: "📖",
    pages: [
      page("Mes lectures du printemps", "papier", [
        el("texte", "Mes lectures du printemps", 8, 8, 76, -2),
        el("note", "« Un livre est un rêve que l'on tient dans les mains. »", 10, 26, 62, 2, "rose"),
        el("photo", "Pile de romans sur un plaid", 18, 48, 56, -3),
        el("sticker", "🌸", 74, 20, 16, 12),
      ]),
      page("Citations préférées", "cream", [
        el("texte", "Citations à garder", 10, 10, 70, -1),
        el("note", "« On ne voit bien qu'avec le cœur. »", 12, 30, 66, -3, "mauve"),
        el("forme", "cercle", 62, 58, 28, 0, "gold"),
      ]),
      page("À lire ensuite", "rose", [
        el("texte", "Ma pile à lire", 12, 12, 62, 1),
        el("lien", "librairie-du-quartier.fr", 12, 34, 62, 0),
        el("sticker", "📚", 66, 60, 20, -8),
      ]),
    ],
  },
  {
    id: "inspirations",
    title: "Inspirations",
    category: "Inspiration",
    palette: "mauve",
    cover: "degrade",
    favorite: true,
    archived: false,
    updated: "Hier",
    emoji: "✨",
    pages: [
      page("Moodboard doux", "mauve", [
        el("texte", "Moodboard · douceur", 8, 8, 74, -2),
        el("photo", "Textures pastel et lin froissé", 8, 26, 44, -4),
        el("photo", "Bouquet de pivoines", 54, 34, 38, 5),
        el("sticker", "🎀", 74, 12, 16, -10),
      ]),
      page("Palette de couleurs", "cream", [
        el("texte", "Palette 2026", 10, 10, 60, 0),
        el("forme", "rectangle", 10, 28, 34, -2, "rose"),
        el("forme", "rectangle", 52, 34, 34, 3, "gold"),
      ]),
    ],
  },
  {
    id: "souvenirs",
    title: "Souvenirs",
    category: "Souvenirs",
    palette: "beige",
    cover: "pois",
    favorite: false,
    archived: false,
    updated: "Il y a 3 jours",
    emoji: "🕊️",
    pages: [
      page("Été à la mer", "beige", [
        el("texte", "Été, sel et lumière", 8, 8, 78, -3),
        el("photo", "Polaroid de la plage au couchant", 12, 26, 58, -5),
        el("note", "On est restées jusqu'à la dernière lueur.", 16, 62, 62, 2, "beige"),
        el("video", "Vagues au ralenti", 60, 14, 32, 8),
      ]),
      page("Cartes postales", "papier", [
        el("texte", "Cartes postales", 10, 10, 64, 1),
        el("photo", "Timbres anciens", 14, 30, 52, -2),
      ]),
    ],
  },
  {
    id: "mon-roman",
    title: "Mon roman",
    category: "Écriture",
    palette: "cream",
    cover: "rayures",
    favorite: false,
    archived: false,
    updated: "Il y a 1 semaine",
    emoji: "🖋️",
    pages: [
      page("Chapitre I", "papier", [
        el("texte", "Chapitre I — La lettre", 8, 8, 80, -1),
        el("note", "Elle ouvrit l'enveloppe et le parfum du papier ancien remplit la pièce.", 10, 26, 74, 1, "cream"),
      ]),
      page("Personnages", "cream", [
        el("texte", "Personnages", 10, 10, 60, 0),
        el("note", "Camille · 32 ans · relieuse", 12, 28, 64, -2, "rose"),
        el("note", "Aurèle · libraire discret", 12, 52, 64, 2, "mauve"),
      ]),
    ],
  },
  {
    id: "idees-creatives",
    title: "Idées créatives",
    category: "Créatif",
    palette: "gold",
    cover: "quadrille",
    favorite: true,
    archived: false,
    updated: "Il y a 2 semaines",
    emoji: "🌿",
    pages: [
      page("Ateliers à tester", "cream", [
        el("texte", "Ateliers à tester", 8, 8, 74, -2),
        el("note", "Reliure japonaise · encre végétale · fleurs pressées", 10, 28, 70, 1, "sage"),
        el("sticker", "🌼", 72, 58, 18, 14),
      ]),
    ],
  },
  {
    id: "recettes-douces",
    title: "Recettes douces",
    category: "Créatif",
    palette: "sage",
    cover: "uni",
    favorite: false,
    archived: true,
    updated: "Il y a 2 mois",
    emoji: "🍯",
    pages: [page("Gâteau au miel", "papier", [el("texte", "Gâteau au miel", 10, 12, 66, -1)])],
  },
];

type State = { notebooks: Notebook[]; recent: string[] };

let state: State = {
  notebooks: initial,
  recent: ["journal-de-lecture", "inspirations", "souvenirs", "idees-creatives"],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (next: State) => {
  state = next;
  emit();
};

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAtelier() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}

export const actions = {
  createNotebook(input: {
    title: string;
    category: string;
    palette: Palette;
    cover: CoverStyle;
    emoji: string;
  }) {
    const id = uid("nb");
    const nb: Notebook = {
      id,
      title: input.title || "Nouveau carnet",
      category: input.category,
      palette: input.palette,
      cover: input.cover,
      favorite: false,
      archived: false,
      updated: "À l'instant",
      emoji: input.emoji,
      pages: [page("Première page", "papier", [el("texte", input.title || "Nouveau carnet", 10, 12, 70, -2)])],
    };
    set({ notebooks: [nb, ...state.notebooks], recent: [id, ...state.recent] });
    return id;
  },
  toggleFavorite(id: string) {
    set({
      ...state,
      notebooks: state.notebooks.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)),
    });
  },
  rename(id: string, title: string) {
    set({
      ...state,
      notebooks: state.notebooks.map((n) => (n.id === id ? { ...n, title, updated: "À l'instant" } : n)),
    });
  },
  duplicate(id: string) {
    const src = state.notebooks.find((n) => n.id === id);
    if (!src) return;
    const copy: Notebook = {
      ...src,
      id: uid("nb"),
      title: `${src.title} (copie)`,
      favorite: false,
      updated: "À l'instant",
      pages: src.pages.map((p) => ({ ...p, id: uid("pg"), elements: p.elements.map((e) => ({ ...e, id: uid("el") })) })),
    };
    set({ ...state, notebooks: [copy, ...state.notebooks] });
  },
  setArchived(id: string, archived: boolean) {
    set({ ...state, notebooks: state.notebooks.map((n) => (n.id === id ? { ...n, archived } : n)) });
  },
  remove(id: string) {
    set({
      notebooks: state.notebooks.filter((n) => n.id !== id),
      recent: state.recent.filter((r) => r !== id),
    });
  },
  touch(id: string) {
    if (state.recent[0] === id) return;
    set({ ...state, recent: [id, ...state.recent.filter((r) => r !== id)] });
  },
  addPage(notebookId: string) {
    let newId = "";
    set({
      ...state,
      notebooks: state.notebooks.map((n) => {
        if (n.id !== notebookId) return n;
        const p = page(`Page ${n.pages.length + 1}`, "papier", []);
        newId = p.id;
        return { ...n, pages: [...n.pages, p], updated: "À l'instant" };
      }),
    });
    return newId;
  },
  updatePage(notebookId: string, pageId: string, updater: (p: NotebookPage) => NotebookPage) {
    set({
      ...state,
      notebooks: state.notebooks.map((n) =>
        n.id === notebookId
          ? { ...n, updated: "À l'instant", pages: n.pages.map((p) => (p.id === pageId ? updater(p) : p)) }
          : n,
      ),
    });
  },
};

export function newElement(kind: ElementKind): PageElement {
  const presets: Record<ElementKind, { content: string; w: number }> = {
    texte: { content: "Écrivez ici…", w: 60 },
    photo: { content: "Nouvelle photo", w: 48 },
    video: { content: "Nouvelle vidéo", w: 44 },
    sticker: { content: "🌸", w: 18 },
    forme: { content: "cercle", w: 30 },
    lien: { content: "monsite.fr", w: 52 },
    note: { content: "Une petite note…", w: 56 },
  };
  const p = presets[kind];
  return {
    id: uid("el"),
    kind,
    content: p.content,
    x: 14 + Math.random() * 20,
    y: 18 + Math.random() * 40,
    w: p.w,
    rotation: Math.round((Math.random() - 0.5) * 8),
  };
}
