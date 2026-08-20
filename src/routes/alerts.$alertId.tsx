import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/guard";
import { AccessDenied, Badge, Card, GhostButton, PrimaryButton, SectionTitle, TopBar } from "@/components/app/kit";
import { useApp } from "@/lib/app-state";
import { alerts, categories, currentPrice, productById, retailerById } from "@/lib/mock";
import { localizedCategory } from "@/lib/i18n";
import { formatAmd, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/alerts/$alertId")({
  head: () => ({
    meta: [
      { title: "Ծանուցում — Price Monitor" },
      { name: "description", content: "Ծանուցման մանրամասները և կապված ապրանքը։" },
      { property: "og:title", content: "Alert — Price Monitor" },
      { property: "og:description", content: "Alert details and related product." },
    ],
  }),
  component: AlertDetail,
});

function AlertDetail() {
  const { alertId } = useParams({ from: "/alerts/$alertId" });
  const { t, lang, visibleCompetitors, readAlerts, markRead, can } = useApp();
  const alert = alerts.find((a) => a.id === alertId);

  if (!alert || !visibleCompetitors.includes(alert.retailerId) || !can("alerts")) {
    return (
      <AppScreen>
        <TopBar title={t("no_access_title")} back="/alerts" />
        <AccessDenied backTo="/alerts" />
      </AppScreen>
    );
  }

  const product = productById(alert.productId);
  const retailer = retailerById(alert.retailerId);
  const unread = !readAlerts.includes(alert.id);

  return (
    <AppScreen>
      <TopBar title={t(`at_${alert.type}`)} back="/alerts" subtitle={retailer?.name} />

      <Card>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={alert.severity === "high" ? "danger" : alert.severity === "medium" ? "warning" : "neutral"} icon={Bell}>
            {t("severity")}: {t(alert.severity)}
          </Badge>
          <Badge tone={unread ? "primary" : "outline"}>{t(unread ? "unread" : "read")}</Badge>
        </div>
        <p className="mt-4 text-sm leading-relaxed">
          {retailer?.name} — {product?.name}. {t(`at_${alert.type}`)}.
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">{formatDateTime(alert.at, lang)}</p>
      </Card>

      <SectionTitle title={t("tab_products")} />
      <Card>
        <p className="text-sm font-semibold break-words">{product?.name}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {product?.brand} · {localizedCategory(lang, product?.category ?? "", categories)}
        </p>
        <p className="mt-3 text-lg font-semibold tabular-nums">
          {formatAmd(currentPrice(alert.retailerId, alert.productId))}
        </p>
        <Link
          to="/product/$retailerId/$productId"
          params={{ retailerId: alert.retailerId, productId: alert.productId }}
          className="mt-3 inline-flex text-xs font-medium text-primary"
        >
          {t("timeline")} →
        </Link>
      </Card>

      <div className="mt-6 grid gap-2">
        {unread ? (
          <PrimaryButton
            onClick={() => {
              markRead(alert.id);
              toast.success(t("saved"));
            }}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCheck className="size-4" /> {t("mark_read")}
            </span>
          </PrimaryButton>
        ) : null}
        {can("alert_rules") ? <GhostButton>{t("alert_rules")}</GhostButton> : null}
      </div>
    </AppScreen>
  );
}