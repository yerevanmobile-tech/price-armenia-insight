import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { languages } from "@/lib/i18n";
import { Card } from "@/components/app/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Մուտք — Price Monitor" },
      { name: "description", content: "Մուտք գործեք ձեր ընկերության մասնավոր աշխատանքային տարածք։" },
      { property: "og:title", content: "Sign in — Price Monitor" },
      { property: "og:description", content: "Sign in to your company's private workspace." },
    ],
  }),
  component: AuthScreen,
});

type ErrKind = "err_credentials" | "err_rate" | "err_offline" | "err_server" | "err_expired" | "err_suspended" | null;

function AuthScreen() {
  const { t, lang, setLang, login, session, user, hydrated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@redstore.am");
  const [password, setPassword] = useState("1234");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<ErrKind>(null);

  useEffect(() => {
    if (hydrated && session && user) {
      void navigate({ to: user.role === "super_admin" && !session.companyId ? "/select-company" : "/dashboard" });
    }
  }, [hydrated, session, user, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (attempts >= 3) {
        setError("err_rate");
        return;
      }
      if (email.toLowerCase() === "offline@demo.am") return setError("err_offline");
      if (email.toLowerCase() === "server@demo.am") return setError("err_server");
      if (email.toLowerCase() === "expired@demo.am") return setError("err_expired");
      const res = login(email, password);
      if (!res.ok) {
        setAttempts((a) => a + 1);
        setError((res.error as ErrKind) ?? "err_credentials");
        return;
      }
      void navigate({ to: email.toLowerCase().startsWith("super@") ? "/select-company" : "/dashboard" });
    }, 900);
  }

  const demo = [
    { email: "super@pricemonitor.am", role: "role_super_admin" },
    { email: "admin@redstore.am", role: "role_company_admin" },
    { email: "viewer@redstore.am", role: "role_viewer" },
  ];

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-end">
          <div className="flex gap-1 rounded-2xl bg-surface-2 p-1">
            {languages.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={cn(
                  "h-8 rounded-xl px-3 text-[11px] font-semibold",
                  lang === l.id ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                {l.short}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <span className="grid size-14 place-items-center rounded-3xl bg-primary text-primary-foreground">
            <Activity className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Price Monitor</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-12 w-full rounded-2xl border border-border bg-surface px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("password")}</label>
            <div className="flex h-12 items-center rounded-2xl border border-border bg-surface pr-2 pl-4 focus-within:border-primary">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? t("hide") : t("show")}
                className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-xs text-danger">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{t(error)}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? t("logging_in") : t("login")}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          {t("no_registration")}
        </p>

        <Card className="mt-auto p-3.5">
          <p className="text-[11px] font-semibold text-muted-foreground">{t("demo_accounts")} · 1234</p>
          <div className="mt-2 space-y-1.5">
            {demo.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => {
                  setEmail(d.email);
                  setPassword("1234");
                  setError(null);
                }}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-left"
              >
                <span className="truncate text-[11px]">{d.email}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">{t(d.role)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}