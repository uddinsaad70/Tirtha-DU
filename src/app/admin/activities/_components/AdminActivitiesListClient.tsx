"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import { formatDynamicDate } from "@/utils/formatDate";
import DeleteButton from "./DeleteButton";
import {
  CalendarRange,
  Pencil,
  Image as ImageIcon,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import Pagination from "@/components/Pagination";

interface Activity {
  id: number;
  title: string;
  category: string;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
}

const CATEGORY_STYLES: Record<
  string,
  { bnLabel: string; enLabel: string; cls: string }
> = {
  "Academic Care": {
    bnLabel: "একাডেমিক সহায়তা",
    enLabel: "Academic Care",
    cls: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
  },
  "Blood Donation": {
    bnLabel: "রক্তদান",
    enLabel: "Blood Donation",
    cls: "bg-red-50 text-red-500 ring-1 ring-red-100",
  },
  "Humanitarian Support": {
    bnLabel: "মানবিক সহায়তা",
    enLabel: "Humanitarian Support",
    cls: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  },
  "Cultural Programs": {
    bnLabel: "সাংস্কৃতিক",
    enLabel: "Cultural",
    cls: "bg-purple-50 text-purple-600 ring-1 ring-purple-100",
  },
};

export default function AdminActivitiesListClient({
  list,
  totalCount,
  publishedCount,
  unpublishedCount,
  initialSearch,
  initialSort,
  initialStatus,
  totalPages,
  currentPage,
}: {
  list: Activity[];
  totalCount: number;
  publishedCount: number;
  unpublishedCount: number;
  initialSearch: string;
  initialSort: string;
  initialStatus: string;
  totalPages: number;
  currentPage: number;
}) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(initialSearch);

  // ─── URL Update Logic ───────────
  const updateParams = (
    newSearch: string,
    newSort: string,
    newStatus: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newSort && newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    if (newStatus && newStatus !== "all") params.set("status", newStatus);
    else params.delete("status");

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(searchValue, initialSort, initialStatus);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams(searchValue, e.target.value, initialStatus);
  };

  // ─── Tabs Config ────────────────────────────────────────────────
  const tabs = [
    { key: "all", labelBn: "সকল", labelEn: "All", count: totalCount },
    {
      key: "published",
      labelBn: "প্রকাশিত",
      labelEn: "Published",
      count: publishedCount,
      dot: "bg-green-400",
    },
    {
      key: "unpublished",
      labelBn: "অপ্রকাশিত",
      labelEn: "Unpublished",
      count: unpublishedCount,
      dot: "bg-gray-400",
    },
  ];

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
            {t.adminActivitiesList.supertitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminActivitiesList.title}
          </h1>
        </div>
        <Link
          href="/admin/activities/new"
          className="inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-sm"
        >
          {t.adminActivitiesList.addBtn}
        </Link>
      </div>

      {/* ─── Search + Filter + Sort Bar ───────────────────────────────── */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                lang === "bn"
                  ? "নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                  : "Search by title or category..."
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-all bg-gray-50/50"
            />
            <button type="submit" className="hidden" />
          </form>

          {/* Sort + Loader */}
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

        {/* Status filter tabs (Server-driven) */}
        <div className="flex w-full gap-2 mt-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => updateParams(searchValue, initialSort, tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                initialStatus === tab.key
                  ? "bg-[#0a1628] text-white border-[#0a1628] shadow-sm"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.dot && (
                <span
                  className={`hidden sm:block w-2 h-2 rounded-full shrink-0 ${initialStatus === tab.key ? "opacity-100" : "opacity-60"} ${tab.dot}`}
                />
              )}
              <span className="whitespace-nowrap">
                {lang === "bn" ? tab.labelBn : tab.labelEn}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] leading-none font-bold ${initialStatus === tab.key ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {translateNumbers(tab.count.toString(), lang)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Table and Pagination ───────────────────────────────────────── */}
      {/* ১. এখান থেকে flex flex-col min-h-[450px] মুছে ফেলা হয়েছে */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-sm">
              <Search className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-base font-bold text-[#0a1628] mb-1">
              {t.adminActivitiesList.emptyTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              {initialSearch || initialStatus !== "all"
                ? lang === "bn"
                  ? "কোনো ফলাফল পাওয়া যায়নি।"
                  : "No results found."
                : t.adminActivitiesList.emptyDesc}
            </p>
            {!initialSearch && initialStatus === "all" && (
              <Link
                href="/admin/activities/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 shadow-sm"
              >
                {t.adminActivitiesList.addBtn}
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* ২. এখান থেকে flex-1 মুছে ফেলা হয়েছে */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminActivitiesList.table.activity}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      {t.adminActivitiesList.table.status}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                      {t.adminActivitiesList.table.date}
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminActivitiesList.table.action}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((activity) => {
                    const cat = CATEGORY_STYLES[activity.category] ?? {
                      bnLabel: activity.category,
                      enLabel: activity.category,
                      cls: "bg-gray-100 text-gray-500",
                    };
                    return (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50/40 transition-colors duration-100"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            {activity.cover_image_url ? (
                              <img
                                src={activity.cover_image_url}
                                alt={activity.title}
                                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100 shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                            <div className="flex flex-col items-start gap-1.5">
                              <p className="font-bold text-[#0a1628] leading-snug line-clamp-2 max-w-[200px] sm:max-w-xs md:max-w-md">
                                {activity.title}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cat.cls}`}
                              >
                                {lang === "bn" ? cat.bnLabel : cat.enLabel}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${activity.is_published ? "bg-green-50 text-green-600 ring-1 ring-green-100" : "bg-gray-50 text-gray-500 ring-1 ring-gray-200"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${activity.is_published ? "bg-green-500" : "bg-gray-400"}`}
                            />
                            {activity.is_published
                              ? t.adminActivitiesList.badgePubYes
                              : t.adminActivitiesList.badgePubNo}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell text-gray-500 text-xs font-medium">
                          {formatDynamicDate(activity.created_at, lang)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/activities/${activity.id}/edit`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0a1628] bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />{" "}
                              {t.adminActivitiesList.editBtn}
                            </Link>
                            <DeleteButton activityId={activity.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ৩. এখান থেকে mt-auto মুছে ফেলা হয়েছে */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100 bg-gray-50/30">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
