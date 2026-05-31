"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import { formatDynamicDate } from "@/utils/formatDate";
import DeleteButton from "./DeleteButton";
import Pagination from "@/components/Pagination";
import {
  Camera,
  Image as ImageIcon,
  Calendar,
  Pencil,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

interface GalleryAlbum {
  id: number;
  title: string;
  image_urls: string[];
  event_name: string | null;
  taken_at: string | null;
  created_at: string;
}

export default function AdminGalleryListClient({
  items,
  totalCount,
  initialSearch,
  initialSort,
  totalPages,
  currentPage,
}: {
  items: GalleryAlbum[];
  totalCount: number;
  initialSearch: string;
  initialSort: string;
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
  const updateParams = (newSearch: string, newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newSort && newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(searchValue, initialSort);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams(searchValue, e.target.value);
  };

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-100px)]">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
            {t.adminGalleryList.supertitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminGalleryList.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.adminGalleryList.totalPrefix}
            <span className="font-semibold text-[#0a1628] mx-1">
              {translateNumbers(totalCount.toString(), lang)}
            </span>
            {t.adminGalleryList.totalSuffix}
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-sm"
        >
          {t.adminGalleryList.addBtn}
        </Link>
      </div>

      {/* ─── Search + Sort Bar ───────────────────────────────── */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={
              lang === "bn"
                ? "অ্যালবাম বা ইভেন্টের নাম দিয়ে খুঁজুন..."
                : "Search by album or event name..."
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

      {/* ─── Gallery Grid ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <Camera className="w-12 h-12 text-gray-400 mb-4 opacity-50" />
            <h3 className="text-base font-bold text-[#0a1628] mb-1">
              {t.adminGalleryList.emptyTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              {initialSearch
                ? lang === "bn"
                  ? "কোনো অ্যালবাম পাওয়া যায়নি।"
                  : "No albums found."
                : t.adminGalleryList.emptyDesc}
            </p>
            {!initialSearch && (
              <Link
                href="/admin/gallery/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-sm"
              >
                {t.adminGalleryList.addFirstBtn}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((album) => {
              const coverImage = album.image_urls?.[0] || "";
              const extraPhotosCount =
                album.image_urls?.length > 1 ? album.image_urls.length - 1 : 0;

              return (
                <article
                  key={album.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {album.event_name && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#c9a84c] text-[#0a1628]">
                        {album.event_name}
                      </span>
                    )}

                    {extraPhotosCount > 0 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-semibold">
                        <ImageIcon className="w-3.5 h-3.5" />+
                        {translateNumbers(extraPhotosCount.toString(), lang)}{" "}
                        {t.adminGalleryList.photosSuffix}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="text-base font-bold text-[#0a1628] leading-snug line-clamp-2">
                      {album.title}
                    </h3>
                    <div className="text-xs text-gray-400 mt-auto flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {album.taken_at
                        ? formatDynamicDate(album.taken_at, lang)
                        : t.adminGalleryList.noDate}
                    </div>
                  </div>

                  <div className="p-3 border-t border-gray-50 flex items-center gap-2 bg-gray-50/30">
                    <Link
                      href={`/admin/gallery/${album.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0a1628] bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />{" "}
                      {t.adminGalleryList.editBtn}
                    </Link>
                    <DeleteButton id={album.id} title={album.title} />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="mt-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </div>
    </div>
  );
}
