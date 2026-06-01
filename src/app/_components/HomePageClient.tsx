"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { HomeNotice } from "../page";
import { formatDynamicDate } from "@/utils/formatDate";
import {
  BookOpen,
  Droplet,
  HeartHandshake,
  Mic2,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  ArrowRight,
  Bell,
  Calendar,
  X,
  Download,
  Eye,
} from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

const ACTIVITY_KEYS = [
  { key: "academic", icon: <BookOpen className="w-8 h-8" strokeWidth={1.5} /> },
  { key: "blood", icon: <Droplet className="w-8 h-8" strokeWidth={1.5} /> },
  {
    key: "humanitarian",
    icon: <HeartHandshake className="w-8 h-8" strokeWidth={1.5} />,
  },
  { key: "cultural", icon: <Mic2 className="w-8 h-8" strokeWidth={1.5} /> },
] as const;

// ─── Notice Modal ─────────────────────────────────────────────────────────────

function NoticeModal({
  notice,
  onClose,
}: {
  notice: HomeNotice;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
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

// ─── NoticeTicker ─────────────────────────────────────────────────────────────

function NoticeTicker({ notices }: { notices: HomeNotice[] }) {
  const { t } = useLanguage();
  if (notices.length === 0) return null;

  const tickerText = notices.map((n) => n.title).join("   •   ");

  return (
    <div className="bg-[#c9a84c] text-[#0a1628] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-9">
        <span className="shrink-0 font-bold text-xs uppercase tracking-widest mr-4 pr-4 border-r border-[#0a1628]/30">
          {t.home.tickerLabel}
        </span>
        <div className="overflow-hidden flex-1 relative">
          <span className="ticker-animate text-sm font-medium">
            {tickerText}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── NoticeCard ───────────────────────────────────────────────────────────────

function NoticeCard({
  notice,
  index,
  onOpen,
}: {
  notice: HomeNotice;
  index: number;
  onOpen: (n: HomeNotice) => void;
}) {
  const { t, lang } = useLanguage();

  const delayClass =
    index === 0
      ? "animation-delay-100"
      : index === 1
        ? "animation-delay-200"
        : "animation-delay-300";

  return (
    <article
      onClick={() => onOpen(notice)}
      className={`animate-fade-up ${delayClass} bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col`}
    >
      <div className="h-0.5 bg-gradient-to-r from-[#c9a84c]/40 to-[#e8c96d]/40 group-hover:from-[#c9a84c] group-hover:to-[#e8c96d] transition-all duration-300" />
      <div className="p-5 sm:p-6 flex items-start gap-4 flex-1">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
          {notice.file_type === "pdf" ? (
            <FileText className="w-5 h-5" />
          ) : notice.file_type === "image" ? (
            <ImageIcon className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {t.home.noticesSuperLabel}
            </span>
            <time className="text-xs text-gray-400">
              {formatDynamicDate(
                notice.published_at || notice.created_at,
                lang,
              )}
            </time>
          </div>

          <h3 className="text-base font-semibold text-[#0a1628] leading-snug mb-2 group-hover:text-[#c9a84c] transition-colors line-clamp-2">
            {notice.title}
          </h3>

          {notice.body && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
              {notice.body}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
            <span className="text-xs font-semibold text-gray-400 group-hover:text-[#c9a84c] transition-colors flex items-center gap-1">
              {t.common.readmore}{" "}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>

            {notice.file_url && (
              <a
                href={notice.file_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-[#c9a84c] hover:text-[#0a1628] transition-colors inline-flex items-center gap-1 bg-[#c9a84c]/10 px-2.5 py-1 rounded-md"
              >
                {notice.file_type === "pdf" ? (
                  <>
                    <FileText className="w-3 h-3" /> PDF
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3" /> Image
                  </>
                )}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export default function HomePageClient({
  tickerNotices,
  latestNotices,
}: {
  tickerNotices: HomeNotice[];
  latestNotices: HomeNotice[];
}) {
  const { t } = useLanguage();
  const [openNotice, setOpenNotice] = useState<HomeNotice | null>(null);

  return (
    <>
      <NoticeTicker notices={tickerNotices} />

      <section className="bg-[#0a1628] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#c9a84c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center flex flex-col items-center gap-6">
          <span className="animate-fade-up text-[#c9a84c] text-xs font-bold uppercase tracking-[0.2em] border border-[#c9a84c]/40 rounded-full px-4 py-1.5">
            {t.home.heroBadge}
          </span>

          <h1 className="animate-fade-up animation-delay-100 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
            <span className="text-white">{t.home.heroTitlePrefix} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]">
              {t.home.heroTitleHighlight}
            </span>
          </h1>

          <p className="animate-fade-up animation-delay-200 max-w-2xl text-gray-300 text-lg sm:text-xl leading-relaxed">
            {t.home.heroTagline}
          </p>

          <p className="animate-fade-up animation-delay-300 max-w-xl text-[#c9a84c]/80 text-sm sm:text-base italic leading-relaxed border-t border-[#c9a84c]/20 pt-4">
            "{t.home.heroMotto}"
          </p>

          <div className="animate-fade-up animation-delay-300 flex flex-col sm:flex-row gap-3 mt-2">
            {/* নতুন ইমার্জেন্সি ব্লাড ডোনার বাটন */}
            <Link
              href="/members?status=blood"
              className="px-7 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 transition-opacity shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
            >
              <Droplet className="w-5 h-5 fill-current" />
              {t.home.heroCtaBlood}
            </Link>
            <Link
              href="/about"
              className="px-7 py-3 rounded-xl font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-lg shadow-[#c9a84c]/20"
            >
              {t.home.heroCtaAbout}
            </Link>
            <Link
              href="/activities"
              className="px-7 py-3 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors"
            >
              {t.home.heroCtaActivities}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {ACTIVITY_KEYS.map(({ key, icon }) => (
              <Link
                key={key}
                href={`/activities?tab=${key}`}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:bg-[#c9a84c]/5 group"
              >
                <span className="text-[#0a1628] group-hover:text-[#c9a84c] group-hover:scale-110 transition-all duration-200">
                  {icon}
                </span>
                <span className="font-semibold text-[#0a1628] text-sm group-hover:text-[#c9a84c] transition-colors duration-200 border-b border-transparent group-hover:border-[#c9a84c]">
                  {
                    t.home.activities[key as keyof typeof t.home.activities]
                      .label
                  }
                </span>
                <span className="text-xs text-gray-500 leading-snug">
                  {
                    t.home.activities[key as keyof typeof t.home.activities]
                      .desc
                  }
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f3ee] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
                {t.home.noticesSuperLabel}
              </p>
              <h2 className="text-3xl font-bold text-[#0a1628]">
                {t.home.noticesTitle}
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:inline-flex text-sm font-semibold text-[#c9a84c] hover:text-[#0a1628] transition-colors"
            >
              {t.common.viewAll}
            </Link>
          </div>

          {latestNotices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNotices.map((notice, i) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  index={i}
                  onOpen={setOpenNotice}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center">
              <ClipboardList
                className="w-12 h-12 mb-3 text-gray-300"
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium">{t.home.noticesEmpty}</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/news" className="text-sm font-semibold text-[#c9a84c]">
              {t.home.noticesViewAllMobile}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0a1628] py-14 text-center text-white">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center gap-5">
          <p className="text-lg font-medium text-gray-300">
            {t.home.facebookCtaText}
          </p>
          <a
            href={siteConfig.links.facebookGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {t.home.facebookCtaButton}
          </a>
        </div>
      </section>

      {/* ── Render the Modal when openNotice is set ── */}
      {openNotice && (
        <NoticeModal notice={openNotice} onClose={() => setOpenNotice(null)} />
      )}
    </>
  );
}
