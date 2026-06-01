"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import { siteConfig } from "@/config/siteConfig";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();

  const currentYear = new Date().getFullYear();
  const displayYear = translateNumbers(currentYear.toString(), lang);

  // Quick links dynamically reading from dictionary
  const QUICK_LINKS = [
    { href: "/about", label: t.footer.links.about },
    { href: "/committee", label: t.footer.links.committee },
    { href: "/activities", label: t.footer.links.activities },
    { href: "/news", label: t.footer.links.news },
    { href: "/members", label: t.footer.links.members },
    { href: "/contact", label: t.footer.links.contact },
  ];

  if (pathname.startsWith("/login") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#060e1c] text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* নতুন লোগো সেকশন */}
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Tirtho Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>

              {/* ডানপাশের টেক্সট */}
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-lg">তীর্থ</span>
                <span className="text-[#c9a84c] text-[10px] tracking-widest uppercase">
                  Tirtho • DU
                </span>
              </div>
            </div>
            <p className="text-sm italic text-[#c9a84c]/70 leading-relaxed border-l-2 border-[#c9a84c]/30 pl-3">
              {t.footer.motto}
            </p>
            <p className="text-sm leading-relaxed">{t.footer.description}</p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              {t.footer.quickLinksTitle}
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[#c9a84c] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
              {t.footer.contactTitle}
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                  {t.footer.emailLabel}
                </span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  info@tirthodu.org
                </a>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                  {t.footer.facebookLabel}
                </span>
                <a
                  href={siteConfig.links.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  facebook.com/tirthodu
                </a>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                  {t.footer.addressLabel}
                </span>
                <span>{t.footer.addressValue}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            {t.footer.copyright.replace(
              "{year}",
              displayYear ?? currentYear.toString(),
            )}
          </p>
          <Link
            href="/admin"
            className="text-gray-600 hover:text-[#c9a84c] transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
