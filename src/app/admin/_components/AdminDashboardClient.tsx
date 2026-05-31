"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import { useCountUp } from "@/hooks/useCountUp";
import type { RecentActivityItem } from "../page";

interface StatCard {
  key: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  borderClass: string;
}

function AnimatedDashboardStat({
  value,
  lang,
}: {
  value: number;
  lang: "bn" | "en";
}) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  const count = useCountUp(value, 2000, started);

  return (
    <p className="text-2xl font-bold text-[#0a1628] leading-none mb-1">
      {translateNumbers(count.toLocaleString("en-US"), lang)}
    </p>
  );
}

// ── সময় ফরম্যাট করার হেল্পার ──
function formatRelativeTime(isoString: string, lang: "bn" | "en"): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (lang === "bn") {
    if (days > 0) return `${days} দিন আগে`;
    if (hours > 0) return `${hours} ঘণ্টা আগে`;
    if (minutes > 0) return `${minutes} মিনিট আগে`;
    return "এইমাত্র";
  } else {
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  }
}

// ── dot রঙ অনুযায়ী লেবেল ──
function getActivityPrefix(
  dot: RecentActivityItem["dot"],
  t: ReturnType<typeof useLanguage>["t"],
): string {
  if (dot === "bg-blue-400")
    return t.adminDashboard.recentActivity.prefixNotice;
  if (dot === "bg-green-400")
    return t.adminDashboard.recentActivity.prefixMember;
  return t.adminDashboard.recentActivity.prefixActivity;
}

export default function AdminDashboardClient({
  adminEmail,
  stats,
  recentActivity,
}: {
  adminEmail: string;
  stats: {
    totalMembers: number;
    publishedNotices: number;
    totalActivities: number;
    bloodUnits: number;
  };
  recentActivity: RecentActivityItem[];
}) {
  const { t, lang } = useLanguage();

  const STAT_CARDS: StatCard[] = [
    {
      key: "totalMembers",
      value: stats.totalMembers,
      colorClass: "bg-blue-50 text-blue-600",
      borderClass: "border-l-blue-400",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      key: "publishedNotices",
      value: stats.publishedNotices,
      colorClass: "bg-[#c9a84c]/10 text-[#c9a84c]",
      borderClass: "border-l-[#c9a84c]",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      key: "totalActivities",
      value: stats.totalActivities,
      colorClass: "bg-purple-50 text-purple-600",
      borderClass: "border-l-purple-400",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "bloodUnits",
      value: stats.bloodUnits,
      colorClass: "bg-red-50 text-red-500",
      borderClass: "border-l-red-400",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  const QUICK_ACTIONS = [
    {
      href: "/admin/notices/new",
      label: t.adminDashboard.quickActions.newNotice,
      icon: "📋",
      desc: t.adminDashboard.quickActions.newNoticeDesc,
    },
    {
      href: "/admin/members/new",
      label: t.adminDashboard.quickActions.addMember,
      icon: "👤",
      desc: t.adminDashboard.quickActions.addMemberDesc,
    },
    {
      href: "/admin/activities/new",
      label: t.adminDashboard.quickActions.addActivity,
      icon: "📌",
      desc: t.adminDashboard.quickActions.addActivityDesc,
    },
  ];

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
          {t.adminDashboard.supertitle}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
          {t.adminDashboard.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t.adminDashboard.welcomeMsg}
          <span className="font-medium text-[#0a1628]">{adminEmail}</span>
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map((card) => {
          const label =
            t.adminDashboard.statLabels[
              card.key as keyof typeof t.adminDashboard.statLabels
            ];

          const subtextKeyMap: Record<
            string,
            keyof typeof t.adminDashboard.statLabels
          > = {
            totalMembers: "membersSubtext",
            publishedNotices: "noticesSubtext",
            totalActivities: "activitiesSubtext",
            bloodUnits: "bloodSubtext",
          };
          const subtext = t.adminDashboard.statLabels[subtextKeyMap[card.key]];

          return (
            <div
              key={card.key}
              className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${card.borderClass} shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex items-start gap-4`}
            >
              <div
                className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${card.colorClass}`}
              >
                {card.icon}
              </div>
              <div className="min-w-0">
                <AnimatedDashboardStat value={card.value} lang={lang} />
                <p className="text-sm font-semibold text-[#0a1628]">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Recent Activity ── */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0a1628]">
              {t.adminDashboard.recentActivity.title}
            </h2>
            <span className="text-xs text-gray-400">
              {t.adminDashboard.recentActivity.subtitle}
            </span>
          </div>
          <ul className="divide-y divide-gray-50">
            {recentActivity.length === 0 ? (
              <li className="px-6 py-8 text-center text-sm text-gray-400">
                {t.adminDashboard.recentActivity.empty}
              </li>
            ) : (
              recentActivity.map((item, idx) => (
                <li
                  key={`${item.dot}-${idx}`}
                  className="px-6 py-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors duration-150"
                >
                  <span
                    className={`shrink-0 mt-1.5 w-2 h-2 rounded-full ${item.dot}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0a1628] leading-snug">
                      <span className="font-medium text-gray-400 mr-1">
                        {getActivityPrefix(item.dot, t)}
                      </span>
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatRelativeTime(item.time, lang)}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* ── Quick Actions ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-[#0a1628]">
              {t.adminDashboard.quickActions.title}
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 transition-all duration-200 group"
              >
                <span className="text-2xl shrink-0">{action.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#c9a84c] transition-colors duration-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mx-4 mb-4 p-4 rounded-xl bg-[#0a1628] text-center">
            <p className="text-xs text-[#c9a84c]/80 italic leading-relaxed">
              {t.adminDashboard.motto}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
