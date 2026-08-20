import { createFileRoute, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { AppScreen } from "@/components/app/guard";
import {
  AccessDenied,
  Badge,
  Card,
  Chip,
  ChipRow,
  EmptyState,
  GhostButton,
  MetricCard,
  NoResults,
  PrimaryButton,
  SearchBar,
  SectionTitle,
  Segmented,
  StatusDot,
  TopBar,
} from "@/components/app/kit";
import { PriceChangeRow, Sheet } from "@/components/app/pieces";
import { CountBarChart, TrendChart } from "@/components/app/charts";
import { useApp } from "@/lib/app-state";
import { allowedChanges, summarize, trendBuckets } from "@/lib/derive";
import { brands, categories, currentPrice, productById, products, retailerById } from "@/lib/mock";
import { localizedCategory } from "@/lib/i18n";
import { formatAmd, formatDateTime, formatPct } from "@/lib/format";

export const Route = createFileRoute("/competitors/$retailerId")({
  head: () => ({
    meta: [
      { title: "Մրցակից — Price Monitor" },
      { name: "description", content: "Մրցակից խանութի գնային փոփոխությունները, պատմությունը և վերլուծությունը։" },
      { property: "og:title", content: "Competitor — Price Monitor" },
      { property: "og:description", content: "Competitor price changes, history and analytics." },
    ],
  }),
  component: CompetitorDetail,
});

type Tab = "recent" | "history" | "products" | "analytics";

function CompetitorDetail() {
  const { retailerId } = useParams({ from: "/competitors/$retailerId" });
  const { t, lang, visibleCompetitors, visibleCategories, visibleBrands, can } = useApp();
  const retailer = retailerById(retailerId);
  const [tab, setTab] = useState<Tab>("recent");
  const [query, setQuery] = useState("");
  const [dir, setDir] = useState<"all" | "down" | "up">("all");
  const [range, setRange] = useState<24 | 168 | 720>(168);
  const [sheet, setSheet] = useState(false);
  const [category, setCategory] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const [stock, setStock] = useState<"all" | "in" | "out">("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  const allowed = useMemo(
    () =>
      allowedChanges({
        competitors: visibleCompetitors,
        categories: visibleCategories,
        brands: visibleBrands,
      }).filter((c) => c.retailerId === retailerId),
    [visibleCompetitors, visibleCategories, visibleBrands, retailerId],
  );

  const filtered = useMemo(() => {
    const cutoff = Date.now() - (tab === "history" ? 24 * 30 : range) * 3600000;
    return allowed.filter((c) => {
      const p = productById(c.productId);
      if (!p) return false;
      if (+new Date(c.at) < cutoff) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (dir === "down" && c.diff >= 0) return false;
      if (dir === "up" && c.diff <= 0) return false;
      if (category !== "all" && p.category !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (stock === "in" && c.stock === "out") return false;
      if (stock === "out" && c.stock !== "out") return false;
      if (minPrice && c.newPrice < Number(minPrice)) return false;
      if (maxPrice && c.newPrice > Number(maxPrice)) return false;
      if (onlyDiscount && !c.discount) return false;
      if (onlyNew && !c.isNew) return false;
      return true;
    });
  }, [allowed, query, dir, range, tab, category, brand, stock, minPrice, maxPrice, onlyDiscount, onlyNew]);

  const s = summarize(allowed);

  if (!retailer || !visibleCompetitors.includes(retailer.id)) {
    return (
      <AppScreen>
        <TopBar title={t("no_access_title")} back="/competitors" />
        <AccessDenied backTo="/competitors" />
      </AppScreen>
    );
  }

  const productRows = products
    .filter((p) => visibleCategories.includes(p.category) && visibleBrands.includes(p.brand))
    .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppScreen>
      <TopBar
        title={retailer.name}
        back="/competitors"
        subtitle={
          <span className="flex items-center gap-1.5">
            <StatusDot status={retailer.status} />
            {t(retailer.status === "active" ? "active" : retailer.status === "paused" ? "paused" : "error")} ·{" "}
            {formatDateTime(retailer.lastUpdate, lang)} · {retailer.products.toLocaleString("en-US")}
          </span>
        }
      />

      <div className="grid grid-cols-3 gap-2">
        <MetricCard label={t("total_changes")} value={String(s.total)} />
        <MetricCard label={t("drops_24h")} value={String(s.drops)} tone="success" />
        <MetricCard label={t("raises_24h")} value={String(s.raises)} tone="danger" />
        <MetricCard label={t("new_products")} value={String(s.newProducts)} />
        <MetricCard label={t("out_of_stock")} value={String(s.outOfStock)} tone="warning" />
        <MetricCard label={t("avg_change_pct")} value={formatPct(s.avgPct)} tone={s.avgPct < 0 ? "success" : "danger"} />
      </div>

      <div className="mt-4">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: "recent", label: t("tab_recent") },
            { id: "history", label: t("tab_history") },
            { id: "products", label: t("tab_products") },
            { id: "analytics", label: t("tab_analytics") },
          ]}
        />
      </div>

      {tab === "analytics" && !can("analytics") ? (
        <div className="mt-4">
          <AccessDenied backTo="/competitors" />
        </div>
      ) : tab === "analytics" ? (
        <>
          <SectionTitle title={t("drops_vs_raises")} />
          <Card>
            <TrendChart data={trendBuckets(allowed, "week")} />
          </Card>
          <SectionTitle title={t("by_brand")} />
          <Card>
            <CountBarChart
              data={brands
                .filter((b) => visibleBrands.includes(b))
                .map((b) => ({
                  label: b,
                  value: allowed.filter((c) => productById(c.productId)?.brand === b).length,
                }))}
            />
          </Card>
        </>
      ) : (
        <>
          <div className="mt-4">
            <SearchBar value={query} onChange={setQuery} placeholder={t("search_product")} />
          </div>

          <div className="mt-3">
            <ChipRow>
              <Chip active={dir === "all"} onClick={() => setDir("all")}>
                {t("all")}
              </Chip>
              <Chip active={dir === "down"} onClick={() => setDir("down")}>
                ↓ {t("price_down")}
              </Chip>
              <Chip active={dir === "up"} onClick={() => setDir("up")}>
                ↑ {t("price_up")}
              </Chip>
              <Chip active={range === 24} onClick={() => setRange(24)}>
                24{t("day").slice(0, 1)}
              </Chip>
              <Chip active={range === 168} onClick={() => setRange(168)}>
                {t("week")}
              </Chip>
              <Chip active={range === 720} onClick={() => setRange(720)}>
                {t("month")}
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
            {tab === "products" ? (
              productRows.length ? (
                <ul className="space-y-2">
                  {productRows.map((p) => (
                    <li key={p.id}>
                      <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {p.brand} · {localizedCategory(lang, p.category, categories)}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatAmd(currentPrice(retailer.id, p.id))}
                        </span>
                      </Card>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoResults />
              )
            ) : filtered.length ? (
              <ul className="space-y-3">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <PriceChangeRow change={c} />
                  </li>
                ))}
              </ul>
            ) : query ? (
              <NoResults />
            ) : (
              <EmptyState />
            )}
          </div>
        </>
      )}

      <div className="mt-6">
        <Badge tone="outline">Cross-market համեմատություն — շուտով</Badge>
      </div>

      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        title={t("filters")}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <GhostButton
              onClick={() => {
                setCategory("all");
                setBrand("all");
                setStock("all");
                setMinPrice("");
                setMaxPrice("");
                setOnlyDiscount(false);
                setOnlyNew(false);
              }}
            >
              {t("reset")}
            </GhostButton>
            <PrimaryButton onClick={() => setSheet(false)}>{t("apply")}</PrimaryButton>
          </div>
        }
      >
        <div className="space-y-4 pb-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("category")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={category === "all"} onClick={() => setCategory("all")}>
                {t("all")}
              </Chip>
              {categories
                .filter((c) => visibleCategories.includes(c.id))
                .map((c) => (
                  <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                    {localizedCategory(lang, c.id, categories)}
                  </Chip>
                ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("brand")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={brand === "all"} onClick={() => setBrand("all")}>
                {t("all")}
              </Chip>
              {brands
                .filter((b) => visibleBrands.includes(b))
                .map((b) => (
                  <Chip key={b} active={brand === b} onClick={() => setBrand(b)}>
                    {b}
                  </Chip>
                ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("in_stock")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={stock === "all"} onClick={() => setStock("all")}>
                {t("all")}
              </Chip>
              <Chip active={stock === "in"} onClick={() => setStock("in")}>
                {t("in_stock")}
              </Chip>
              <Chip active={stock === "out"} onClick={() => setStock("out")}>
                {t("out_of_stock")}
              </Chip>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted-foreground">
              {t("min_price")}
              <input
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-surface px-3 text-sm text-foreground outline-none"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              {t("max_price")}
              <input
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-surface px-3 text-sm text-foreground outline-none"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={onlyDiscount} onClick={() => setOnlyDiscount((v) => !v)}>
              {t("discounted")}
            </Chip>
            <Chip active={onlyNew} onClick={() => setOnlyNew((v) => !v)}>
              {t("new_products")}
            </Chip>
          </div>
        </div>
      </Sheet>
    </AppScreen>
  );
}