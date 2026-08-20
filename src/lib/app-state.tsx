import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate, type Lang } from "./i18n";
import {
  alerts as seedAlerts,
  companies,
  companyById,
  users as seedUsers,
  type AppUser,
  type Feature,
  type RetailerId,
} from "./mock";

type Theme = "light" | "dark" | "system";

type Session = { userId: string; companyId: string | null };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  theme: Theme;
  setTheme: (t: Theme) => void;
  hydrated: boolean;
  session: Session | null;
  user: AppUser | null;
  users: AppUser[];
  updateUser: (id: string, patch: Partial<AppUser>) => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  setActiveCompany: (id: string | null) => void;
  activeCompany: ReturnType<typeof companyById> | undefined;
  can: (f: Feature) => boolean;
  visibleCompetitors: RetailerId[];
  visibleCategories: string[];
  visibleBrands: string[];
  readAlerts: string[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  simulate: string | null;
  setSimulate: (s: string | null) => void;
};

const AppContext = createContext<Ctx | null>(null);
const KEY = "pm.session.v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hy");
  const [theme, setThemeState] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<AppUser[]>(seedUsers);
  const [readAlerts, setReadAlerts] = useState<string[]>(
    seedAlerts.filter((a) => a.read).map((a) => a.id),
  );
  const [simulate, setSimulate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lang) setLangState(parsed.lang);
        if (parsed.theme) setThemeState(parsed.theme);
        if (parsed.session) setSession(parsed.session);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Partial<{ lang: Lang; theme: Theme; session: Session | null }>) => {
    try {
      const raw = localStorage.getItem(KEY);
      const cur = raw ? JSON.parse(raw) : {};
      localStorage.setItem(KEY, JSON.stringify({ ...cur, ...next }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "system" && prefersDark);
    root.classList.toggle("dark", dark);
  }, [theme, hydrated]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      persist({ lang: l });
    },
    [persist],
  );
  const setTheme = useCallback(
    (v: Theme) => {
      setThemeState(v);
      persist({ theme: v });
    },
    [persist],
  );

  const user = useMemo(
    () => (session ? (users.find((u) => u.id === session.userId) ?? null) : null),
    [session, users],
  );

  const activeCompany = useMemo(() => {
    const id = session?.companyId ?? user?.companyId ?? null;
    return id ? companyById(id) : undefined;
  }, [session, user]);

  const login: Ctx["login"] = useCallback(
    (email, password) => {
      const found = seedUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found || found.password !== password) return { ok: false, error: "err_credentials" };
      if (!found.active) return { ok: false, error: "err_suspended" };
      const company = found.companyId ? companyById(found.companyId) : undefined;
      if (company && company.status === "suspended") return { ok: false, error: "err_suspended" };
      const next = { userId: found.id, companyId: found.companyId };
      setSession(next);
      persist({ session: next });
      return { ok: true };
    },
    [persist],
  );

  const logout = useCallback(() => {
    setSession(null);
    persist({ session: null });
  }, [persist]);

  const setActiveCompany = useCallback(
    (id: string | null) => {
      setSession((s) => {
        if (!s) return s;
        const next = { ...s, companyId: id };
        persist({ session: next });
        return next;
      });
    },
    [persist],
  );

  const updateUser = useCallback((id: string, patch: Partial<AppUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const companyFeatures = activeCompany?.features ?? [];
  const companyCompetitors = activeCompany?.competitors ?? [];

  const can = useCallback(
    (f: Feature) => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      return companyFeatures.includes(f) && user.features.includes(f);
    },
    [user, companyFeatures],
  );

  const visibleCompetitors = useMemo<RetailerId[]>(() => {
    if (!user) return [];
    if (user.role === "super_admin") {
      return activeCompany ? activeCompany.competitors : [];
    }
    return user.competitors.filter((c) => companyCompetitors.includes(c));
  }, [user, activeCompany, companyCompetitors]);

  const visibleCategories = useMemo(() => (user ? user.categories : []), [user]);
  const visibleBrands = useMemo(() => (user ? user.brands : []), [user]);

  const markRead = useCallback(
    (id: string) => setReadAlerts((p) => (p.includes(id) ? p : [...p, id])),
    [],
  );
  const markAllRead = useCallback(() => setReadAlerts(seedAlerts.map((a) => a.id)), []);

  const unreadCount = useMemo(
    () =>
      seedAlerts.filter(
        (a) => !readAlerts.includes(a.id) && visibleCompetitors.includes(a.retailerId),
      ).length,
    [readAlerts, visibleCompetitors],
  );

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value: Ctx = {
    lang,
    setLang,
    t,
    theme,
    setTheme,
    hydrated,
    session,
    user,
    users,
    updateUser,
    login,
    logout,
    setActiveCompany,
    activeCompany,
    can,
    visibleCompetitors,
    visibleCategories,
    visibleBrands,
    readAlerts,
    markRead,
    markAllRead,
    unreadCount,
    simulate,
    setSimulate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const allCompanies = companies;