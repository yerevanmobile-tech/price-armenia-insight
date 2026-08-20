import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Inbox,
  Loader2,
  Lock,
  Search,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh bg-background">
      <div className={cn("mx-auto w-full max-w-[430px] px-4", className)}>{children}</div>
    </div>
  );
}

export function TopBar({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: ReactNode;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-3 border-b border-border/70 bg-background/90 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        {back ? (
          <Link
            to={back as never}
            aria-label="back"
            className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
        ) : (
          <span className="size-0" />
        )}
        <div className="min-w-0">
          <h1 className="truncate text-[17px] leading-tight font-semibold">{title}</h1>
          {subtitle ? (
            <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
          ) : null}
        </div>
        <div className="shrink-0">{right}</div>
      </div>
    </header>
  );
}

export function Card({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "rounded-3xl border border-border bg-surface p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-16px_rgba(16,24,40,0.25)]",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mt-6 mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <h2 className="truncate text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {action}
    </div>
  );
}

const toneMap = {
  neutral: "bg-secondary text-secondary-foreground border-transparent",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning-foreground border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  primary: "bg-accent text-accent-foreground border-transparent",
  outline: "bg-transparent text-muted-foreground border-border",
};

export function Badge({
  children,
  tone = "neutral",
  icon: Icon,
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof toneMap;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] leading-tight font-medium",
        toneMap[tone],
        className,
      )}
    >
      {Icon ? <Icon className="size-3 shrink-0" /> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function StatusDot({ status }: { status: "active" | "paused" | "error" | "suspended" }) {
  const color =
    status === "active"
      ? "bg-success"
      : status === "paused"
        ? "bg-warning"
        : status === "error"
          ? "bg-danger"
          : "bg-muted-foreground";
  return <span className={cn("inline-block size-2 shrink-0 rounded-full", color)} />;
}

export function RoleBadge({ role }: { role: "super_admin" | "company_admin" | "viewer" }) {
  const { t } = useApp();
  return (
    <Badge tone={role === "viewer" ? "neutral" : "primary"}>
      {t(role === "super_admin" ? "role_super_admin" : role === "company_admin" ? "role_company_admin" : "role_viewer")}
    </Badge>
  );
}

const avatarTones: Record<string, string> = {
  indigo: "bg-accent text-accent-foreground",
  red: "bg-danger-soft text-danger",
  teal: "bg-success-soft text-success",
  amber: "bg-warning-soft text-warning-foreground",
  violet: "bg-secondary text-secondary-foreground",
};

export function RetailerAvatar({
  initials,
  tone = "indigo",
  size = "md",
}: {
  initials: string;
  tone?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl font-semibold",
        size === "md" ? "size-11 text-sm" : "size-9 text-xs",
        avatarTones[tone] ?? avatarTones["indigo"],
      )}
    >
      {initials}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "success" | "danger" | "warning" | "primary";
  icon?: LucideIcon;
}) {
  const valueTone =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : tone === "warning"
          ? "text-warning-foreground"
          : tone === "primary"
            ? "text-primary"
            : "text-foreground";
  return (
    <Card className="p-3.5">
      <div className="flex min-w-0 items-start gap-2">
        {Icon ? <Icon className={cn("mt-0.5 size-4 shrink-0", valueTone)} /> : null}
        <p className="min-w-0 text-[11px] leading-snug break-words text-muted-foreground">{label}</p>
      </div>
      <p className={cn("mt-2 text-xl font-semibold tabular-nums", valueTone)}>{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-surface px-3.5">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5">{children}</div>;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "h-9 min-w-0 flex-1 shrink-0 rounded-xl px-3 text-xs font-medium whitespace-nowrap transition-colors",
            value === o.id ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function StateBlock({
  icon: Icon,
  title,
  body,
  action,
  tone = "muted",
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <Card className="flex flex-col items-center px-6 py-10 text-center">
      <span
        className={cn(
          "grid size-14 place-items-center rounded-2xl",
          tone === "danger" ? "bg-danger-soft text-danger" : "bg-secondary text-muted-foreground",
        )}
      >
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {body ? <p className="mt-1.5 text-sm text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function EmptyState({ title, body }: { title?: string; body?: string }) {
  const { t } = useApp();
  return <StateBlock icon={Inbox} title={title ?? t("empty_title")} body={body ?? t("empty_body")} />;
}

export function NoResults() {
  const { t } = useApp();
  return <StateBlock icon={Search} title={t("no_results")} body={t("empty_body")} />;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useApp();
  return (
    <StateBlock
      icon={AlertTriangle}
      tone="danger"
      title={t("network_error")}
      body={t("err_server")}
      action={
        onRetry ? (
          <button
            onClick={onRetry}
            className="h-11 rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            {t("try_again")}
          </button>
        ) : null
      }
    />
  );
}

export function OfflineState() {
  const { t } = useApp();
  return <StateBlock icon={WifiOff} tone="danger" title={t("err_offline")} body={t("offline_banner")} />;
}

export function AccessDenied({ backTo = "/dashboard" }: { backTo?: string }) {
  const { t } = useApp();
  return (
    <StateBlock
      icon={Lock}
      tone="danger"
      title={t("no_access_title")}
      body={t("no_access_body")}
      action={
        <Link
          to={backTo}
          className="inline-flex h-11 items-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          {t("back")}
        </Link>
      }
    />
  );
}

export function SuspendedState() {
  const { t } = useApp();
  return <StateBlock icon={Ban} tone="danger" title={t("suspended")} body={t("err_suspended")} />;
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-secondary" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded bg-secondary" />
              <div className="h-3 w-1/3 rounded bg-secondary" />
            </div>
          </div>
          <div className="mt-4 h-3 w-full rounded bg-secondary" />
        </Card>
      ))}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function Row({
  label,
  value,
  onClick,
  to,
  icon: Icon,
  danger,
  right,
}: {
  label: string;
  value?: ReactNode;
  onClick?: () => void;
  to?: string;
  icon?: LucideIcon;
  danger?: boolean;
  right?: ReactNode;
}) {
  const inner = (
    <div className="grid min-h-[52px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
      {Icon ? (
        <Icon className={cn("size-4 shrink-0", danger ? "text-danger" : "text-muted-foreground")} />
      ) : (
        <span />
      )}
      <span className={cn("min-w-0 text-sm", danger ? "text-danger" : "text-foreground")}>{label}</span>
      <span className="shrink-0 text-right text-xs text-muted-foreground">{right ?? value}</span>
    </div>
  );
  if (to)
    return (
      <Link to={to as never} className="block border-b border-border/60 last:border-0">
        {inner}
      </Link>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className="block w-full border-b border-border/60 text-left last:border-0">
        {inner}
      </button>
    );
  return <div className="border-b border-border/60 last:border-0">{inner}</div>;
}

export function List({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface">{children}</div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 w-full rounded-2xl border border-border bg-surface text-sm font-medium text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}