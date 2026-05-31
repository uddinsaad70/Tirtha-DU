"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { resolveDesignation } from "@/constants/designations";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import Pagination from "@/components/Pagination";
import {
  X,
  Phone,
  Building2,
  Calendar,
  Award,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Loader2,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
  department: string;
  session: string | null;
  photo_url: string | null;
  facebook_url: string | null;
  committee_year: string | null;
  is_alumni: boolean;
  blood_group?: string | null;
  phone?: string | null;
  bio?: string | null;
}

type TabKey = "current" | "alumni";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toBengaliYear(year: number): string {
  const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(year)
    .split("")
    .map((ch) => BENGALI_DIGITS[parseInt(ch)] ?? ch)
    .join("");
}

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function Avatar({
  name,
  photoUrl,
  size = "md",
}: {
  name: string;
  photoUrl: string | null;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "w-24 h-24" : "w-20 h-20";
  const textSize = size === "lg" ? "text-3xl" : "text-2xl";

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${dim} rounded-full object-cover ring-2 ring-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-[#0a1628] to-[#1a3a5c] flex items-center justify-center ring-2 ring-gray-100 shadow-sm`}
    >
      <span className={`text-[#c9a84c] font-bold ${textSize}`}>
        {getInitials(name)}
      </span>
    </div>
  );
}

// ─── Member Detail Modal ──────────────────────────────────────────────────────

function MemberModal({
  member,
  onClose,
}: {
  member: CommitteeMember;
  onClose: () => void;
}) {
  const { t, lang } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const displaySession = translateNumbers(member.session, lang);
  const displayCommitteeYear = translateNumbers(member.committee_year, lang);
  const displayPhone = translateNumbers(member.phone ?? null, lang);

  const designationLabel = member.designation
    ? resolveDesignation(member.designation, lang)
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up flex flex-col max-h-[90vh]">
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]" />

        {/* Header */}
        <div className="bg-[#0a1628] px-6 pt-8 pb-6 flex flex-col items-center text-center relative shrink-0">
          <button
            onClick={onClose}
            aria-label={t.members.modalClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <Avatar name={member.name} photoUrl={member.photo_url} size="lg" />
          <h2 className="text-white font-bold text-xl mt-4 leading-snug">
            {member.name}
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {designationLabel && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#c9a84c] text-[#0a1628]">
                ⭐ {designationLabel}
              </span>
            )}
            {member.is_alumni && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                🎓 {t.members.badgeAlumni}
              </span>
            )}
            {member.blood_group && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 ring-1 ring-red-500/30">
                🩸 {member.blood_group}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Info Body */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {member.department && (
            <InfoRow
              icon={<Building2 className="w-5 h-5 text-gray-400" />}
              label={t.members.fieldDepartment}
              value={member.department}
            />
          )}
          {displaySession && (
            <InfoRow
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
              label={t.members.fieldSession}
              value={displaySession}
            />
          )}
          {displayCommitteeYear && (
            <InfoRow
              icon={<Award className="w-5 h-5 text-gray-400" />}
              label={t.members.fieldCommittee}
              value={displayCommitteeYear}
            />
          )}
          {displayPhone && (
            <InfoRow
              icon={<Phone className="w-5 h-5 text-[#c9a84c]" />}
              label={t.members.fieldPhone}
              value={
                <a
                  href={`tel:${member.phone}`}
                  className="text-[#c9a84c] hover:underline font-semibold"
                >
                  {displayPhone}
                </a>
              }
            />
          )}
          {member.bio && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                {t.members.fieldBio}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {member.bio}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            {t.members.modalClose}
          </button>
          {member.facebook_url && (
            <a
              href={member.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t.members.modalFacebookCta}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-medium text-[#0a1628]">{value}</p>
      </div>
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  onOpen,
}: {
  member: CommitteeMember;
  index: number;
  onOpen: (m: CommitteeMember) => void;
}) {
  const { t, lang } = useLanguage();
  const delay = `${Math.min(index * 0.04, 0.4)}s`;
  const isCommittee = Boolean(member.designation);

  const designationLabel = member.designation
    ? resolveDesignation(member.designation, lang)
    : null;
  const displaySession = translateNumbers(member.session, lang);

  return (
    <article
      className="animate-fade-up bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
      style={{ animationDelay: delay }}
      onClick={() => onOpen(member)}
    >
      {/* Cover Pattern */}
      <div className="h-20 bg-gradient-to-br from-[#0a1628] to-[#1a2f4e] relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        {member.blood_group && (
          <span className="absolute top-3 right-3 text-[10px] font-bold text-white/90 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 z-10">
            🩸 {member.blood_group}
          </span>
        )}
      </div>

      <div className="px-5 pb-5 flex flex-col items-center flex-1 text-center relative">
        <div className="-mt-10 mb-3 relative z-10">
          <Avatar name={member.name} photoUrl={member.photo_url} />
        </div>

        <h3 className="font-bold text-[#0a1628] text-base leading-snug px-2 line-clamp-2">
          {member.name}
        </h3>

        {/* Role badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-2 mb-3 min-h-[1.5rem]">
          {isCommittee && designationLabel && (
            <span className="text-[10px] font-bold text-[#0a1628] bg-[#c9a84c] px-2.5 py-0.5 rounded-full shadow-sm">
              ⭐ {designationLabel}
            </span>
          )}
          {member.is_alumni && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              🎓 {t.members.badgeAlumni}
            </span>
          )}
        </div>

        <div className="w-full pt-3 mt-auto border-t border-gray-100 flex flex-col gap-1.5 text-xs text-gray-500">
          <div className="flex items-center justify-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{member.department ?? "—"}</span>
          </div>
          {displaySession && (
            <div className="flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{displaySession}</span>
            </div>
          )}
        </div>

        {/* Hover Action */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
          <span className="text-xs font-semibold text-[#c9a84c] flex items-center gap-1 bg-white shadow-sm ring-1 ring-gray-100 px-4 py-1.5 rounded-full">
            {t.members.cardHoverCta} <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function CommitteeHero() {
  const { t } = useLanguage();
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
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-[0.2em] mb-3">
          {t.committee.pageSupertitle}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {t.committee.pageTitle}
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base leading-relaxed">
          {t.committee.pageSubtitle}
        </p>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommitteeTabs({
  members,
  currentCount,
  alumniCount,
  currentYear,
  initialSearch,
  initialSort,
  initialStatus,
  totalPages,
  currentPage,
}: {
  members: CommitteeMember[];
  currentCount: number;
  alumniCount: number;
  currentYear: number;
  initialSearch: string;
  initialSort: string;
  initialStatus: string;
  totalPages: number;
  currentPage: number;
}) {
  const [openMember, setOpenMember] = useState<CommitteeMember | null>(null);
  const { lang, t } = useLanguage();
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

    if (newStatus && newStatus !== "current") params.set("status", newStatus);
    else params.delete("status");

    params.set("page", "1");

    startTransition(() => {
      // scroll: false দেওয়া হয়েছে যাতে ট্যাব পরিবর্তন করার সময় পেজ স্ক্রল হয়ে উপরে না যায়
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(searchValue, initialSort, initialStatus);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams(searchValue, e.target.value, initialStatus);
  };

  // ─── Tabs Content ───
  const currentYearBn = toBengaliYear(currentYear);
  const tabLabels: Record<TabKey, string> = {
    current:
      lang === "bn"
        ? `${t.committee.tabCurrent} (${currentYearBn})`
        : `${t.committee.tabCurrent} (${currentYear})`,
    alumni: t.committee.tabAlumni,
  };

  return (
    <>
      <CommitteeHero />

      {/* ─── Sticky Tabs ─── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {(["current", "alumni"] as TabKey[]).map((key) => (
              <button
                key={key}
                onClick={() => updateParams(searchValue, initialSort, key)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  initialStatus === key
                    ? "border-[#c9a84c] text-[#c9a84c]"
                    : "border-transparent text-gray-500 hover:text-[#0a1628]"
                }`}
              >
                {tabLabels[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-[#f5f3ee] py-8 sm:py-10 flex flex-col min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
          {/* ─── Search + Sort Bar ─── */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  lang === "bn"
                    ? "নাম, পদবী বা বিভাগ দিয়ে খুঁজুন..."
                    : "Search by name, designation or dept..."
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
                  <option value="session_desc">
                    {lang === "bn" ? "সেশন অনুযায়ী" : "By Session"}
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

          {/* ─── Alumni Note ─── */}
          {initialStatus === "alumni" && !initialSearch && (
            <div className="mb-6 p-4 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl text-sm text-[#0a1628] font-medium text-center shadow-sm">
              {t.committee.alumniNote}
            </div>
          )}

          {/* ─── Grid / Empty State ─── */}
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Users className="w-12 h-12 mb-4 opacity-50 text-[#c9a84c]" />
              <p className="text-base font-medium text-[#0a1628]">
                {initialSearch
                  ? lang === "bn"
                    ? "কোনো মেম্বার পাওয়া যায়নি।"
                    : "No members found."
                  : t.committee.emptyState}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {members.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={i}
                  onOpen={setOpenMember}
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

      {/* Render Modal if a member is clicked */}
      {openMember && (
        <MemberModal member={openMember} onClose={() => setOpenMember(null)} />
      )}
    </>
  );
}
