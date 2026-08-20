export type RetailerId = "zigzag" | "redstore" | "vega" | "mobile-centre" | "yerevan-mobile";

export type Retailer = {
  id: RetailerId;
  name: string;
  initials: string;
  tone: "indigo" | "red" | "teal" | "amber" | "violet";
  products: number;
  changes24h: number;
  drops: number;
  raises: number;
  outOfStock: number;
  lastUpdate: string;
  status: "active" | "paused" | "error";
};

const now = Date.now();
const iso = (minutesAgo: number) => new Date(now - minutesAgo * 60000).toISOString();

export const retailers: Retailer[] = [
  {
    id: "zigzag",
    name: "Zigzag",
    initials: "ZZ",
    tone: "indigo",
    products: 1284,
    changes24h: 96,
    drops: 58,
    raises: 31,
    outOfStock: 7,
    lastUpdate: iso(12),
    status: "active",
  },
  {
    id: "vega",
    name: "Vega",
    initials: "VG",
    tone: "teal",
    products: 942,
    changes24h: 61,
    drops: 34,
    raises: 22,
    outOfStock: 5,
    lastUpdate: iso(24),
    status: "active",
  },
  {
    id: "mobile-centre",
    name: "Mobile Centre",
    initials: "MC",
    tone: "amber",
    products: 631,
    changes24h: 28,
    drops: 12,
    raises: 14,
    outOfStock: 2,
    lastUpdate: iso(140),
    status: "paused",
  },
  {
    id: "yerevan-mobile",
    name: "Yerevan Mobile",
    initials: "YM",
    tone: "violet",
    products: 488,
    changes24h: 19,
    drops: 9,
    raises: 8,
    outOfStock: 2,
    lastUpdate: iso(53),
    status: "active",
  },
  {
    id: "redstore",
    name: "RedStore",
    initials: "RS",
    tone: "red",
    products: 1102,
    changes24h: 74,
    drops: 41,
    raises: 26,
    outOfStock: 7,
    lastUpdate: iso(18),
    status: "active",
  },
];

export const retailerById = (id: string) => retailers.find((r) => r.id === id);

export const categories = [
  { id: "phones", hy: "Հեռախոսներ", ru: "Смартфоны", en: "Phones" },
  { id: "laptops", hy: "Նոութբուքեր", ru: "Ноутбуки", en: "Laptops" },
  { id: "tv", hy: "Հեռուստացույցներ", ru: "Телевизоры", en: "TV" },
  { id: "console", hy: "Խաղային կոնսոլներ", ru: "Консоли", en: "Consoles" },
  { id: "audio", hy: "Աուդիո", ru: "Аудио", en: "Audio" },
  { id: "tablets", hy: "Պլանշետներ", ru: "Планшеты", en: "Tablets" },
];

export const brands = ["Apple", "Samsung", "Sony", "LG", "ASUS", "Xiaomi", "Lenovo"];

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  base: number;
};

export const products: Product[] = [
  { id: "iphone16pro", name: "Apple iPhone 16 Pro 256GB", brand: "Apple", category: "phones", base: 559900 },
  { id: "s25ultra", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "phones", base: 749900 },
  { id: "ps5slim", name: "Sony PlayStation 5 Slim", brand: "Sony", category: "console", base: 259900 },
  { id: "oledc4", name: 'LG OLED C4 55"', brand: "LG", category: "tv", base: 689000 },
  { id: "rogg16", name: "ASUS ROG Zephyrus G16", brand: "ASUS", category: "laptops", base: 899900 },
  { id: "iphone16", name: "Apple iPhone 16 128GB", brand: "Apple", category: "phones", base: 399900 },
  { id: "xiaomi14", name: "Xiaomi 14T Pro 512GB", brand: "Xiaomi", category: "phones", base: 279900 },
  { id: "ipadair", name: "Apple iPad Air 11 128GB", brand: "Apple", category: "tablets", base: 319900 },
  { id: "wh1000", name: "Sony WH-1000XM5", brand: "Sony", category: "audio", base: 159900 },
  { id: "legion5", name: "Lenovo Legion 5 Pro RTX 4060", brand: "Lenovo", category: "laptops", base: 699900 },
  { id: "galaxybuds", name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "audio", base: 89900 },
  { id: "lgqned", name: 'LG QNED 65" 2025', brand: "LG", category: "tv", base: 499900 },
];

export const productById = (id: string) => products.find((p) => p.id === id);

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type PriceChange = {
  id: string;
  retailerId: RetailerId;
  productId: string;
  oldPrice: number;
  newPrice: number;
  diff: number;
  pct: number;
  at: string;
  stock: "in" | "out" | "back";
  discount: boolean;
  isNew: boolean;
};

function buildChanges(): PriceChange[] {
  const list: PriceChange[] = [];
  retailers.forEach((r) => {
    products.forEach((p, pi) => {
      const count = 3;
      for (let k = 0; k < count; k++) {
        const seed = hash(`${r.id}-${p.id}-${k}`);
        const dir = seed % 100 < 58 ? -1 : 1;
        const pctRaw = ((seed % 900) / 100 + 0.4) * dir;
        const oldPrice = Math.round((p.base * (1 + ((seed % 70) - 35) / 1000)) / 100) * 100;
        const newPrice = Math.round((oldPrice * (1 + pctRaw / 100)) / 100) * 100;
        const minutesAgo = ((seed % 55) + 1) * (k + 1) * 9 + pi;
        list.push({
          id: `${r.id}-${p.id}-${k}`,
          retailerId: r.id,
          productId: p.id,
          oldPrice,
          newPrice,
          diff: newPrice - oldPrice,
          pct: ((newPrice - oldPrice) / oldPrice) * 100,
          at: iso(minutesAgo),
          stock: seed % 17 === 0 ? "out" : seed % 23 === 0 ? "back" : "in",
          discount: seed % 5 === 0 && dir < 0,
          isNew: seed % 29 === 0,
        });
      }
    });
  });
  return list.sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

export const priceChanges = buildChanges();

export function changesFor(retailerId: string) {
  return priceChanges.filter((c) => c.retailerId === retailerId);
}

export function currentPrice(retailerId: string, productId: string) {
  const c = priceChanges.find((x) => x.retailerId === retailerId && x.productId === productId);
  return c ? c.newPrice : (productById(productId)?.base ?? 0);
}

export function priceHistory(retailerId: string, productId: string, days: number) {
  const p = productById(productId);
  const base = currentPrice(retailerId, productId) || p?.base || 100000;
  const pts: { date: string; price: number }[] = [];
  const step = Math.max(1, Math.round(days / 30));
  for (let i = days; i >= 0; i -= step) {
    const seed = hash(`${retailerId}-${productId}-${i}`);
    const wave = Math.sin(i / (days / 6)) * 0.035;
    const noise = ((seed % 40) - 20) / 1600;
    pts.push({
      date: new Date(now - i * 86400000).toISOString(),
      price: Math.round((base * (1 + wave + noise)) / 100) * 100,
    });
  }
  pts[pts.length - 1] = { date: new Date(now).toISOString(), price: base };
  return pts;
}

export type AlertType =
  | "price_drop"
  | "price_up"
  | "cheaper"
  | "out_of_stock"
  | "back_in_stock"
  | "new_product"
  | "discount"
  | "large_change";

export type AlertItem = {
  id: string;
  type: AlertType;
  severity: "high" | "medium" | "low";
  retailerId: RetailerId;
  productId: string;
  at: string;
  read: boolean;
};

export const alerts: AlertItem[] = [
  { id: "a1", type: "cheaper", severity: "high", retailerId: "zigzag", productId: "iphone16pro", at: iso(22), read: false },
  { id: "a2", type: "price_drop", severity: "high", retailerId: "vega", productId: "s25ultra", at: iso(48), read: false },
  { id: "a3", type: "large_change", severity: "high", retailerId: "zigzag", productId: "oledc4", at: iso(95), read: false },
  { id: "a4", type: "out_of_stock", severity: "medium", retailerId: "yerevan-mobile", productId: "ps5slim", at: iso(180), read: false },
  { id: "a5", type: "discount", severity: "medium", retailerId: "vega", productId: "wh1000", at: iso(320), read: true },
  { id: "a6", type: "new_product", severity: "low", retailerId: "mobile-centre", productId: "xiaomi14", at: iso(500), read: true },
  { id: "a7", type: "price_up", severity: "medium", retailerId: "zigzag", productId: "rogg16", at: iso(720), read: true },
  { id: "a8", type: "back_in_stock", severity: "low", retailerId: "vega", productId: "ipadair", at: iso(1500), read: true },
];

export const alertRules = [
  { id: "r1", name: "iPhone 16 Pro — 3%+ էժանացում", retailerId: "zigzag" as RetailerId, scope: "Apple / Հեռախոսներ", type: "price_drop" as AlertType, pct: 3, amd: 15000, enabled: true },
  { id: "r2", name: "Մրցակիցն ավելի էժան է", retailerId: "vega" as RetailerId, scope: "Բոլոր կատեգորիաները", type: "cheaper" as AlertType, pct: 1, amd: 5000, enabled: true },
  { id: "r3", name: "Խոշոր փոփոխություն TV-ներում", retailerId: "yerevan-mobile" as RetailerId, scope: "LG / Հեռուստացույցներ", type: "large_change" as AlertType, pct: 10, amd: 50000, enabled: false },
];

/* ---------------- Companies, users, permissions ---------------- */

export const FEATURES = [
  "dashboard",
  "alerts",
  "analytics",
  "history",
  "reports",
  "watchlist",
  "alert_rules",
  "export",
  "manage_users",
  "company_settings",
] as const;
export type Feature = (typeof FEATURES)[number];

export type Company = {
  id: string;
  name: string;
  status: "active" | "suspended";
  users: number;
  competitors: RetailerId[];
  monitored: number;
  features: Feature[];
  lastActivity: string;
  plan: string;
};

export const companies: Company[] = [
  {
    id: "redstore",
    name: "RedStore",
    status: "active",
    users: 5,
    competitors: ["zigzag", "vega", "mobile-centre", "yerevan-mobile"],
    monitored: 3345,
    features: [...FEATURES],
    lastActivity: iso(9),
    plan: "Business",
  },
  {
    id: "vega-corp",
    name: "Vega",
    status: "active",
    users: 3,
    competitors: ["zigzag", "redstore", "mobile-centre"],
    monitored: 2210,
    features: ["dashboard", "alerts", "analytics", "history", "watchlist", "manage_users", "company_settings"],
    lastActivity: iso(120),
    plan: "Standard",
  },
  {
    id: "mobile-centre-corp",
    name: "Mobile Centre",
    status: "suspended",
    users: 2,
    competitors: ["zigzag", "redstore"],
    monitored: 860,
    features: ["dashboard", "alerts", "history"],
    lastActivity: iso(4300),
    plan: "Trial",
  },
];

export const companyById = (id: string) => companies.find((c) => c.id === id);

export type Role = "super_admin" | "company_admin" | "viewer";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  companyId: string | null;
  active: boolean;
  competitors: RetailerId[];
  categories: string[];
  brands: string[];
  features: Feature[];
  lastActivity: string;
};

export const users: AppUser[] = [
  {
    id: "u0",
    name: "Արամ Հակոբյան",
    email: "super@pricemonitor.am",
    password: "1234",
    role: "super_admin",
    companyId: null,
    active: true,
    competitors: retailers.map((r) => r.id),
    categories: categories.map((c) => c.id),
    brands: [...brands],
    features: [...FEATURES],
    lastActivity: iso(3),
  },
  {
    id: "u1",
    name: "Նարեկ Սարգսյան",
    email: "admin@redstore.am",
    password: "1234",
    role: "company_admin",
    companyId: "redstore",
    active: true,
    competitors: ["zigzag", "vega", "mobile-centre", "yerevan-mobile"],
    categories: categories.map((c) => c.id),
    brands: [...brands],
    features: [...FEATURES],
    lastActivity: iso(15),
  },
  {
    id: "u2",
    name: "Անի Գրիգորյան",
    email: "viewer@redstore.am",
    password: "1234",
    role: "viewer",
    companyId: "redstore",
    active: true,
    competitors: ["zigzag", "vega"],
    categories: ["phones", "tablets", "audio"],
    brands: ["Apple", "Samsung", "Sony", "Xiaomi"],
    features: ["dashboard", "alerts", "analytics", "history", "watchlist"],
    lastActivity: iso(60),
  },
  {
    id: "u3",
    name: "Դավիթ Մկրտչյան",
    email: "david@redstore.am",
    password: "1234",
    role: "viewer",
    companyId: "redstore",
    active: false,
    competitors: ["zigzag"],
    categories: ["tv", "console"],
    brands: ["LG", "Sony"],
    features: ["dashboard", "history"],
    lastActivity: iso(6200),
  },
  {
    id: "u4",
    name: "Լիլիթ Ավետիսյան",
    email: "lilit@redstore.am",
    password: "1234",
    role: "viewer",
    companyId: "redstore",
    active: true,
    competitors: ["zigzag", "vega", "yerevan-mobile"],
    categories: categories.map((c) => c.id),
    brands: [...brands],
    features: ["dashboard", "alerts", "analytics", "history", "export"],
    lastActivity: iso(240),
  },
  {
    id: "u5",
    name: "Գոռ Պետրոսյան",
    email: "gor@vega.am",
    password: "1234",
    role: "company_admin",
    companyId: "vega-corp",
    active: true,
    competitors: ["zigzag", "redstore", "mobile-centre"],
    categories: categories.map((c) => c.id),
    brands: [...brands],
    features: ["dashboard", "alerts", "analytics", "history", "manage_users", "company_settings"],
    lastActivity: iso(900),
  },
];

export const auditLog = [
  { id: "l1", actor: "Արամ Հակոբյան", company: "RedStore", target: "Նարեկ Սարգսյան", action: "permission_granted", before: "3 մրցակից", after: "4 մրցակից", at: iso(70), reason: "Նոր պայմանագիր" },
  { id: "l2", actor: "Նարեկ Սարգսյան", company: "RedStore", target: "Անի Գրիգորյան", action: "permission_revoked", before: "Mobile Centre", after: "—", at: iso(320), reason: "Դերի փոփոխություն" },
  { id: "l3", actor: "Արամ Հակոբյան", company: "Mobile Centre", target: "—", action: "company_suspended", before: "Ակտիվ", after: "Կասեցված", at: iso(1400), reason: "Վճարման ուշացում" },
  { id: "l4", actor: "Նարեկ Սարգսյան", company: "RedStore", target: "Լիլիթ Ավետիսյան", action: "user_created", before: "—", after: "Viewer", at: iso(2600), reason: "" },
  { id: "l5", actor: "Արամ Հակոբյան", company: "Vega", target: "Գոռ Պետրոսյան", action: "feature_enabled", before: "5 գործառույթ", after: "7 գործառույթ", at: iso(4000), reason: "Փաթեթի բարձրացում" },
  { id: "l6", actor: "Նարեկ Սարգսյան", company: "RedStore", target: "Դավիթ Մկրտչյան", action: "user_suspended", before: "Ակտիվ", after: "Ոչ ակտիվ", at: iso(6100), reason: "Աշխատանքից ազատում" },
];