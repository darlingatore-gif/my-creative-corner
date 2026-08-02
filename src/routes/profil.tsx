import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArchiveRestore, Camera, LogOut, Palette, Sparkles, Type } from "lucide-react";
import { toast } from "sonner";
import { Screen, SectionTitle } from "@/components/atelier/screen";
import { coverBackground, Squiggle } from "@/components/atelier/decor";
import { actions, useAtelier } from "@/lib/atelier-store";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil et réglages — Mon Atelier" },
      { name: "description", content: "Avatar, préférences d'apparence, thème clair et carnets archivés." },
      { property: "og:title", content: "Profil et réglages — Mon Atelier" },
      { property: "og:description", content: "Apparence, thème clair et gestion des carnets archivés." },
    ],
  }),
  component: Profile,
});

const themes = [
  { id: "poudre", label: "Rose poudré", colors: ["oklch(0.9 0.05 15)", "oklch(0.98 0.015 85)"] },
  { id: "mauve", label: "Mauve doux", colors: ["oklch(0.87 0.055 315)", "oklch(0.96 0.02 85)"] },
  { id: "sable", label: "Sable doré", colors: ["oklch(0.89 0.07 88)", "oklch(0.93 0.025 75)"] },
];

function Profile() {
  const { notebooks } = useAtelier();
  const archived = notebooks.filter((n) => n.archived);
  const [theme, setTheme] = useState("poudre");
  const [texture, setTexture] = useState(true);
  const [serif, setSerif] = useState(true);

  return (
    <Screen>
      <header className="paper relative overflow-hidden rounded-3xl border border-border/70 p-5 text-center shadow-paper">
        <div className="relative mx-auto h-20 w-20">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-mauve font-display text-2xl font-semibold text-ink ring-4 ring-card">
            C
          </div>
          <button
            aria-label="Changer la photo"
            onClick={() => toast("Changement de photo simulé")}
            className="absolute -right-1 -bottom-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-paper"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Camille Rousseau</h1>
        <p className="text-xs text-muted-foreground">camille@monatelier.app</p>
        <Squiggle className="mx-auto mt-2 h-2 w-24" />
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Carnets", notebooks.filter((n) => !n.archived).length],
            ["Pages", notebooks.reduce((a, n) => a + n.pages.length, 0)],
            ["Favoris", notebooks.filter((n) => n.favorite).length],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-2xl bg-background/70 py-2">
              <p className="font-display text-lg font-semibold text-ink">{value}</p>
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</p>
            </div>
          ))}
        </div>
      </header>

      <SectionTitle title="Apparence" />
      <div className="paper space-y-4 rounded-3xl border border-border/70 p-4 shadow-paper">
        <div className="flex items-center gap-3">
          <Palette className="h-4 w-4 shrink-0 text-mauve-deep" />
          <p className="min-w-0 flex-1 text-sm">Thème clair</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "rounded-2xl border p-2 text-[11px]",
                theme === t.id ? "border-mauve-deep" : "border-border",
              )}
            >
              <span className="flex h-8 overflow-hidden rounded-lg">
                {t.colors.map((c) => (
                  <span key={c} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </span>
              <span className="mt-1 block">{t.label}</span>
            </button>
          ))}
        </div>
        <Row icon={<Sparkles className="h-4 w-4 text-gold" />} label="Textures de papier">
          <Switch checked={texture} onCheckedChange={setTexture} />
        </Row>
        <Row icon={<Type className="h-4 w-4 text-mauve-deep" />} label="Titres en serif élégant">
          <Switch checked={serif} onCheckedChange={setSerif} />
        </Row>
      </div>

      <SectionTitle title="Carnets archivés" />
      <div className="space-y-3">
        {archived.map((n) => (
          <div
            key={n.id}
            className="paper flex items-center gap-3 rounded-2xl border border-border/70 p-3 shadow-paper"
          >
            <div
              className="h-12 w-10 shrink-0 rounded-lg opacity-70 ring-1 ring-border/60"
              style={coverBackground(n.palette, n.cover)}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-semibold text-ink">{n.title}</p>
              <p className="truncate text-xs text-muted-foreground">Archivé · {n.updated}</p>
            </div>
            <button
              onClick={() => {
                actions.setArchived(n.id, false);
                toast.success("Carnet restauré");
              }}
              className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-2 text-xs"
            >
              <ArchiveRestore className="h-3.5 w-3.5" /> Restaurer
            </button>
          </div>
        ))}
        {archived.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aucun carnet archivé.
          </p>
        )}
      </div>

      <button
        onClick={() => toast("Déconnexion simulée")}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-muted-foreground"
      >
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>
    </Screen>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0">{icon}</span>
      <p className="min-w-0 flex-1 text-sm">{label}</p>
      {children}
    </div>
  );
}
