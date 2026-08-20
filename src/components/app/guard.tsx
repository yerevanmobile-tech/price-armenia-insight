import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useApp } from "@/lib/app-state";
import { BottomNav, NavSpacer } from "./nav";
import { Screen, Spinner } from "./kit";

export function AppScreen({
  children,
  hideNav,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const { hydrated, session, user, t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      void navigate({ to: "/auth" });
      return;
    }
    if (user?.role === "super_admin" && !session.companyId) {
      void navigate({ to: "/select-company" });
    }
  }, [hydrated, session, user, navigate]);

  if (!hydrated || !session || !user) {
    return (
      <Screen>
        <Spinner label={t("loading")} />
      </Screen>
    );
  }

  return (
    <Screen className="pb-4">
      {children}
      {hideNav ? <div className="h-6" /> : <NavSpacer />}
      {hideNav ? null : <BottomNav />}
    </Screen>
  );
}