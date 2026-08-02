import { Link, useRouterState } from "@tanstack/react-router";
import { BookHeart, Heart, Home, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { to: string; label: string; icon: typeof Home; center?: boolean };

const tabs: Tab[] = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/carnets", label: "Carnets", icon: BookHeart },
  { to: "/creer", label: "Créer", icon: Plus, center: true },
  { to: "/favoris", label: "Favoris", icon: Heart },
  { to: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="paper flex items-end justify-between gap-1 rounded-3xl border border-border/70 px-2 py-2 shadow-lift">
        {tabs.map(({ to, label, icon: Icon, center }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          if (center) {
            return (
              <Link
                key={to}
                to={to as never}
                aria-label={label}
                className="-mt-7 flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-primary text-primary-foreground shadow-lift ring-4 ring-background transition-transform active:scale-95"
              >
                <Icon className="h-6 w-6" strokeWidth={2.2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={to}
              to={to as never}
              className={cn(
                "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 transition-colors",
                active ? "bg-accent/60 text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
