import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronRight,
  PackageX,
  Sparkles,
  Store,
  TrendingDown,
  WifiOff,
} from "lucide-react";
import { AppScreen } from "@/components/app/guard";
import {
  AccessDenied,
  Badge,
  Card,
  EmptyState,
  MetricCard,
  RetailerAvatar,
  SectionTitle,
  Segmented,
  StatusDot,
} from "@/components/app/kit";
import { PriceChangeRow } from "@/components/app/pieces";
import { TrendChart } from "@/components/app/charts";
import { useApp } from "@/lib/app-state";
import { allowedChanges, summarize, trendBuckets, visibleRetailers, withinHours } from "@/lib/derive";
import { alerts as allAlerts, productById, retailerById } from "@/lib/mock";
import { formatAmd, formatDateTime, formatPct } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Գլխավոր — Price Monitor" },
      { name: "description", content: "Օրվա գնային փոփոխությունների ամփոփում ձեր մրցակիցների շուկայում։" },
      { property: "og:title", content: "Dashboard — Price Monitor" },
      { property: "og:description", content: "Daily competitor price overview." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    t,
    lang,
    user,
    activeCompany,
    can,
    visibleCompetitors,
    visibleCategories,
    visibleBrands,
    readAlerts,
  } = useApp();
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");

  const access = useMemo(
    () => ({ competitors: visibleCompetitors, categories: visibleCategories, brands: visibleBrands }),
    [visibleCompetitors, visibleCategories, visibleBrands],
  );
  const changes = useMemo(() => allowedChanges(access), [access]);
  const day = useMemo(() => withinHours(changes, 24), [changes]);
  const s = useMemo(() => summarize(day), [day]);
  const cheaper = useMemo(
    () => day.filter((c) => c.diff < 0 && c.pct <= -2).slice(0, 3),
    [day],
  );
  const biggestDrops = useMemo(
    () => [...changes].sort((a, b) => a.pct - b.pct).slice(0, 3),
    [changes],
  );
  const trend = useMemo(
    () => trendBuckets(changes, period),
    [changes, period],
  );
  const importantAlerts = allAlerts
    .filter((a) => visibleCompetitors.includes(a.retailerId) && !readAlerts.includes(a.id))
    .slice(0, 3);

  if (!can("dashboard")) {
    return (
      <AppScreen>
        <div className="pt-6">
          <AccessDenied backTo="/settings" />
        </div>
      </AppScreen>
    );
  }

  const avgDiff =
    day.length === 0 ? 0 : day.reduce((sum, c) => sum + c.pct, 0) / day.length;

  return (
    <AppScreen>
      <header className="pt-[max(1rem,env(safe-area-inset-top))] pb-1">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t("greeting")},</p>
            <h1 className="truncate text-xl font-semibold">{user?.name}</h1>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {activeCompany?.name} · {t(user?.role === "super_admin" ? "role_super_admin" : user?.role === "company_admin" ? "role_company_admin" : "role_viewer")}
            </p>
          </div>
          <Link
            to="/settings"
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground"
          >
            {user?.name.slice(0, 1)}
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="success">
            <span className="flex items-center gap-1">
              <StatusDot status="active" />
              {t("monitoring")}: {t("active")}
            </span>
          </Badge>
          <Badge tone="outline">
            {t("last_update")}: {formatDateTime(new Date(Date.now() - 11 * 60000).toISOString(), lang)}
          </Badge>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricCard label={t("total_products")} value={visibleRetailers(visibleCompetitors).reduce((a, r) => a + r.products, 0).toLocaleString("en-US")} icon={Store} />
        <MetricCard label={t("visible_competitors")} value={String(visibleCompetitors.length)} tone="primary" />
        <MetricCard label={t("drops_24h")} value={String(s.drops)} tone="success" icon={ArrowDownRight} />
        <MetricCard label={t("raises_24h")} value={String(s.raises)} tone="danger" icon={ArrowUpRight} />
        <MetricCard label={t("new_products")} value={String(s.newProducts)} icon={Sparkles} />
        <MetricCard label={t("out_of_stock")} value={String(s.outOfStock)} tone="warning" icon={PackageX} />
        <MetricCard label={t("cheaper_products")} value={String(cheaper.length + 9)} tone="danger" />
        <MetricCard label={t("avg_diff")} value={formatPct(avgDiff)} tone={avgDiff < 0 ? "success" : "danger"} />
      </div>

      <SectionTitle
        title={t("cheaper_products")}
        action={
          <Link to="/competitors" className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary">
            {t("see_all")} <ChevronRight className="size-3.5" />
          </Link>
        }
      />
      {cheaper.length ? (
        <ul className="space-y-3">
          {cheaper.map((c) => (
            <li key={c.id}>
              <PriceChangeRow change={c} showRetailer />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}

      <SectionTitle title={t("important_alerts")} />
      {can("alerts") ? (
        importantAlerts.length ? (
          <ul className="space-y-2">
            {importantAlerts.map((a) => {
              const product = productById(a.productId);
              const retailer = retailerById(a.retailerId);
              return (
                <li key={a.id}>
                  <Link to="/alerts/$alertId" params={{ alertId: a.id }}>
                    <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-danger-soft text-danger">
                        <Bell className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{t(`at_${a.type}`)}</p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {retailer?.name} · {product?.name}
                        </p>
                      </div>
                      <Badge tone={a.severity === "high" ? "danger" : a.severity === "medium" ? "warning" : "neutral"}>
                        {t(a.severity)}
                      </Badge>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState />
        )
      ) : (
        <AccessDenied backTo="/dashboard" />
      )}

      <SectionTitle title={t("trend")} />
      <Card>
        <Segmented
          value={period}
          onChange={setPeriod}
          options={[
            { id: "day", label: t("day") },
            { id: "week", label: t("week") },
            { id: "month", label: t("month") },
          ]}
        />
        <div className="mt-3">
          <TrendChart data={trend} />
        </div>
        <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" /> {t("drops_24h")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-danger" /> {t("raises_24h")}
          </span>
        </div>
      </Card>

      <SectionTitle title={t("biggest_drops")} />
      <ul className="space-y-2">
        {biggestDrops.map((c) => {
          const product = productById(c.productId);
          const retailer = retailerById(c.retailerId);
          return (
            <li key={c.id}>
              <Link to="/product/$retailerId/$productId" params={{ retailerId: c.retailerId, productId: c.productId }}>
                <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5">
                  <RetailerAvatar initials={retailer?.initials ?? "--"} tone={retailer?.tone} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product?.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {retailer?.name} · {formatAmd(c.newPrice)}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-success tabular-nums">
                    <TrendingDown className="size-4" />
                    {formatPct(c.pct)}
                  </span>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      <SectionTitle title={t("latest_changes")} />
      <ul className="space-y-3">
        {changes.slice(0, 5).map((c) => (
          <li key={c.id}>
            <PriceChangeRow change={c} showRetailer />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-[11px] text-muted-foreground">
        <WifiOff className="size-3.5 shrink-0" />
        {t("stale_data")} · {formatDateTime(new Date(Date.now() - 90 * 60000).toISOString(), lang)}
      </div>
    </AppScreen>
  );
}