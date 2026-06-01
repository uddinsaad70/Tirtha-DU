"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { resolveDesignation } from "@/constants/designations";
import { translateNumbers } from "@/utils/translateNumbers";
import Pagination from "@/components/Pagination";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  Users,
  ChevronRight,
  X,
  Phone,
  Building2,
  Calendar,
  Award,
  Droplet,
  Star,
  GraduationCap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Member {
  id: number;
  name: string;
  designation: string | null;
  department: string | null;
  session: string | null;
  phone: string | null;
  facebook_url: string | null;
  photo_url: string | null;
  bio: string | null;
  committee_year: string | null;
  is_current: boolean;
  is_alumni: boolean;
  blood_group: string | null;
}

export interface MembersClientProps {
  members: Member[];
  totalCount: number;
  currentCount: number;
  alumniCount: number;
  committeeCount: number;
  bloodGroupCount: number;
  initialSearch: string;
  initialSort: string;
  initialStatus: string;
  totalPages: number;
  currentPage: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

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

// ─── Hero ────────────────────────────────────────────────────────────────────

function MembersHero({
  totalCount,
  currentCount,
  alumniCount,
  committeeCount,
  bloodGroupCount,
}: {
  totalCount: number;
  currentCount: number;
  alumniCount: number;
  committeeCount: number;
  bloodGroupCount: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0a1628] text-white relative overflow-hidden">
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
          {t.members.pageSupertitle}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {t.members.pageTitle}
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-base leading-relaxed">
          {t.members.pageSubtitle}
        </p>

        {totalCount > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
            <div>
              <p className="text-3xl font-bold text-white">{totalCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t.members.statTotal}
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">{currentCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t.members.statCurrent}
              </p>
            </div>
            {alumniCount > 0 && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-white">{alumniCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.members.statAlumni}
                  </p>
                </div>
              </>
            )}
            {committeeCount > 0 && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-[#c9a84c]">
                    {committeeCount}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.members.statCommittee}
                  </p>
                </div>
              </>
            )}
            {bloodGroupCount > 0 && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-red-400">
                    {bloodGroupCount}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.members.statBloodGroups}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Member Detail Modal ─────────────────────────────────────────────────────

function MemberModal({
  member,
  onClose,
}: {
  member: Member;
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
  const displayPhone = translateNumbers(member.phone, lang);

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

          {/* Modal Header Badges with Lucide Icons */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {designationLabel && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#c9a84c] text-[#0a1628]">
                <Star className="w-3 h-3 fill-current" /> {designationLabel}
              </span>
            )}
            {member.is_alumni && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                <GraduationCap className="w-3 h-3" /> {t.members.badgeAlumni}
              </span>
            )}
            {member.blood_group && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 ring-1 ring-red-500/30">
                <Droplet className="w-3 h-3 fill-current" />{" "}
                {member.blood_group}
              </span>
            )}
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-3 overflow-y-auto">
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
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                {t.members.fieldBio}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {member.bio}
              </p>
            </div>
          )}
        </div>

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
  member: Member;
  index: number;
  onOpen: (m: Member) => void;
}) {
  const { t, lang } = useLanguage();
  const delay = `${Math.min(index * 0.04, 0.4)}s`;
  const isCommittee = Boolean(member.designation);

  const designationLabel = member.designation
    ? resolveDesignation(member.designation, lang)
    : null;

  // Department এর নাম থেকে "Department of " অংশটুকু স্বয়ংক্রিয়ভাবে বাদ দেওয়ার লজিক
  const cleanDepartment = member.department
    ? member.department.replace(/^Department of\s+/i, "")
    : "—";

  return (
    <article
      className="animate-fade-up bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer flex flex-col h-full"
      style={{ animationDelay: delay }}
      onClick={() => onOpen(member)}
    >
      {/* Blood Group Badge with Lucide Icon */}
      {member.blood_group && (
        <span className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 z-10">
          <Droplet className="w-3 h-3 fill-current" /> {member.blood_group}
        </span>
      )}

      <div className="flex flex-col items-center text-center mt-1 flex-1">
        <Avatar name={member.name} photoUrl={member.photo_url} />
        <h3 className="font-bold text-[#0a1628] text-base leading-snug mt-4 px-2">
          {member.name}
        </h3>

        {/* Role & Session badges with Lucide Icons (Vertically Aligned) */}
        <div className="flex flex-col items-center gap-1.5 mt-2 mb-3 min-h-[1.5rem]">
          {isCommittee && designationLabel && (
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#0a1628] bg-[#c9a84c] px-2 py-0.5 rounded-full text-center">
              <Star className="w-3 h-3 shrink-0 fill-current" />{" "}
              {designationLabel}
            </span>
          )}
          {member.is_alumni && (
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full text-center">
              <GraduationCap className="w-3 h-3 shrink-0" />{" "}
              {t.members.badgeAlumni}
            </span>
          )}
          {member.session && (
            <span className="flex items-center justify-center gap-1 text-[10px] font-mono text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full text-center">
              <Calendar className="w-3 h-3 shrink-0" />{" "}
              {translateNumbers(member.session, lang)}
            </span>
          )}
        </div>

        {/* Updated Department Name: Thicker (semibold) and Darker (gray-700) */}
        <div className="w-full pt-3 mt-auto border-t border-gray-100 flex justify-center items-center text-xs text-gray-700">
          <span className="font-semibold text-center line-clamp-2 px-2 leading-tight">
            {cleanDepartment}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 bg-gradient-to-t from-white via-white to-transparent opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 flex justify-center">
          <p className="text-[10px] text-[#c9a84c] font-bold uppercase tracking-wider flex items-center gap-1 bg-white shadow-sm ring-1 ring-gray-100 px-3 py-1 rounded-full">
            {t.members.cardHoverCta} <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export default function MembersClient({
  members,
  totalCount,
  currentCount,
  alumniCount,
  committeeCount,
  bloodGroupCount,
  initialSearch,
  initialSort,
  initialStatus,
  totalPages,
  currentPage,
}: MembersClientProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [openMember, setOpenMember] = useState<Member | null>(null);
  const [searchValue, setSearchValue] = useState(initialSearch);

  // ─── URL Update Logic ───────────
  const updateParams = (
    newSearch: string,
    newSort: string,
    newStatus: string,
    newBloodGroup?: string, // <--- এই ৪ নম্বর আর্গুমেন্টটি যোগ করা হয়েছে
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newSort && newSort !== "newest") params.set("sort", newSort);
    else params.delete("sort");

    if (newStatus && newStatus !== "all") params.set("status", newStatus);
    else params.delete("status");

    // ব্লাড গ্রুপের জন্য লজিক
    if (newStatus === "blood" && newBloodGroup) {
      params.set("blood", newBloodGroup);
    } else {
      params.delete("blood");
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(
      searchValue,
      initialSort,
      initialStatus,
      searchParams.get("blood") || "",
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams(
      searchValue,
      e.target.value,
      initialStatus,
      searchParams.get("blood") || "",
    );
  };

  const tabs = [
    { key: "all", label: t.members.tabAll, count: totalCount },
    { key: "current", label: t.members.tabCurrent, count: currentCount },
    { key: "alumni", label: t.members.tabAlumni, count: alumniCount },
    { key: "blood", label: t.members.tabBlood, count: bloodGroupCount },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="bg-[#f5f3ee] min-h-screen pb-20 flex flex-col">
      <MembersHero
        totalCount={totalCount}
        currentCount={currentCount}
        alumniCount={alumniCount}
        committeeCount={committeeCount}
        bloodGroupCount={bloodGroupCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
        {/* ── Controls (Tabs + Search + Sort) ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          {/* Tab switcher (Pill shaped) */}
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-full lg:w-auto overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => updateParams(searchValue, initialSort, tab.key)}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  initialStatus === tab.key
                    ? "bg-[#0a1628] text-[#c9a84c] shadow-md"
                    : "text-gray-500 hover:text-[#0a1628]"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                      initialStatus === tab.key
                        ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {translateNumbers(tab.count.toString(), lang)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <form
              onSubmit={handleSearch}
              className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 w-full sm:w-64 md:w-72"
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={
                  lang === "bn" ? "নাম, পদবী বা বিভাগ..." : "Search members..."
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full outline-none text-sm text-[#0a1628] placeholder-gray-400 bg-transparent"
              />
              <button type="submit" className="hidden" />
            </form>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={initialSort}
                onChange={handleSortChange}
                className="w-full sm:w-48 pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 transition-all bg-white appearance-none cursor-pointer h-full"
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
                {isPending ? (
                  <Loader2 className="w-4 h-4 text-[#c9a84c] animate-spin" />
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>

        {initialStatus === "blood" && (
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2 bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-up">
            <span className="w-full sm:w-auto flex justify-center items-center gap-1.5 text-sm font-bold text-red-700 mb-1 sm:mb-0 sm:mr-2">
              <Droplet className="w-4 h-4 fill-current" />{" "}
              {t.members.filterBloodGroup}
            </span>

            {bloodGroups.map((bg) => {
              const isActive = searchParams.get("blood") === bg;
              return (
                <button
                  key={bg}
                  onClick={() =>
                    updateParams(
                      searchValue,
                      initialSort,
                      "blood",
                      isActive ? "" : bg,
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-red-500 text-white shadow-md scale-105"
                      : "bg-white text-red-600 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  {bg}
                </button>
              );
            })}
          </div>
        )}
        {/* ── Grid or empty state ──────────────────────────────────────────── */}
        {members.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Users className="w-12 h-12 mb-4 text-[#c9a84c] opacity-50" />
            <p className="text-base font-semibold text-[#0a1628]">
              {initialSearch || searchParams.get("blood")
                ? lang === "bn"
                  ? "কোনো মেম্বার পাওয়া যায়নি।"
                  : "No members found."
                : t.members.emptyState}
            </p>
            {(initialSearch || searchParams.get("blood")) && (
              <p className="text-sm text-gray-400 mt-1">
                {initialSearch && `"${initialSearch}" — `}
                {searchParams.get("blood") &&
                  `Blood Group: ${searchParams.get("blood")} — `}
                {t.members.emptyStateSearchHint}
              </p>
            )}

            {/* ফিল্টার ক্লিয়ার বাটন */}
            {(initialSearch || searchParams.get("blood")) && (
              <button
                onClick={() => updateParams("", initialSort, initialStatus, "")}
                className="mt-4 text-sm text-red-500 hover:underline font-semibold"
              >
                {t.members.emptyStateClearFilters}
              </button>
            )}
          </div>
        )}

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="mt-auto pt-10">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-3xl mx-auto">
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {openMember && (
        <MemberModal member={openMember} onClose={() => setOpenMember(null)} />
      )}
    </div>
  );
}
