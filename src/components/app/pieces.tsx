import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Minus, PackageX, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";
import { formatAmd, formatDateTime, formatPct, formatSignedAmd } from "@/lib/format";
import { categories, productById, retailerById, type PriceChange, type Retailer } from "@/lib/mock";
import { localizedCategory } from "@/lib/i18n";
import { Badge, Card, RetailerAvatar, StatusDot } from "./kit";

export function PriceChangeRow({ change, showRetailer }: { change: PriceChange; showRetailer?: boolean }) {
  const { t, lang } = useApp();
  const product = productById(change.productId);
  const retailer = retailerById(change.retailerId);
  const down = change.diff < 0;
  const flat = change.diff === 0;
  const Icon = flat ? Minus : down ? ArrowDownRight : ArrowUpRight;
  const tone = flat ? "text-muted-foreground" : down ? "text-success" : "text-danger";

  return (
    <Link
      to="/product/$retailerId/$productId"
      params={{ retailerId: change.retailerId, productId: change.productId }}
      className="block"
    >
      <Card className="p-3.5">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-[10px] text-muted-foreground">
            IMG
          </div>
          <div className="min-w-0">
            <p className="text-sm leading-snug font-semibold break-words">{product?.name}</p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              {product?.brand} · {localizedCategory(lang, product?.category ?? "", categories)}
              {showRetailer ? ` · ${retailer?.name}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground line-through">{formatAmd(change.oldPrice)}</p>
            <p className="text-base font-semibold tabular-nums">{formatAmd(change.newPrice)}</p>
          </div>
          <div className={cn("shrink-0 text-right", tone)}>
            <p className="flex items-center justify-end gap-1 text-sm font-semibold tabular-nums">
              <Icon className="size-4" />
              {formatPct(change.pct)}
            </p>
            <p className="text-xs tabular-nums">{formatSignedAmd(change.diff)}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone={flat ? "neutral" : down ? "success" : "danger"}>
            {flat ? "—" : down ? t("price_down") : t("price_up")}
          </Badge>
          {change.stock === "out" ? (
            <Badge tone="warning" icon={PackageX}>
              {t("out_of_stock")}
            </Badge>
          ) : change.stock === "back" ? (
            <Badge tone="success" icon={RefreshCw}>
              {t("back_in_stock")}
            </Badge>
          ) : null}
          {change.discount ? <Badge tone="primary">{t("discount")}</Badge> : null}
          {change.isNew ? <Badge tone="primary">{t("new_products")}</Badge> : null}
          <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
            {formatDateTime(change.at, lang)}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function CompetitorCard({
  retailer,
  limited,
}: {
  retailer: Retailer;
  limited?: boolean;
}) {
  const { t, lang } = useApp();
  return (
    <Link to="/competitors/$retailerId" params={{ retailerId: retailer.id }} className="block">
      <Card>
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <RetailerAvatar initials={retailer.initials} tone={retailer.tone} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold">{retailer.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {retailer.products.toLocaleString("en-US")} · {t("total_products")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            <StatusDot status={retailer.status} />
            {t(retailer.status === "active" ? "active" : retailer.status === "paused" ? "paused" : "error")}
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-4 gap-2 rounded-2xl bg-surface-2 p-2.5">
          <MiniStat label={t("changes_24h")} value={String(retailer.changes24h)} />
          <MiniStat label={t("drops_24h")} value={`↓${retailer.drops}`} tone="success" />
          <MiniStat label={t("raises_24h")} value={`↑${retailer.raises}`} tone="danger" />
          <MiniStat label={t("out_of_stock")} value={String(retailer.outOfStock)} tone="warning" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone={limited ? "warning" : "success"} icon={limited ? ShieldAlert : ShieldCheck}>
            {limited ? t("limited_access") : t("full_access")}
          </Badge>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {t("last_update")}: {formatDateTime(retailer.lastUpdate, lang)}
          </span>
        </div>
      </Card>
    </Link>
  );
}

function MiniStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "danger" | "warning";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : tone === "warning"
          ? "text-warning-foreground"
          : "text-foreground";
  return (
    <div className="min-w-0 text-center">
      <p className={cn("text-sm font-semibold tabular-nums", color)}>{value}</p>
      <p className="mt-0.5 truncate text-[9px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]"
      />
      <div className="relative max-h-[85dvh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl border border-border bg-surface pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="sticky top-0 z-10 bg-surface px-4 pt-3 pb-2">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
          <h3 className="mt-3 text-base font-semibold">{title}</h3>
        </div>
        <div className="px-4 pb-4">{children}</div>
        {footer ? <div className="sticky bottom-0 bg-surface px-4 pt-2 pb-2">{footer}</div> : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useApp();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-6">
      <button aria-label="close" onClick={onCancel} className="absolute inset-0 bg-navy/50" />
      <div className="relative w-full max-w-[360px] rounded-3xl border border-border bg-surface p-5">
        <h3 className="text-base font-semibold">{title}</h3>
        {body ? <p className="mt-2 text-sm text-muted-foreground">{body}</p> : null}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={onCancel}
            className="h-11 rounded-2xl border border-border text-sm font-medium"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="h-11 rounded-2xl bg-danger text-sm font-semibold text-danger-foreground"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}