import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Bell, Home, Settings, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";

const items = [
  { to: "/dashboard", key: "nav_home", icon: Home },
  { to: "/competitors", key: "nav_markets", icon: Store },
  { to: "/alerts", key: "nav_alerts", icon: Bell },
  { to: "/analytics", key: "nav_analytics", icon: BarChart3 },
  { to: "/settings", key: "nav_settings", icon: Settings },
] as const;

export function BottomNav() {
  const { t, unreadCount } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-[430px] grid-cols-5">
        {items.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-[58px] flex-col items-center justify-center gap-1 px-1 py-2",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className={cn("size-5", active && "stroke-[2.4]")} />
                  {item.key === "nav_alerts" && unreadCount > 0 ? (
                    <span className="absolute -top-1.5 -right-2 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] leading-4 font-semibold text-danger-foreground">
                      {unreadCount}
                    </span>
                  ) : null}
                </span>
                <span className="w-full truncate text-center text-[10px] leading-tight font-medium">
                  {t(item.key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function NavSpacer() {
  return <div className="h-24" />;
}