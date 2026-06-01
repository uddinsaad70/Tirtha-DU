"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Lang } from "@/i18n";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Single hook gives us the dictionary, active lang, and the toggle function
  const { t, lang, toggleLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Build nav links from the dictionary — label comes from t.nav, href is static
  const NAV_LINKS = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/committee", label: t.nav.committee },
    { href: "/activities", label: t.nav.activities },
    { href: "/news", label: t.nav.news },
    { href: "/members", label: t.nav.members },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a1628]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-[#0a1628]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* এখানে bg-white যোগ করা হয়েছে যাতে সব ডিভাইসে ব্যাকগ্রাউন্ড থাকে */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="তীর্থ লোগো"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="flex flex-col leading-none gap-0.5">
              <span className="text-white font-bold text-lg tracking-wide">
                তীর্থ
              </span>
              <span className="text-[#c9a84c] text-[10px] tracking-widest uppercase">
                Tirtho • DU
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[#c9a84c] bg-white/5"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right side: language toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle
              lang={lang}
              onToggle={toggleLang}
              label={t.nav.langToggleLabel}
            />
          </div>

          {/* Mobile: language toggle + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle
              lang={lang}
              onToggle={toggleLang}
              label={t.nav.langToggleLabel}
            />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0"}`}
        >
          <ul className="flex flex-col gap-1 border-t border-white/10 pt-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#c9a84c] bg-white/5"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}

// Black-and-white pill toggle — active lang has dark bg/light text,
// inactive option has light bg/dark text. No border, no globe icon.
function LanguageToggle({
  lang,
  onToggle,
  label,
}: {
  lang: Lang;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={
        label || lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"
      }
      className="flex items-center bg-white/10 rounded-full p-0.5 gap-0.5"
    >
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          lang === "bn"
            ? "bg-white text-[#0a1628]" // active
            : "text-white/60 hover:text-white" // inactive
        }`}
      >
        বাং
      </span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          lang === "en"
            ? "bg-white text-[#0a1628]" // active
            : "text-white/60 hover:text-white" // inactive
        }`}
      >
        EN
      </span>
    </button>
  );
}
