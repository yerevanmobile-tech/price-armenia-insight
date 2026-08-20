import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { AppScreen } from "@/components/app/guard";
import {
  AccessDenied,
  Chip,
  ChipRow,
  EmptyState,
  NoResults,
  SearchBar,
  SkeletonList,
  TopBar,
} from "@/components/app/kit";
import { CompetitorCard, Sheet } from "@/components/app/pieces";
import { useApp } from "@/lib/app-state";
import { visibleRetailers } from "@/lib/derive";

export const Route = createFileRoute("/competitors/")({
  head: () => ({
    meta: [
      { title: "Շուկաներ — Price Monitor" },
      { name: "description", content: "Ձեզ հասանելի մրցակից խանութների ցանկը և օրվա փոփոխությունները։" },
      { property: "og:title", content: "Competitors — Price Monitor" },
      { property: "og:description", content: "Your assigned competitor stores." },
    ],
  }),
  component: CompetitorsList,
});

type Sort = "changes" | "name" | "drops";

function CompetitorsList() {
  const { t, visibleCompetitors, activeCompany, can } = useApp();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("changes");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");
  const [sheet, setSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const list = useMemo(() => {
    let items = visibleRetailers(visibleCompetitors);
    if (statusFilter !== "all") items = items.filter((r) => r.status === statusFilter);
    if (query.trim()) items = items.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()));
    items = [...items].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : sort === "drops" ? b.drops - a.drops : b.changes24h - a.changes24h,
    );
    return items;
  }, [visibleCompetitors, query, sort, statusFilter]);

  if (!can("dashboard")) {
    return (
      <AppScreen>
        <TopBar title={t("competitors")} />
        <AccessDenied backTo="/settings" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <TopBar
        title={t("competitors")}
        subtitle={activeCompany?.name}
        right={
          <button
            onClick={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1200);
            }}
            aria-label={t("refreshing")}
            className="grid size-10 place-items-center rounded-2xl border border-border bg-surface"
          >
            <RefreshCw className={refreshing ? "size-4 animate-spin text-primary" : "size-4 text-muted-foreground"} />
          </button>
        }
      />

      <SearchBar value={query} onChange={setQuery} placeholder={t("search_competitor")} />

      <div className="mt-3">
        <ChipRow>
          <Chip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
            {t("all")}
          </Chip>
          <Chip active={statusFilter === "active"} onClick={() => setStatusFilter("active")}>
            {t("active")}
          </Chip>
          <Chip active={statusFilter === "paused"} onClick={() => setStatusFilter("paused")}>
            {t("paused")}
          </Chip>
          <Chip onClick={() => setSheet(true)}>
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="size-3.5" />
              {t("sort")}
            </span>
          </Chip>
        </ChipRow>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {refreshing ? t("refreshing") : t("pull_refresh")}
      </p>

      <div className="mt-3">
        {refreshing ? (
          <SkeletonList rows={3} />
        ) : list.length === 0 ? (
          query ? (
            <NoResults />
          ) : (
            <EmptyState />
          )
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li key={r.id}>
                <CompetitorCard retailer={r} limited={!can("analytics")} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title={t("sort")}>
        <div className="space-y-2">
          {(
            [
              { id: "changes", label: t("changes_24h") },
              { id: "drops", label: t("drops_24h") },
              { id: "name", label: t("competitors") },
            ] as { id: Sort; label: string }[]
          ).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSort(o.id);
                setSheet(false);
              }}
              className={
                "flex h-12 w-full items-center rounded-2xl border px-4 text-sm " +
                (sort === o.id ? "border-primary bg-accent text-accent-foreground" : "border-border bg-surface")
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      </Sheet>
    </AppScreen>
  );
}