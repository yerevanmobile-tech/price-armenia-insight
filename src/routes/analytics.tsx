import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AppScreen } from "@/components/app/guard";
import { AccessDenied, Card, Chip, ChipRow, EmptyState, MetricCard, SectionTitle, TopBar } from "@/components/app/kit";
import { CountBarChart, TrendChart } from "@/components/app/charts";
import { useApp } from "@/lib/app-state";
import { allowedChanges, summarize, trendBuckets, withinHours } from "@/lib/derive";
import { categories, productById, retailerById } from "@/lib/mock";
import { localizedCategory } from "@/lib/i18n";
import { formatAmd, formatPct } from "@/lib/format";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Վերլուծություն — Price Monitor" },
      { name: "description", content: "Շուկայի գնային վերլուծություն ըստ մրցակիցների, ապրանքանիշերի և կատեգորիաների։" },
      { property: "og:title", content: "Analytics — Price Monitor" },
      { property: "og:description", content: "Market price analytics by competitor, brand and category." },
    ],
  }),
  component: AnalyticsScreen,
});

function AnalyticsScreen() {
  const { t, lang, visibleCompetitors, visibleCategories, visibleBrands, can } = useApp();
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");

  const changes = useMemo(
    () =>
      withinHours(
        allowedChanges({
          competitors: visibleCompetitors,
          categories: visibleCategories,
          brands: visibleBrands,
        }),
        period === "day" ? 24 : period === "week" ? 24 * 7 : 24 * 30,
      ),
    [visibleCompetitors, visibleCategories, visibleBrands, period],
  );

  const stats = summarize(changes);
  const trend = trendBuckets(changes, period);

  const byCompetitor = useMemo(
    () =>
      visibleCompetitors
        .map((id) => ({
          label: retailerById(id)?.name ?? id,
          value: changes.filter((c) => c.retailerId === id).length,
        }))
        .sort((a, b) => b.value - a.value),
    [changes, visibleCompetitors],
  );

  const byBrand = useMemo(
    () =>
      visibleBrands
        .map((b) => ({
          label: b,
          value: changes.filter((c) => productById(c.productId)?.brand === b).length,
        }))
        .filter((x) => x.value > 0)
        .sort((a, b) => b.value - a.value),
    [changes, visibleBrands],
  );

  const byCategory = useMemo(
    () =>
      visibleCategories
        .map((cat) => ({
          label: localizedCategory(lang, cat, categories),
          value: changes.filter((c) => productById(c.productId)?.category === cat).length,
        }))
        .filter((x) => x.value > 0)
        .sort((a, b) => b.value - a.value),
    [changes, visibleCategories, lang],
  );

  const largest = useMemo(
    () => [...changes].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct)).slice(0, 6),
    [changes],
  );

  if (!can("analytics")) {
    return (
      <AppScreen>
        <TopBar title={t("nav_analytics")} />
        <AccessDenied backTo="/dashboard" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <TopBar title={t("nav_analytics")} />

      <ChipRow>
        <Chip active={period === "day"} onClick={() => setPeriod("day")}>
          {t("day")}
        </Chip>
        <Chip active={period === "week"} onClick={() => setPeriod("week")}>
          {t("week")}
        </Chip>
        <Chip active={period === "month"} onClick={() => setPeriod("month")}>
          {t("month")}
        </Chip>
      </ChipRow>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricCard label={t("total_changes")} value={String(stats.total)} />
        <MetricCard label={t("avg_change_pct")} value={formatPct(stats.avgPct)} />
        <MetricCard label={t("price_down")} value={String(stats.drops)} tone="success" />
        <MetricCard label={t("price_up")} value={String(stats.raises)} tone="danger" />
      </div>

      <SectionTitle title={t("drops_vs_raises")} />
      <Card>
        <TrendChart data={trend} />
      </Card>

      <SectionTitle title={t("by_competitor")} />
      <Card>{byCompetitor.length ? <CountBarChart data={byCompetitor} /> : <EmptyState />}</Card>

      <SectionTitle title={t("by_brand")} />
      <Card>{byBrand.length ? <CountBarChart data={byBrand} /> : <EmptyState />}</Card>

      <SectionTitle title={t("by_category")} />
      <Card>{byCategory.length ? <CountBarChart data={byCategory} /> : <EmptyState />}</Card>

      <SectionTitle title={t("largest_moves")} />
      {largest.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {largest.map((c) => {
            const p = productById(c.productId);
            return (
              <li key={c.id}>
                <Link to="/product/$retailerId/$productId" params={{ retailerId: c.retailerId, productId: c.productId }}>
                  <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p?.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {retailerById(c.retailerId)?.name} · {formatAmd(c.newPrice)}
                      </p>
                    </div>
                    <span
                      className={`flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums ${c.diff < 0 ? "text-success" : "text-danger"}`}
                    >
                      {c.diff < 0 ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                      {formatPct(c.pct)}
                    </span>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppScreen>
  );
}