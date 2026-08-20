import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Globe, LogOut, Moon, Shield, ShieldCheck, Sun, SunMoon } from "lucide-react";
import { AppScreen } from "@/components/app/guard";
import { Badge, Card, GhostButton, RoleBadge, SectionTitle, Segmented, TopBar } from "@/components/app/kit";
import { useApp } from "@/lib/app-state";
import { categories } from "@/lib/mock";
import { localizedCategory, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Կարգավորումներ — Price Monitor" },
      { name: "description", content: "Պրոֆիլ, լեզու, տեսք և հասանելիության ամփոփում։" },
      { property: "og:title", content: "Settings — Price Monitor" },
      { property: "og:description", content: "Profile, language, appearance and access summary." },
    ],
  }),
  component: SettingsScreen,
});

function SettingsScreen() {
  const {
    t,
    lang,
    setLang,
    theme,
    setTheme,
    user,
    activeCompany,
    logout,
    can,
    visibleCompetitors,
    visibleCategories,
    visibleBrands,
  } = useApp();
  const navigate = useNavigate();

  return (
    <AppScreen>
      <TopBar title={t("nav_settings")} />

      <Card>
        <p className="text-sm font-semibold">{user?.name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{user?.email}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {user ? <RoleBadge role={user.role} /> : null}
          {activeCompany ? <Badge tone="outline">{activeCompany.name}</Badge> : null}
        </div>
      </Card>

      <SectionTitle title={t("language")} />
      <Card>
        <Segmented
          value={lang}
          onChange={(v) => setLang(v as Lang)}
          options={[
            { id: "hy", label: "Հայերեն" },
            { id: "ru", label: "Русский" },
            { id: "en", label: "English" },
          ]}
        />
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Globe className="size-3.5" /> {t("app_version")} 0.9.0
        </p>
      </Card>

      <SectionTitle title={t("appearance")} />
      <Card>
        <Segmented
          value={theme}
          onChange={(v) => setTheme(v as "light" | "dark" | "system")}
          options={[
            { id: "light", label: t("theme_light") },
            { id: "dark", label: t("theme_dark") },
            { id: "system", label: t("theme_system") },
          ]}
        />
        <div className="mt-2 flex gap-3 text-muted-foreground">
          <Sun className="size-3.5" />
          <Moon className="size-3.5" />
          <SunMoon className="size-3.5" />
        </div>
      </Card>

      <SectionTitle title={t("effective_access")} />
      <Card className="space-y-3">
        <div>
          <p className="text-[11px] text-muted-foreground">{t("allowed_competitors")}</p>
          <p className="mt-1 text-sm font-medium">{visibleCompetitors.length}</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">{t("admin_category_visibility")}</p>
          <p className="mt-1 text-sm break-words">
            {visibleCategories.map((c) => localizedCategory(lang, c, categories)).join(", ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">{t("admin_brand_visibility")}</p>
          <p className="mt-1 text-sm break-words">{visibleBrands.join(", ") || "—"}</p>
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5" /> {t("permission_summary")}
        </p>
      </Card>

      {can("manage_users") ? (
        <>
          <SectionTitle title={t("administration")} />
          <Link to="/alerts/rules">
            <Card className="flex items-center gap-3">
              <Shield className="size-4 text-primary" />
              <span className="text-sm font-medium">{t("alert_rules")}</span>
            </Card>
          </Link>
        </>
      ) : null}

      <div className="mt-6">
        <GhostButton
          onClick={() => {
            logout();
            navigate({ to: "/auth" });
          }}
        >
          <span className="inline-flex items-center gap-2">
            <LogOut className="size-4" /> {t("logout")}
          </span>
        </GhostButton>
      </div>
    </AppScreen>
  );
}