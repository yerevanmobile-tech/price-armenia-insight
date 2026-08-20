import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Activity, Loader2 } from "lucide-react";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Price Monitor — Մրցակիցների գների մոնիթորինգ" },
      {
        name: "description",
        content:
          "Հսկեք Zigzag, Vega, Mobile Centre և Yerevan Mobile խանութների գները մեկ մոբայլ հավելվածում։",
      },
      { property: "og:title", content: "Price Monitor" },
      {
        property: "og:description",
        content: "Competitor price monitoring for Armenian electronics retailers.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { hydrated, session, user, t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      if (!session) void navigate({ to: "/auth" });
      else if (user?.role === "super_admin" && !session.companyId)
        void navigate({ to: "/select-company" });
      else void navigate({ to: "/dashboard" });
    }, 700);
    return () => clearTimeout(timer);
  }, [hydrated, session, user, navigate]);

  return (
    <div className="grid min-h-dvh place-items-center bg-navy px-8 text-navy-foreground">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground">
          <Activity className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Price Monitor</h1>
        <p className="mt-1 text-sm opacity-70">{t("tagline")}</p>
        <div className="mt-8 flex items-center gap-2 text-xs opacity-70">
          <Loader2 className="size-4 animate-spin" />
          {t("restoring")}
        </div>
      </div>
    </div>
  );
}
