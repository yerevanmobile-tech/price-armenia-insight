import {
  priceChanges,
  productById,
  retailers,
  type PriceChange,
  type RetailerId,
} from "./mock";

export type Access = {
  competitors: RetailerId[];
  categories: string[];
  brands: string[];
};

export function allowedChanges(access: Access): PriceChange[] {
  return priceChanges.filter((c) => {
    if (!access.competitors.includes(c.retailerId)) return false;
    const p = productById(c.productId);
    if (!p) return false;
    return access.categories.includes(p.category) && access.brands.includes(p.brand);
  });
}

export function withinHours(changes: PriceChange[], hours: number) {
  const cutoff = Date.now() - hours * 3600000;
  return changes.filter((c) => +new Date(c.at) >= cutoff);
}

export function summarize(changes: PriceChange[]) {
  const drops = changes.filter((c) => c.diff < 0);
  const raises = changes.filter((c) => c.diff > 0);
  const avgPct =
    changes.length === 0 ? 0 : changes.reduce((s, c) => s + c.pct, 0) / changes.length;
  return {
    total: changes.length,
    drops: drops.length,
    raises: raises.length,
    outOfStock: changes.filter((c) => c.stock === "out").length,
    newProducts: changes.filter((c) => c.isNew).length,
    avgPct,
  };
}

export function visibleRetailers(ids: RetailerId[]) {
  return retailers.filter((r) => ids.includes(r.id));
}

export function trendBuckets(changes: PriceChange[], period: "day" | "week" | "month") {
  const buckets = period === "day" ? 8 : period === "week" ? 7 : 6;
  const spanMs = period === "day" ? 3 * 3600000 : period === "week" ? 86400000 : 5 * 86400000;
  const out: { label: string; drops: number; raises: number }[] = [];
  for (let i = buckets - 1; i >= 0; i--) {
    const end = Date.now() - i * spanMs;
    const start = end - spanMs;
    const inBucket = changes.filter((c) => {
      const ts = +new Date(c.at);
      return ts >= start && ts < end;
    });
    const d = new Date(end);
    out.push({
      label:
        period === "day"
          ? `${String(d.getHours()).padStart(2, "0")}:00`
          : `${d.getDate()}.${d.getMonth() + 1}`,
      drops: inBucket.filter((c) => c.diff < 0).length,
      raises: inBucket.filter((c) => c.diff > 0).length,
    });
  }
  return out;
}