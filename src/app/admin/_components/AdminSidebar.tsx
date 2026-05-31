"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

// ─── Navigation link definitions (Dynamic function) ──────────────────────────
interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

// `t` (ডিকশনারি) পাস করে ডায়নামিক লিঙ্ক জেনারেট করার ফাংশন
const getNavLinks = (t: any): NavLink[] => [
  {
    href: "/admin",
    label: t.adminSidebar.nav.dashboard,
    exact: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: "/admin/notices",
    label: t.adminSidebar.nav.notices,
    icon: (
      <svg
        className="w-5 h-5"
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
    href: "/admin/members",
    label: t.adminSidebar.nav.members,
    icon: (
      <svg
        className="w-5 h-5"
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
    href: "/admin/activities",
    label: t.adminSidebar.nav.activities,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
    ),
  },
  {
    href: "/admin/gallery",
    label: t.adminSidebar.nav.gallery,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

function NavItem({
  link,
  active,
  onClick,
}: {
  link: NavLink;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active ? "bg-[#c9a84c] text-[#0a1628] shadow-md shadow-[#c9a84c]/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
    >
      <span
        className={`shrink-0 transition-transform duration-200 ${active ? "" : "group-hover:scale-110"}`}
      >
        {link.icon}
      </span>
      <span>{link.label}</span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  onNavClick,
  onLogout,
  loggingOut,
}: {
  pathname: string;
  onNavClick?: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  const { t, lang, toggleLang } = useLanguage();
  const NAV_LINKS = getNavLinks(t);

  function isActive(link: NavLink) {
    return link.exact ? pathname === link.href : pathname.startsWith(link.href);
  }

  return (
    <div className="flex flex-col h-full bg-[#0a1628]">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c96d] flex items-center justify-center text-[#0a1628] font-bold text-lg shadow-md shrink-0">
            তী
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-base">
              {t.adminSidebar.brand}
            </span>
            <span className="text-[#c9a84c] text-[10px] tracking-widest uppercase">
              {t.adminSidebar.brandSub}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-4 mb-2">
          {t.adminSidebar.menuLabel}
        </p>
        {NAV_LINKS.map((link) => (
          <NavItem
            key={link.href}
            link={link}
            active={isActive(link)}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-2">
        {/* Language Toggle for Desktop Sidebar */}
        {/* <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Language
          </span>
          <button
            onClick={toggleLang}
            className="px-3 py-1 text-xs font-bold rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 transition-colors"
          >
            {lang === "bn" ? "EN" : "বাং"}
          </button>
        </div> */}
        {/* Language Toggle for Desktop Sidebar */}
        <div className="flex items-center justify-between px-4 py-3 mb-2">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Language
          </span>
          <button
            onClick={toggleLang}
            aria-label={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
            className="flex items-center bg-white/10 rounded-full p-0.5 gap-0.5"
          >
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                lang === "bn"
                  ? "bg-[#c9a84c] text-[#0a1628]" // active
                  : "text-white/60 hover:text-white" // inactive
              }`}
            >
              বাং
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                lang === "en"
                  ? "bg-[#c9a84c] text-[#0a1628]" // active
                  : "text-white/60 hover:text-white" // inactive
              }`}
            >
              EN
            </span>
          </button>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavClick}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span>{t.adminSidebar.viewSite}</span>
        </Link>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full text-left"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>
            {loggingOut ? t.adminSidebar.loggingOut : t.adminSidebar.logout}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, toggleLang } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* 💻 Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen bg-[#0a1628] border-r border-white/10 z-30">
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* 📱 Mobile Header (Top Bar) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-[#0a1628] border-b border-white/10 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c96d] flex items-center justify-center text-[#0a1628] font-bold text-sm">
            তী
          </div>
          <span className="text-white font-bold text-sm">
            {t.adminSidebar.brandSub}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Toggle for Mobile Header */}
          {/* Language Toggle for Mobile Header */}
          <button
            onClick={toggleLang}
            aria-label={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
            className="flex items-center bg-white/10 rounded-full p-0.5 gap-0.5 mr-2"
          >
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 ${
                lang === "bn"
                  ? "bg-[#c9a84c] text-[#0a1628]" // active
                  : "text-white/60 hover:text-white" // inactive
              }`}
            >
              বাং
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200 ${
                lang === "en"
                  ? "bg-[#c9a84c] text-[#0a1628]" // active
                  : "text-white/60 hover:text-white" // inactive
              }`}
            >
              EN
            </span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -mr-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* 📱 Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Drawer Menu */}
          <div
            className="absolute top-0 left-0 h-full w-72 bg-[#0a1628] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-50"
              aria-label="Close menu"
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
            <SidebarContent
              pathname={pathname}
              onNavClick={() => setDrawerOpen(false)}
              onLogout={handleLogout}
              loggingOut={loggingOut}
            />
          </div>
        </div>
      )}
    </>
  );
}
