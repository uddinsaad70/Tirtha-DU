import { type Lang } from "@/i18n";

export function formatDynamicDate(iso: string | Date, lang: Lang): string {
  if (!iso) return "—";

  const date = typeof iso === "string" ? new Date(iso) : iso;

  // ভাষার ওপর ভিত্তি করে লোকাল সেট করা
  const locale = lang === "bn" ? "bn-BD" : "en-US";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
