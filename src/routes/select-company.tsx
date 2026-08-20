import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, ChevronRight, LogOut } from "lucide-react";
import { useApp, allCompanies } from "@/lib/app-state";
import { Badge, Card, RetailerAvatar, Screen, StatusDot } from "@/components/app/kit";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/select-company")({
  head: () => ({
    meta: [
      { title: "Ընտրել ընկերությունը — Price Monitor" },
      { name: "description", content: "Պլատֆորմի ադմինիստրատորի համար՝ հաճախորդ ընկերության ընտրություն։" },
      { property: "og:title", content: "Select company — Price Monitor" },
      { property: "og:description", content: "Platform admin company workspace selection." },
    ],
  }),
  component: SelectCompany,
});

function SelectCompany() {
  const { t, lang, user, setActiveCompany, logout } = useApp();
  const navigate = useNavigate();

  return (
    <Screen className="pt-[max(1.5rem,env(safe-area-inset-top))] pb-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">{t("select_company")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("select_company_hint")}</p>
        </div>
        <button
          onClick={() => {
            logout();
            void navigate({ to: "/auth" });
          }}
          aria-label={t("logout")}
          className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-danger"
        >
          <LogOut className="size-4" />
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {user?.name} · {t("role_super_admin")}
      </p>

      <ul className="mt-4 space-y-3">
        {allCompanies.map((c) => {
          const suspended = c.status === "suspended";
          return (
            <li key={c.id}>
              <button
                type="button"
                disabled={suspended}
                onClick={() => {
                  setActiveCompany(c.id);
                  void navigate({ to: "/dashboard" });
                }}
                className="w-full text-left disabled:opacity-60"
              >
                <Card>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                    <RetailerAvatar initials={c.name.slice(0, 2).toUpperCase()} tone="indigo" />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold">{c.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {c.plan} · {c.users} {t("users_count")}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <Badge tone={suspended ? "danger" : "success"}>
                      <span className="flex items-center gap-1">
                        <StatusDot status={suspended ? "suspended" : "active"} />
                        {t(suspended ? "suspended" : "active")}
                      </span>
                    </Badge>
                    <Badge tone="outline" icon={Building2}>
                      {c.competitors.length} {t("assigned_competitors")}
                    </Badge>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {formatDateTime(c.lastActivity, lang)}
                    </span>
                  </div>
                </Card>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">{t("support_mode")}</p>
    </Screen>
  );
}