"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/Pagination";
import {
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Check,
  Eye,
  Pencil,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

interface Notice {
  id: number;
  title: string;
  body: string | null;
  file_url: string | null;
  file_type: "image" | "pdf" | "none";
  is_ticker: boolean;
  is_published: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function AdminNoticesListClient({
  noticeList,
  totalCount,
  publishedCount,
  unpublishedCount,
  tickerCount,
  initialSearch,
  initialSort,
  initialStatus,
  totalPages,
  currentPage,
}: {
  noticeList: Notice[];
  totalCount: number;
  publishedCount: number;
  unpublishedCount: number;
  tickerCount: number;
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
            {t.adminNoticesList.supertitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminNoticesList.title}
          </h1>
          {/* Ticker Count Badge */}
          {tickerCount > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#c9a84c]/10 text-[#c9a84c]">
                {t.adminNoticesList.ticker}{" "}
                {translateNumbers(tickerCount.toString(), lang)}
              </span>
            </div>
          )}
        </div>
        <Link
          href="/admin/notices/new"
          className="inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-sm"
        >
          {t.adminNoticesList.addBtn}
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
                  ? "নোটিশের নাম দিয়ে খুঁজুন..."
                  : "Search by title..."
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {noticeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-sm">
              <Search className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-base font-bold text-[#0a1628] mb-1">
              {t.adminNoticesList.emptyTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              {initialSearch || initialStatus !== "all"
                ? lang === "bn"
                  ? "কোনো ফলাফল পাওয়া যায়নি।"
                  : "No results found."
                : t.adminNoticesList.emptyDesc}
            </p>
            {!initialSearch && initialStatus === "all" && (
              <Link
                href="/admin/notices/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 shadow-sm"
              >
                {t.adminNoticesList.addBtn}
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminNoticesList.table.title}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      {t.adminNoticesList.table.file}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      {t.adminNoticesList.table.ticker}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminNoticesList.table.status}
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminNoticesList.table.action}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {noticeList.map((notice) => (
                    <tr
                      key={notice.id}
                      className="hover:bg-gray-50/40 transition-colors duration-100"
                    >
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-semibold text-[#0a1628] leading-tight truncate">
                          {notice.title}
                        </p>
                        {notice.body && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {notice.body}
                          </p>
                        )}
                        {notice.expires_at && (
                          <p className="text-[10px] text-red-400 mt-0.5">
                            {t.adminNoticesList.expiresPrefix}{" "}
                            {translateNumbers(
                              new Date(notice.expires_at).toLocaleDateString(
                                lang === "bn" ? "bn-BD" : "en-US",
                              ),
                              lang,
                            )}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {notice.file_type === "pdf" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                            <FileText className="w-3 h-3" />{" "}
                            {t.adminNoticesList.badgePdf.replace("📄 ", "")}
                          </span>
                        ) : notice.file_type === "image" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                            <ImageIcon className="w-3 h-3" />{" "}
                            {t.adminNoticesList.badgeImg.replace("🖼️ ", "")}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${notice.is_ticker ? "bg-[#c9a84c]/10 text-[#c9a84c] ring-1 ring-[#c9a84c]/20" : "bg-gray-100 text-gray-400"}`}
                        >
                          {notice.is_ticker && <Check className="w-3 h-3" />}
                          {notice.is_ticker
                            ? t.adminNoticesList.badgeTickerYes.replace(
                                "✓ ",
                                "",
                              )
                            : t.adminNoticesList.badgeTickerNo}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${notice.is_published ? "bg-green-50 text-green-600 ring-1 ring-green-100" : "bg-gray-100 text-gray-500"}`}
                        >
                          {notice.is_published
                            ? t.adminNoticesList.badgePubYes
                            : t.adminNoticesList.badgePubNo}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {notice.file_url && (
                            <a
                              href={notice.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />{" "}
                              {t.adminNoticesList.viewBtn.replace("👁️ ", "")}
                            </a>
                          )}
                          <Link
                            href={`/admin/notices/${notice.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0a1628] bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />{" "}
                            {t.adminNoticesList.editBtn.replace("✏️ ", "")}
                          </Link>
                          <DeleteButton noticeId={notice.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
