"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { formatDynamicDate } from "@/utils/formatDate";
import { Eye, Share2, Check, Image as ImageIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalleryAlbum {
  id: number;
  title: string;
  event_name: string;
  image_urls: string[];
  taken_at: string | null;
  is_published: boolean;
}

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

  const [copied, setCopied] = useState(false);

  // শেয়ার ফাংশন
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=gallery&id=${album.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: album.title, url: url });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goPrev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  // Lock body scroll
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
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
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
          {/* Counter — e.g. "3 / 12" — numeric, no translation needed */}
          <span className="text-xs text-gray-400 font-mono tabular-nums">
            {current + 1} / {total}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </span>
          <button
            onClick={onClose}
            aria-label={t.news.lightboxClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center">
          <img
            key={current}
            src={images[current]}
            // alt uses album title + counter — content, not a UI string
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
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
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
                // aria-label uses a translated prefix + number
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Photo count badge */}
      {photoCount > 1 && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {photoCount}
        </div>
      )}

      {/* Info overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-1">
          {album.event_name}
        </p>
        <h3 className="text-sm font-bold text-white leading-snug">
          {album.title}
        </h3>
        {album.taken_at && (
          <p className="text-xs text-white/60 mt-0.5">
            {/* {new Date(album.taken_at).toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
            })} */}
            {formatDynamicDate(album.taken_at, lang)}
          </p>
        )}

        {/* Hover CTA */}
        <div className="mt-2 flex items-center gap-1.5 text-[#c9a84c] text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {t.news.albumViewCta}
        </div>
      </div>
    </article>
  );
}

// ─── Main Grid Component ──────────────────────────────────────────────────────

export default function GalleryGrid({ albums }: { albums: GalleryAlbum[] }) {
  const { t } = useLanguage();
  const [lightboxAlbum, setLightboxAlbum] = useState<GalleryAlbum | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const idParam = searchParams.get("id");
    const tabParam = searchParams.get("tab");
    if (tabParam === "gallery" && idParam && albums.length > 0) {
      const found = albums.find((a) => a.id.toString() === idParam);
      if (found)
        setLightboxAlbum((prev) => (prev?.id === found.id ? prev : found));
    }
  }, [searchParams, albums]);

  const handleOpenAlbum = (album: GalleryAlbum) => {
    setLightboxAlbum(album);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", "gallery");
    url.searchParams.set("id", album.id.toString());
    window.history.pushState({}, "", url.toString());
  };

  const handleCloseAlbum = () => {
    setLightboxAlbum(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.pushState({}, "", url.toString());
  };

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="text-5xl mb-4">📷</span>
        <p className="text-base font-semibold text-[#0a1628]">
          {t.news.galleryEmpty}
        </p>
        <p className="text-sm text-gray-400 mt-1">{t.news.galleryEmptySoon}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {albums.map((album, i) => (
          <AlbumCard
            key={album.id}
            album={album}
            index={i}
            onOpen={handleOpenAlbum}
          />
        ))}
      </div>

      {lightboxAlbum && (
        <Lightbox
          album={lightboxAlbum}
          initialIndex={0}
          onClose={handleCloseAlbum}
        />
      )}
    </>
  );
}
