import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/guard";
import { AccessDenied, Badge, Card, Chip, GhostButton, PrimaryButton, SectionTitle, TopBar } from "@/components/app/kit";
import { Sheet } from "@/components/app/pieces";
import { useApp } from "@/lib/app-state";
import { alertRules, retailerById, type AlertType } from "@/lib/mock";

export const Route = createFileRoute("/alerts/rules")({
  head: () => ({
    meta: [
      { title: "Ծանուցման կանոններ — Price Monitor" },
      { name: "description", content: "Ստեղծեք և կառավարեք գնային ծանուցումների կանոնները։" },
      { property: "og:title", content: "Alert rules — Price Monitor" },
      { property: "og:description", content: "Create and manage price alert rules." },
    ],
  }),
  component: RulesScreen,
});

const ruleTypes: AlertType[] = ["price_drop", "price_up", "cheaper", "out_of_stock", "discount", "large_change"];

function RulesScreen() {
  const { t, can, visibleCompetitors } = useApp();
  const [rules, setRules] = useState(alertRules);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>("price_drop");
  const [retailer, setRetailer] = useState<string>(visibleCompetitors[0] ?? "zigzag");
  const [pct, setPct] = useState(5);
  const [channel, setChannel] = useState<"push" | "email" | "both">("push");

  if (!can("alert_rules")) {
    return (
      <AppScreen>
        <TopBar title={t("alert_rules")} back="/alerts" />
        <AccessDenied backTo="/alerts" />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <TopBar
        title={t("alert_rules")}
        back="/alerts"
        right={
          <button
            onClick={() => setOpen(true)}
            aria-label={t("new_rule")}
            className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground"
          >
            <Plus className="size-4" />
          </button>
        }
      />

      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r.id}>
            <Card>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-semibold break-words">{r.name}</p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {retailerById(r.retailerId)?.name} · {r.scope}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={r.enabled}
                  aria-label={t(r.enabled ? "enabled" : "disabled")}
                  onClick={() =>
                    setRules((cur) => cur.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${r.enabled ? "bg-primary" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-0.5 size-5 rounded-full bg-surface transition-all ${r.enabled ? "left-[22px]" : "left-0.5"}`}
                  />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="outline">{t(`at_${r.type}`)}</Badge>
                <Badge tone="outline">{t("threshold_pct")}: {r.pct}%</Badge>
                <Badge tone="outline">{t("threshold_amd")}: {r.amd.toLocaleString("ru-RU")}</Badge>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Sheet open={open} onClose={() => setOpen(false)} title={t("new_rule")}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("event_type")}</p>
            <div className="flex flex-wrap gap-2">
              {ruleTypes.map((ty) => (
                <Chip key={ty} active={type === ty} onClick={() => setType(ty)}>
                  {t(`at_${ty}`)}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("competitors")}</p>
            <div className="flex flex-wrap gap-2">
              {visibleCompetitors.map((id) => (
                <Chip key={id} active={retailer === id} onClick={() => setRetailer(id)}>
                  {retailerById(id)?.name}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {t("threshold_pct")}: {pct}%
            </p>
            <input
              type="range"
              min={1}
              max={30}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("notification")}</p>
            <div className="flex flex-wrap gap-2">
              {(["push", "email", "both"] as const).map((c) => (
                <Chip key={c} active={channel === c} onClick={() => setChannel(c)}>
                  {c === "push" ? "Push" : c === "email" ? "Email" : "Push + Email"}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-2 pt-1">
            <PrimaryButton
              onClick={() => {
                setRules((cur) => [
                  {
                    id: `r${cur.length + 1}`,
                    name: `${retailerById(retailer)?.name ?? ""} — ${pct}%`,
                    retailerId: retailer as (typeof alertRules)[number]["retailerId"],
                    scope: t("all"),
                    type,
                    pct,
                    amd: pct * 5000,
                    enabled: true,
                  },
                  ...cur,
                ]);
                setOpen(false);
                toast.success(t("rule_saved"));
              }}
            >
              {t("save")}
            </PrimaryButton>
            <GhostButton onClick={() => setOpen(false)}>{t("cancel")}</GhostButton>
          </div>
        </div>
      </Sheet>
    </AppScreen>
  );
}