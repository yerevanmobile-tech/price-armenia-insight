import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, CheckCheck, Plus, SlidersHorizontal } from "lucide-react";
import { AppScreen } from "@/components/app/guard";
import {
  AccessDenied,
  Badge,
  Card,
  Chip,
  ChipRow,
  EmptyState,
  RetailerAvatar,
  SearchBar,
  TopBar,
} from "@/components/app/kit";
import { Sheet } from "@/components/app/pieces";
import { useApp } from "@/lib/app-state";
import { alerts as allAlerts, productById, retailerById, type AlertType } from "@/lib/mock";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/alerts/")({
  head: () => ({
    meta: [
      { title: "Ծանուցումներ — Price Monitor" },
      { name: "description", content: "Գնային իրադարձությունների ծանուցումների ցանկ և կանոններ։" },
      { property: "og:title", content: "Alerts — Price Monitor" },
      { property: "og:description", content: "Price event alerts inbox and rules." },
    ],
  }),
  component: AlertsInbox,
});

const types: AlertType[] = [
  "price_drop",
  "price_up",
  "cheaper",
  "out_of_stock",
  "back_in_stock",
  "new_product",
  "discount",
  "large_change",
];

function AlertsInbox() {
  const { t, lang, visibleCompetitors, readAlerts, markAllRead, can } = useApp();
  const [tab, setTab] = useState<"all" | "unread" | "read">("all");
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(false);
  const [type, setType] = useState<AlertType | "all">("all");
  const [severity, setSeverity] = useState<"all" | "high" | "medium" | "low">("all");
  const [retailer, setRetailer] = useState<string>("all");

  const list = useMemo(() => {
    return allAlerts.filter((a) => {
      if (!visibleCompetitors.includes(a.retailerId)) return false;
      const isRead = readAlerts.includes(a.id);
      if (tab === "unread" && isRead) return false;
      if (tab === "read" && !isRead) return false;
      if (type !== "all" && a.type !== type) return false;
      if (severity !== "all" && a.severity !== severity) return false;
      if (retailer !== "all" && a.retailerId !== retailer) return false;
      if (query) {
        const p = productById(a.productId);
        if (!p?.name.toLowerCase().includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [visibleCompetitors, readAlerts, tab, type, severity, retailer, query]);

  if (!can("alerts")) {
    return (
      <AppScreen>
        <TopBar title={t("nav_alerts")} />
        <AccessDenied backTo="/dashboard" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <TopBar
        title={t("nav_alerts")}
        right={
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              aria-label={t("mark_all_read")}
              className="grid size-10 place-items-center rounded-2xl border border-border bg-surface text-muted-foreground"
            >
              <CheckCheck className="size-4" />
            </button>
            {can("alert_rules") ? (
              <Link
                to="/alerts/rules"
                aria-label={t("alert_rules")}
                className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground"
              >
                <Plus className="size-4" />
              </Link>
            ) : null}
          </div>
        }
      />

      <SearchBar value={query} onChange={setQuery} placeholder={t("search_product")} />

      <div className="mt-3">
        <ChipRow>
          <Chip active={tab === "all"} onClick={() => setTab("all")}>
            {t("all")}
          </Chip>
          <Chip active={tab === "unread"} onClick={() => setTab("unread")}>
            {t("unread")}
          </Chip>
          <Chip active={tab === "read"} onClick={() => setTab("read")}>
            {t("read")}
          </Chip>
          <Chip onClick={() => setSheet(true)}>
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="size-3.5" />
              {t("filters")}
            </span>
          </Chip>
        </ChipRow>
      </div>

      <div className="mt-4">
        {list.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-2">
            {list.map((a) => {
              const unread = !readAlerts.includes(a.id);
              const p = productById(a.productId);
              const r = retailerById(a.retailerId);
              return (
                <li key={a.id}>
                  <Link to="/alerts/$alertId" params={{ alertId: a.id }}>
                    <Card className={unread ? "border-primary/40" : ""}>
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                        <RetailerAvatar initials={r?.initials ?? "--"} tone={r?.tone ?? "indigo"} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm leading-snug font-semibold break-words">{t(`at_${a.type}`)}</p>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {r?.name} · {p?.name}
                          </p>
                        </div>
                        {unread ? <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" /> : null}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Badge tone={a.severity === "high" ? "danger" : a.severity === "medium" ? "warning" : "neutral"} icon={Bell}>
                          {t(a.severity)}
                        </Badge>
                        <span className="ml-auto text-[11px] text-muted-foreground">{formatDateTime(a.at, lang)}</span>
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title={t("filters")}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("event_type")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={type === "all"} onClick={() => setType("all")}>
                {t("all")}
              </Chip>
              {types.map((ty) => (
                <Chip key={ty} active={type === ty} onClick={() => setType(ty)}>
                  {t(`at_${ty}`)}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("severity")}</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "high", "medium", "low"] as const).map((sv) => (
                <Chip key={sv} active={severity === sv} onClick={() => setSeverity(sv)}>
                  {t(sv === "all" ? "all" : sv)}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("competitors")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={retailer === "all"} onClick={() => setRetailer("all")}>
                {t("all")}
              </Chip>
              {visibleCompetitors.map((id) => (
                <Chip key={id} active={retailer === id} onClick={() => setRetailer(id)}>
                  {retailerById(id)?.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </AppScreen>
  );
}