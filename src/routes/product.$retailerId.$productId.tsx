import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BellPlus, BookmarkPlus, PackageX, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/guard";
import {
  AccessDenied,
  Badge,
  Card,
  GhostButton,
  MetricCard,
  PrimaryButton,
  SectionTitle,
  Segmented,
  TopBar,
} from "@/components/app/kit";
import { PriceLineChart } from "@/components/app/charts";
import { useApp } from "@/lib/app-state";
import { categories, priceChanges, priceHistory, productById, retailerById } from "@/lib/mock";
import { localizedCategory } from "@/lib/i18n";
import { formatAmd, formatDate, formatDateTime, formatPct } from "@/lib/format";

export const Route = createFileRoute("/product/$retailerId/$productId")({
  head: () => ({
    meta: [
      { title: "Ապրանքի պատմություն — Price Monitor" },
      { name: "description", content: "Ապրանքի գնի և առկայության ամբողջական պատմությունը մրցակցի մոտ։" },
      { property: "og:title", content: "Product history — Price Monitor" },
      { property: "og:description", content: "Full price and stock history for a competitor product." },
    ],
  }),
  component: ProductDetail,
});

const periods = [
  { id: "7", days: 7 },
  { id: "30", days: 30 },
  { id: "90", days: 90 },
  { id: "365", days: 365 },
  { id: "all", days: 730 },
] as const;

function ProductDetail() {
  const { retailerId, productId } = useParams({ from: "/product/$retailerId/$productId" });
  const { t, lang, visibleCompetitors, visibleCategories, visibleBrands, can } = useApp();
  const [period, setPeriod] = useState<string>("30");

  const product = productById(productId);
  const retailer = retailerById(retailerId);

  const history = useMemo(() => {
    const days = periods.find((p) => p.id === period)?.days ?? 30;
    return priceHistory(retailerId, productId, days).map((p) => ({
      label: formatDate(p.date, lang).replace(/\s\d{4}$/, ""),
      price: p.price,
    }));
  }, [retailerId, productId, period, lang]);

  const timeline = useMemo(
    () =>
      priceChanges
        .filter((c) => c.retailerId === retailerId && c.productId === productId)
        .sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    [retailerId, productId],
  );

  const allowed =
    product &&
    retailer &&
    visibleCompetitors.includes(retailer.id) &&
    visibleCategories.includes(product.category) &&
    visibleBrands.includes(product.brand) &&
    can("history");

  if (!allowed) {
    return (
      <AppScreen>
        <TopBar title={t("no_access_title")} back="/competitors" />
        <AccessDenied backTo="/competitors" />
      </AppScreen>
    );
  }

  const latest = timeline[0];
  const prices = history.map((h) => h.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const down = (latest?.diff ?? 0) < 0;

  return (
    <AppScreen>
      <TopBar title={product.name} back="/competitors" subtitle={`${retailer.name} · ${product.brand}`} />

      <Card>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="outline">{localizedCategory(lang, product.category, categories)}</Badge>
          <Badge tone="outline">{product.brand}</Badge>
          <Badge tone={latest?.stock === "out" ? "warning" : "success"} icon={latest?.stock === "out" ? PackageX : RefreshCw}>
            {t(latest?.stock === "out" ? "out_of_stock" : "in_stock")}
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t("current_price")}</p>
            <p className="text-2xl font-semibold tabular-nums">{formatAmd(latest?.newPrice ?? product.base)}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-through tabular-nums">
              {formatAmd(latest?.oldPrice ?? product.base)}
            </p>
          </div>
          <span
            className={`flex shrink-0 items-center gap-1 text-base font-semibold tabular-nums ${down ? "text-success" : "text-danger"}`}
          >
            {down ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
            {formatPct(latest?.pct ?? 0)}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {t("last_checked")}: {formatDateTime(latest?.at ?? new Date().toISOString(), lang)}
        </p>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <MetricCard label={t("lowest_price")} value={formatAmd(lowest)} tone="success" />
        <MetricCard label={t("highest_price")} value={formatAmd(highest)} tone="danger" />
      </div>

      <SectionTitle title={t("trend")} />
      <Card>
        <Segmented
          value={period}
          onChange={setPeriod}
          options={[
            { id: "7", label: `7 ${t("day").toLowerCase()}` },
            { id: "30", label: `30 ${t("day").toLowerCase()}` },
            { id: "90", label: `3 ${t("month").toLowerCase()}` },
            { id: "365", label: `1 ${t("month").toLowerCase()}` },
            { id: "all", label: t("all_time") },
          ]}
        />
        <div className="mt-3">
          <PriceLineChart data={history} />
        </div>
      </Card>

      <SectionTitle title={t("timeline")} />
      <ul className="space-y-2">
        {timeline.map((c) => (
          <li key={c.id}>
            <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-2xl ${c.diff < 0 ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}
              >
                {c.diff < 0 ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium tabular-nums">
                  {formatAmd(c.oldPrice)} → {formatAmd(c.newPrice)}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {formatDateTime(c.at, lang)}
                  {c.stock === "out" ? ` · ${t("out_of_stock")}` : c.stock === "back" ? ` · ${t("back_in_stock")}` : ""}
                </p>
              </div>
              <span className={`shrink-0 text-sm font-semibold tabular-nums ${c.diff < 0 ? "text-success" : "text-danger"}`}>
                {formatPct(c.pct)}
              </span>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-2">
        {can("watchlist") ? (
          <PrimaryButton onClick={() => toast.success(t("added_watchlist"))}>
            <span className="inline-flex items-center gap-2">
              <BookmarkPlus className="size-4" /> {t("add_watchlist")}
            </span>
          </PrimaryButton>
        ) : null}
        {can("alert_rules") ? (
          <GhostButton onClick={() => toast.success(t("rule_saved"))}>
            <span className="inline-flex items-center gap-2">
              <BellPlus className="size-4" /> {t("create_alert")}
            </span>
          </GhostButton>
        ) : null}
      </div>
    </AppScreen>
  );
}