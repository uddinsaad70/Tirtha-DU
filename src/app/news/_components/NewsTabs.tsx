"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { formatDynamicDate } from "@/utils/formatDate";
import Pagination from "@/components/Pagination";
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Bell,
  X,
  Download,
  Eye,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalleryAlbum {
  id: number;
  title: string;
  event_name: string;
  image_urls: string[];
  taken_at: string | null;
  is_published: boolean;
}

interface Notice {
  id: number;
  title: string;
  body: string | null;
  file_url: string | null;
  file_type: "image" | "pdf" | "none";
  published_at: string;
  created_at: string;
  category: string;
}

type TabKey = "notices" | "gallery";

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

const CATEGORY_COLORS: Record<string, string> = {
  "Academic Care": "bg-blue-50 text-blue-700",
  "Cultural Programs": "bg-purple-50 text-purple-700",
  "Blood Donation": "bg-red-50 text-red-700",
  "Humanitarian Support": "bg-orange-50 text-orange-700",
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  album,
  initialIndex,
  onClose,
}: {
  album: GalleryAlbum;
  initialIndex: number;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const images = album.image_urls;
  const total = images.length;

  const goPrev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    setTouchStartX(null);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm sm:text-base truncate">
            {album.title}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {album.event_name}
            {album.taken_at && (
              <span className="ml-2">
                ·{" "}
                {new Date(album.taken_at).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs text-gray-400 font-mono tabular-nums">
            {current + 1} / {total}
          </span>
          <button
            onClick={onClose}
            aria-label={t.news.lightboxClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div
        className="flex-1 flex items-center justify-center relative min-h-0 px-4 sm:px-16"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {total > 1 && (
          <button
            onClick={goPrev}
            aria-label={t.news.lightboxPrev}
            className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center">
          <img
            key={current}
            src={images[current]}
            alt={`${album.title} — ${t.news.lightboxImageAlt} ${current + 1}`}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            style={{ animation: "fade-in 0.2s ease-out" }}
          />
        </div>

        {total > 1 && (
          <button
            onClick={goNext}
            aria-label={t.news.lightboxNext}
            className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="shrink-0 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 justify-center min-w-max mx-auto">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`${t.news.lightboxThumbnail} ${i + 1}`}
                className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden ring-2 transition-all duration-200 ${
                  i === current
                    ? "ring-[#c9a84c] opacity-100 scale-105"
                    : "ring-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={url}
                  alt={`${t.news.lightboxThumbnail} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Album Card ───────────────────────────────────────────────────────────────

function AlbumCard({
  album,
  index,
  onOpen,
}: {
  album: GalleryAlbum;
  index: number;
  onOpen: (album: GalleryAlbum) => void;
}) {
  const { t, lang } = useLanguage();
  const delay = `${Math.min(index * 0.05, 0.45)}s`;
  const cover = album.image_urls[0];
  const photoCount = album.image_urls.length;

  return (
    <article
      className="animate-fade-up group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] cursor-pointer"
      style={{ animationDelay: delay }}
      onClick={() => onOpen(album)}
    >
      <img
        src={cover}
        alt={album.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {photoCount > 1 && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
          <ImageIcon className="w-3 h-3" />
          {photoCount}
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-1">
          {album.event_name}
        </p>
        <h3 className="text-sm font-bold text-white leading-snug">
          {album.title}
        </h3>
        {album.taken_at && (
          <p className="text-xs text-white/60 mt-0.5">
            {formatDynamicDate(album.taken_at, lang)}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-[#c9a84c] text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <Eye className="w-3.5 h-3.5" />
          {t.news.albumViewCta}
        </div>
      </div>
    </article>
  );
}

// ─── Main Grid Component ──────────────────────────────────────────────────────

function GalleryGrid({
  albums,
  onOpenLightbox,
}: {
  albums: GalleryAlbum[];
  onOpenLightbox: (album: GalleryAlbum) => void;
}) {
  const { t } = useLanguage();

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-5xl mb-4 opacity-50">📷</span>
        <p className="text-base font-semibold text-[#0a1628]">
          {t.news.galleryEmpty}
        </p>
        <p className="text-sm text-gray-400 mt-1">{t.news.galleryEmptySoon}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {albums.map((album, i) => (
        <AlbumCard
          key={album.id}
          album={album}
          index={i}
          onOpen={onOpenLightbox}
        />
      ))}
    </div>
  );
}

// ─── Notice Modal ─────────────────────────────────────────────────────────────

function NoticeModal({
  notice,
  onClose,
}: {
  notice: Notice;
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

  const hasPdf = notice.file_type === "pdf" && notice.file_url;
  const hasImage = notice.file_type === "image" && notice.file_url;
  const dateToUse = notice.published_at || notice.created_at;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]" />

        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 shrink-0 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-xs text-[#c9a84c] font-semibold flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              {formatDynamicDate(dateToUse, lang)}
              {daysAgo(dateToUse) <= 3 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                  {t.news.badgeNew}
                </span>
              )}
            </p>
            <h2 className="text-lg font-bold text-[#0a1628] leading-snug">
              {notice.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t.news.modalClose}
            className="shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notice.body && (
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {notice.body}
              </p>
            </div>
          )}
          {hasImage && (
            <div className="px-6 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />{" "}
                {t.news.modalAttachedImage}
              </p>
              <img
                src={notice.file_url!}
                alt={notice.title}
                className="w-full rounded-xl border border-gray-100 object-contain max-h-96"
              />
            </div>
          )}
          {hasPdf && (
            <div className="px-6 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />{" "}
                {t.news.modalAttachedDocument}
              </p>
              <iframe
                src={`${notice.file_url}#toolbar=1&view=FitH`}
                title={notice.title}
                className="w-full h-80 rounded-xl border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t.news.modalClose}
          </button>

          {notice.file_url && notice.file_type !== "none" && (
            <a
              href={notice.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity"
            >
              {notice.file_type === "pdf" ? (
                <>
                  <Download className="w-4 h-4" /> {t.news.modalDownloadPdf}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> {t.news.modalViewImage}
                </>
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Notice Row ───────────────────────────────────────────────────────────────

function NoticeRow({
  notice,
  index,
  onOpen,
}: {
  notice: Notice;
  index: number;
  onOpen: (n: Notice) => void;
}) {
  const { t, lang } = useLanguage();
  const delay = `${Math.min(index * 0.06, 0.4)}s`;
  const categoryClass =
    CATEGORY_COLORS[notice.category] ?? "bg-gray-100 text-gray-600";
  const dateToUse = notice.published_at || notice.created_at;

  return (
    <article
      className="animate-fade-up bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
      style={{ animationDelay: delay }}
      onClick={() => onOpen(notice)}
    >
      <div className="h-0.5 bg-gradient-to-r from-[#c9a84c]/40 to-[#e8c96d]/40 group-hover:from-[#c9a84c] group-hover:to-[#e8c96d] transition-all duration-300" />
      <div className="p-5 sm:p-6 flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
          {notice.file_type === "pdf" ? (
            <FileText className="w-5 h-5" />
          ) : notice.file_type === "image" ? (
            <ImageIcon className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {notice.category && (
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${categoryClass}`}
              >
                {t.home.activities[
                  notice.category as keyof typeof t.home.activities
                ]?.label || notice.category}
              </span>
            )}
            <time className="text-xs text-gray-400">
              {formatDynamicDate(dateToUse, lang)}
            </time>
          </div>
          <h3 className="text-base font-semibold text-[#0a1628] leading-snug mb-1 group-hover:text-[#c9a84c] transition-colors">
            {notice.title}
          </h3>
          {notice.body && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-1">
              {notice.body}
            </p>
          )}
        </div>
        <div className="shrink-0 self-center text-gray-300 group-hover:text-[#c9a84c] group-hover:translate-x-0.5 transition-all duration-200">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </article>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewsTabs({
  initialNotices,
  initialAlbums,
  noticesCount,
  galleryCount,
  initialTab,
  initialSearch,
  initialSort,
  totalPages,
  currentPage,
}: {
  initialNotices: Notice[];
  initialAlbums: GalleryAlbum[];
  noticesCount: number;
  galleryCount: number;
  initialTab: string;
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

  const [openNotice, setOpenNotice] = useState<Notice | null>(null);
  const [lightboxAlbum, setLightboxAlbum] = useState<GalleryAlbum | null>(null);
  const [searchValue, setSearchValue] = useState(initialSearch);

  // ─── URL Update Logic ───────────
  const updateParams = (newSearch: string, newSort: string, newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newSort && newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    if (newTab && newTab !== "notices") params.set("tab", newTab);
    else params.delete("tab");

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(searchValue, initialSort, initialTab);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams(searchValue, e.target.value, initialTab);
  };

  const TABS = [
    { key: "notices", label: t.news.tabNotices, count: noticesCount },
    { key: "gallery", label: t.news.tabGallery, count: galleryCount },
  ];

  return (
    <>
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
            {t.news.pageSupertitle}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t.news.pageTitle}
          </h1>
          <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
            {t.news.pageSubtitle}
          </p>
        </div>
      </section>

      {/* ─── Sticky Tabs ─── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => updateParams(searchValue, initialSort, tab.key)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  initialTab === tab.key
                    ? "border-[#c9a84c] text-[#c9a84c]"
                    : "border-transparent text-gray-500 hover:text-[#0a1628]"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    initialTab === tab.key
                      ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-[#f5f3ee] py-8 sm:py-12 flex flex-col min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
          {/* ─── Search + Sort Bar ─── */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={lang === "bn" ? "খুঁজুন..." : "Search..."}
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

          {/* ─── Content ─── */}
          {initialTab === "notices" && (
            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
              {initialNotices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm w-full">
                  <Bell className="w-12 h-12 mb-4 text-gray-300 opacity-50" />
                  <p className="text-base font-semibold text-[#0a1628]">
                    {initialSearch
                      ? lang === "bn"
                        ? "কোনো ফলাফল পাওয়া যায়নি।"
                        : "No results found."
                      : t.news.noticesEmpty}
                  </p>
                </div>
              ) : (
                initialNotices.map((notice, i) => (
                  <NoticeRow
                    key={notice.id}
                    notice={notice}
                    index={i}
                    onOpen={setOpenNotice}
                  />
                ))
              )}
            </div>
          )}

          {initialTab === "gallery" && (
            <GalleryGrid
              albums={initialAlbums}
              onOpenLightbox={setLightboxAlbum}
            />
          )}

          {/* ─── Pagination ─── */}
          {totalPages > 1 && (
            <div className="mt-auto pt-10">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-4xl mx-auto">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            </div>
          )}
        </div>
      </section>

      {openNotice && (
        <NoticeModal notice={openNotice} onClose={() => setOpenNotice(null)} />
      )}

      {lightboxAlbum && (
        <Lightbox
          album={lightboxAlbum}
          initialIndex={0}
          onClose={() => setLightboxAlbum(null)}
        />
      )}
    </>
  );
}
