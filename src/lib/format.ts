export function formatAmd(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} ֏`;
}

export function formatSignedAmd(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(Math.round(value)).toLocaleString("en-US")} ֏`;
}

export function formatPct(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export function formatDateTime(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleString(locale === "hy" ? "hy-AM" : locale === "ru" ? "ru-RU" : "en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "hy" ? "hy-AM" : locale === "ru" ? "ru-RU" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function relativeMinutes(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}