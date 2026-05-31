"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import DeleteButton from "./DeleteButton";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import Pagination from "@/components/Pagination"; // <-- পেজিনেশন ইমপোর্ট

interface Member {
  id: number;
  name: string;
  designation: string | null;
  department: string | null;
  session: string | null;
  blood_group: string | null;
  photo_url: string | null;
  is_alumni: boolean;
}

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0a1628] to-[#1a3a5c] flex items-center justify-center text-[#c9a84c] text-xs font-bold shrink-0 select-none">
      {initials}
    </div>
  );
}

export default function AdminMembersListClient({
  memberList,
  totalCount,
  currentCount,
  alumniCount,
  initialSearch,
  initialSort,
  initialStatus,
  totalPages,
  currentPage,
}: {
  memberList: Member[];
  totalCount: number;
  currentCount: number;
  alumniCount: number;
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

  // ─── URL Update Logic (Search, Sort, Status) ───────────
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

    // যেকোনো ফিল্টার চেঞ্জ হলে পেজ ১ এ চলে যাবে
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
      key: "current",
      labelBn: "বর্তমান",
      labelEn: "Current",
      count: currentCount,
      dot: "bg-green-400",
    },
    {
      key: "alumni",
      labelBn: "সাবেক",
      labelEn: "Alumni",
      count: alumniCount,
      dot: "bg-gray-400",
    },
  ];

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
            {t.adminMembersList.supertitle}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminMembersList.title}
          </h1>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-sm"
        >
          {t.adminMembersList.addBtn}
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
                  ? "নাম বা বিভাগ দিয়ে খুঁজুন..."
                  : "Search by name or department..."
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

      {/* ─── Table and Pagination ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {memberList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mb-4 shadow-sm">
              <Search className="w-7 h-7 opacity-50" />
            </div>
            <h3 className="text-base font-bold text-[#0a1628] mb-1">
              {t.adminMembersList.emptyTitle}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {initialSearch || initialStatus !== "all"
                ? lang === "bn"
                  ? "কোনো ফলাফল পাওয়া যায়নি।"
                  : "No results found."
                : t.adminMembersList.emptyDesc}
            </p>
            {!initialSearch && initialStatus === "all" && (
              <Link
                href="/admin/members/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 shadow-sm"
              >
                {t.adminMembersList.addBtn}
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* thead — same as before, no change */}
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminMembersList.table.member}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      {t.adminMembersList.table.department}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      {t.adminMembersList.table.bloodGroup}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminMembersList.table.status}
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t.adminMembersList.table.action}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {memberList.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50/40 transition-colors duration-100"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={member.name}
                            photoUrl={member.photo_url}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0a1628] truncate leading-tight">
                              {member.name}
                            </p>
                            {member.designation && (
                              <p className="text-xs text-[#c9a84c] font-medium truncate mt-0.5">
                                {member.designation}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-gray-600">
                        {member.department ?? "—"}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {member.blood_group ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-500 ring-1 ring-red-100">
                            {member.blood_group}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            !member.is_alumni
                              ? "bg-green-50 text-green-600 ring-1 ring-green-100"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {!member.is_alumni
                            ? t.adminMembersList.statusCurrent
                            : t.adminMembersList.statusAlumni}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/members/${member.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0a1628] bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 transition-colors"
                          >
                            {t.adminMembersList.editBtn}
                          </Link>
                          <DeleteButton
                            memberId={member.id}
                            memberName={member.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination — border-t দিয়ে আলাদা, content-এর ঠিক নিচে */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
