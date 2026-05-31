"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { formatDynamicDate } from "@/utils/formatDate";
import Pagination from "@/components/Pagination";
import {
  BookOpen,
  Droplet,
  HeartHandshake,
  Mic2,
  Calendar,
  X,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Activity {
  id: number;
  title: string;
  body: string | null;
  category: string;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
}

export type CategoryKey =
  | "Academic Care"
  | "Blood Donation"
  | "Humanitarian Support"
  | "Cultural Programs";

// ─── Visual-only category config ─────────────────────────────────────────────

const CATEGORY_VISUAL: Record<
  CategoryKey,
  { icon: any; tagBg: string; tagText: string }
> = {
  "Academic Care": {
    icon: BookOpen,
    tagBg: "bg-blue-100",
    tagText: "text-blue-800",
  },
  "Blood Donation": {
    icon: Droplet,
    tagBg: "bg-red-100",
    tagText: "text-red-800",
  },
  "Humanitarian Support": {
    icon: HeartHandshake,
    tagBg: "bg-green-100",
    tagText: "text-green-800",
  },
  "Cultural Programs": {
    icon: Mic2,
    tagBg: "bg-purple-100",
    tagText: "text-purple-800",
  },
};

const TAB_ORDER: CategoryKey[] = [
  "Academic Care",
  "Blood Donation",
  "Humanitarian Support",
  "Cultural Programs",
];

// ─── Hero ───────────────────────────────────────────────────────────────────

function ActivitiesHero({
  categoryTotals,
}: {
  categoryTotals: Record<string, number>;
}) {
  const { t } = useLanguage();
  const totalCount = Object.values(categoryTotals).reduce((s, n) => s + n, 0);

  return (
    <section className="bg-[#0a1628] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-[0.2em] mb-3">
          {t.activities.pageSupertitle}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {t.activities.pageTitle}
        </h1>
        <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
          {t.activities.pageSubtitle}
        </p>

        {totalCount > 0 && (
          <div className="flex flex-wrap items-center gap-6 mt-8">
            {TAB_ORDER.map((key) => {
              const count = categoryTotals[key] ?? 0;
              if (count === 0) return null;
              const visual = CATEGORY_VISUAL[key];
              const Icon = visual.icon;
              return (
                <div key={key} className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-[#c9a84c]" />
                  <div>
                    <span className="text-xl font-bold text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-400 ml-1.5">
                      {t.activities.categories[key].shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Activity Modal ───────────────────────────────────────────────────────────

function ActivityModal({
  activity,
  onClose,
}: {
  activity: Activity;
  onClose: () => void;
}) {
  const { t, lang } = useLanguage();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const visual = CATEGORY_VISUAL[activity.category as CategoryKey];
  const catLabel = t.activities.categories[activity.category as CategoryKey];
  const Icon = visual?.icon ?? BookOpen;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]" />

        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 shrink-0 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-xs text-[#c9a84c] font-semibold flex items-center gap-1.5 mb-2">
              <Icon className="w-4 h-4" />
              {catLabel?.shortLabel ?? activity.category}
              <span className="text-gray-300">|</span>
              <Calendar className="w-3.5 h-3.5" />
              {formatDynamicDate(activity.created_at, lang)}
            </p>
            <h2 className="text-xl font-bold text-[#0a1628] leading-snug">
              {activity.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label={t.activities.modalClose}
            className="shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activity.cover_image_url && (
            <div className="px-6 py-5">
              <img
                src={activity.cover_image_url}
                alt={activity.title}
                className="w-full rounded-xl border border-gray-100 object-cover max-h-96 shadow-sm"
              />
            </div>
          )}
          {activity.body && (
            <div
              className={`px-6 pb-6 ${!activity.cover_image_url ? "pt-5" : ""}`}
            >
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {activity.body}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t.activities.modalClose}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({
  activity,
  index,
  onOpen,
}: {
  activity: Activity;
  index: number;
  onOpen: (a: Activity) => void;
}) {
  const { t, lang } = useLanguage();
  const delay = `${Math.min(index * 0.07, 0.42)}s`;

  const visual = CATEGORY_VISUAL[activity.category as CategoryKey];
  const catLabel = t.activities.categories[activity.category as CategoryKey];

  const Icon = visual?.icon ?? BookOpen;
  const tagBg = visual?.tagBg ?? "bg-gray-100";
  const tagText = visual?.tagText ?? "text-gray-700";
  const shortLabel = catLabel?.shortLabel ?? activity.category;

  return (
    <article
      className="animate-fade-up group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      style={{ animationDelay: delay }}
      onClick={() => onOpen(activity)}
    >
      <div className="relative h-48 bg-gradient-to-br from-[#0a1628] to-[#1a2f4e] overflow-hidden flex-shrink-0">
        {activity.cover_image_url ? (
          <img
            src={activity.cover_image_url}
            alt={activity.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
            <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            <span className="text-[#c9a84c] text-xs tracking-widest uppercase">
              {shortLabel}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${tagBg} ${tagText}`}
        >
          {shortLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-2 flex-1">
        <p className="text-xs text-[#c9a84c] font-semibold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDynamicDate(activity.created_at, lang)}
        </p>

        <h3 className="text-base font-bold text-[#0a1628] leading-snug group-hover:text-[#c9a84c] transition-colors duration-200">
          {activity.title}
        </h3>

        {activity.body && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-2">
            {activity.body}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center gap-1.5 text-[#c9a84c] text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          {t.activities.cardReadMore}
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ActivitiesTabs({
  activities,
  categoryTotals,
  initialSearch,
  initialSort,
  initialCategory,
  totalPages,
  currentPage,
}: {
  activities: Activity[];
  categoryTotals: Record<string, number>;
  initialSearch: string;
  initialSort: string;
  initialCategory: CategoryKey;
  totalPages: number;
  currentPage: number;
}) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [openActivity, setOpenActivity] = useState<Activity | null>(null);
  const [searchValue, setSearchValue] = useState(initialSearch);

  // ─── URL Update Logic ───────────
  const updateParams = (newSearch: string, newSort: string, newCat: string) => {
    const params = newSearchParams(searchParams.toString());

    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newSort && newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    if (newCat && newCat !== "Academic Care") params.set("category", newCat);
    else params.delete("category");

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Helper for safe param copying
  function newSearchParams(str: string) {
    return new URLSearchParams(str);
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(searchValue, initialSort, initialCategory);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams(searchValue, e.target.value, initialCategory);
  };

  const activeCfg = CATEGORY_VISUAL[initialCategory];
  const activeCatT = t.activities.categories[initialCategory];
  const ActiveIcon = activeCfg?.icon ?? BookOpen;

  return (
    <>
      <ActivitiesHero categoryTotals={categoryTotals} />

      {/* ─── Sticky Tabs ─── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 min-w-max sm:min-w-0">
            {TAB_ORDER.map((key) => {
              const visual = CATEGORY_VISUAL[key];
              const TabIcon = visual.icon;
              const catLabel = t.activities.categories[key];
              const isActive = initialCategory === key;
              const count = categoryTotals[key] ?? 0;

              return (
                <button
                  key={key}
                  onClick={() => updateParams(searchValue, initialSort, key)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "border-[#c9a84c] text-[#c9a84c]"
                      : "border-transparent text-gray-500 hover:text-[#0a1628]"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{catLabel.label}</span>
                  <span className="sm:hidden">{catLabel.shortLabel}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="bg-[#f5f3ee] py-8 sm:py-12 flex flex-col min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <ActiveIcon className="w-8 h-8 text-[#0a1628]" strokeWidth={1.5} />
            <div>
              <h2 className="text-2xl font-bold text-[#0a1628]">
                {activeCatT?.label}
              </h2>
              <p className="text-sm text-gray-500">
                {t.activities.categorySubtitle.replace(
                  "{label}",
                  activeCatT?.shortLabel ?? "...",
                )}
              </p>
            </div>
          </div>

          {/* ─── Search + Sort Bar ─── */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  lang === "bn"
                    ? "কার্যক্রমের নাম দিয়ে খুঁজুন..."
                    : "Search activities..."
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-all bg-gray-50/50"
              />
              <button type="submit" className="hidden" />
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <div className="relative w-full sm:w-auto flex-1">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={initialSort}
                  onChange={handleSortChange}
                  className="w-full sm:w-48 pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-all bg-gray-50/50 appearance-none cursor-pointer"
                >
                  <option value="newest">
                    {lang === "bn" ? "নতুন আগে" : "Newest First"}
                  </option>
                  <option value="oldest">
                    {lang === "bn" ? "পুরনো আগে" : "Oldest First"}
                  </option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {isPending && (
                <Loader2 className="w-5 h-5 text-[#c9a84c] animate-spin shrink-0" />
              )}
            </div>
          </div>

          {/* ─── Grid / Empty State ─── */}
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
              <ActiveIcon
                className="w-12 h-12 mb-4 text-gray-300"
                strokeWidth={1.5}
              />
              <p className="text-base font-semibold text-[#0a1628]">
                {initialSearch
                  ? lang === "bn"
                    ? "কোনো ফলাফল পাওয়া যায়নি।"
                    : "No results found."
                  : t.activities.emptyState}
              </p>
              {!initialSearch && (
                <p className="text-sm text-gray-400 mt-1">
                  {t.activities.emptyStateSoon}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, i) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={i}
                  onOpen={setOpenActivity}
                />
              ))}
            </div>
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <div className="mt-auto pt-10">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            </div>
          )}
        </div>
      </section>

      {openActivity && (
        <ActivityModal
          activity={openActivity}
          onClose={() => setOpenActivity(null)}
        />
      )}
    </>
  );
}
