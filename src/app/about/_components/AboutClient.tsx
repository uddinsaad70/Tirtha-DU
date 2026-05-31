"use client";

import Link from "next/link";
import { BookOpen, HeartHandshake, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import { useCountUp } from "@/hooks/useCountUp";
import { siteConfig } from "@/config/siteConfig";

// ── Impact Stats সেকশনের জন্য Animated কম্পোনেন্ট ──
function AnimatedStat({
  value,
  label,
  lang,
  started,
}: {
  value: string;
  label: string;
  lang: "bn" | "en";
  started: boolean;
}) {
  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9,]/g, "");
  const count = useCountUp(numericPart, 2000, started);
  const display = translateNumbers(
    count.toLocaleString("en-US") + suffix,
    lang,
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl sm:text-4xl font-bold">{display}</span>
      <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
        {label}
      </span>
    </div>
  );
}

// ── মূল AboutClient কম্পোনেন্ট ──
export default function AboutClient({
  dynamicStats,
}: {
  dynamicStats: {
    years: number;
    members: number;
    blood: number;
    students: number;
  };
}) {
  const { t, lang } = useLanguage();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // হিরো সাবটাইটেলের জন্য ডাইনামিক সাল (যেমন: 19 বা ১৯)
  const translatedYears = translateNumbers(dynamicStats.years.toString(), lang);

  // ডিকশনারি থেকে আসা টেক্সটে "১৮", "18" বা "{years}" থাকলে সেটি ডাইনামিক সাল দিয়ে রিপ্লেস হবে
  const dynamicHeroSubtitle = t.about.heroSubtitle
    .replace("{years}", translatedYears)
    .replace("১৮", translatedYears)
    .replace("18", translatedYears);

  const statsToRender = [
    { value: `${dynamicStats.years}+`, label: t.about.statLabels.years },
    {
      value: `${dynamicStats.members.toLocaleString("en-US")}+`,
      label: t.about.statLabels.members,
    },
    {
      value: `${dynamicStats.blood.toLocaleString("en-US")}+`,
      label: t.about.statLabels.blood,
    },
    {
      value: `${dynamicStats.students.toLocaleString("en-US")}+`,
      label: t.about.statLabels.students,
    },
  ];

  const PILLAR_ICONS = [
    <BookOpen
      key="edu"
      className="w-12 h-12 text-[#c9a84c]"
      strokeWidth={1.5}
    />,
    <HeartHandshake
      key="hum"
      className="w-12 h-12 text-[#c9a84c]"
      strokeWidth={1.5}
    />,
    <Users
      key="unity"
      className="w-12 h-12 text-[#c9a84c]"
      strokeWidth={1.5}
    />,
  ];

  return (
    <>
      {/* ── Page Hero ── */}
      <section className="bg-[#0a1628] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#c9a84c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center flex flex-col items-center gap-5">
          <span className="text-[#c9a84c] text-xs font-bold uppercase tracking-[0.2em] border border-[#c9a84c]/40 rounded-full px-4 py-1.5 animate-fade-up">
            {t.about.heroBadge}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold animate-fade-up animation-delay-100">
            {t.about.heroTitle}
          </h1>
          <p className="max-w-2xl text-gray-300 text-lg leading-relaxed animate-fade-up animation-delay-200">
            {/* এখানে ডাইনামিক সাবটাইটেল বসানো হয়েছে */}
            {dynamicHeroSubtitle}
          </p>
          <p className="text-[#c9a84c]/80 text-sm italic border-t border-[#c9a84c]/20 pt-4 max-w-xl animate-fade-up animation-delay-300">
            {t.about.heroMotto}
          </p>
        </div>
      </section>

      {/* ── Impact Stats (Animated) ── */}
      <section className="bg-[#c9a84c]">
        <div
          ref={statsRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-[#0a1628]">
            {statsToRender.map((stat, idx) => (
              <AnimatedStat
                key={idx}
                value={stat.value}
                label={stat.label}
                lang={lang}
                started={statsStarted}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision (Three Pillars) ── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-2">
              {t.about.pillarsSuperTitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
              {t.about.pillarsTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.about.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-2xl bg-[#f5f3ee] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-5xl mb-5 block group-hover:scale-110 transition-transform duration-300">
                  {PILLAR_ICONS[idx]}
                </span>
                <h3 className="text-xl font-bold text-[#0a1628] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {pillar.body}
                </p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c9a84c]/10 to-transparent rounded-2xl" />
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-3xl mx-auto text-center">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">
              {t.about.missionSuperTitle}
            </p>
            <p className="text-gray-600 text-base leading-loose">
              {t.about.missionBody}
            </p>
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4 mt-10">
              {t.about.visionSuperTitle}
            </p>
            <p className="text-gray-600 text-base leading-loose">
              {t.about.visionBody}
            </p>
          </div>
        </div>
      </section>

      {/* ── History Timeline ── */}
      <section className="bg-[#f5f3ee] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-2">
              {t.about.timelineSuperTitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
              {t.about.timelineTitle}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#c9a84c] via-[#c9a84c]/40 to-transparent hidden sm:block" />

            <div className="flex flex-col gap-10">
              {t.about.timeline.map((item, i) => (
                <div
                  key={i}
                  className="animate-fade-up relative flex gap-6 sm:gap-10"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#0a1628] border-2 border-[#c9a84c] flex items-center justify-center z-10 hidden sm:flex">
                    <span className="text-[10px] font-bold text-[#c9a84c] leading-none text-center">
                      {item.year}
                    </span>
                  </div>

                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="sm:hidden text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">
                        {item.year}
                      </span>
                      <h3 className="text-base font-bold text-[#0a1628]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="bg-[#0a1628] py-16 text-center text-white">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center gap-5">
          <h2 className="text-2xl sm:text-3xl font-bold">{t.about.ctaTitle}</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {t.about.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/contact"
              className="px-7 py-3 rounded-xl font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-opacity shadow-lg"
            >
              {t.about.ctaContactBtn}
            </Link>

            <a
              href={siteConfig.links.facebookGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors"
            >
              {t.about.ctaFacebookBtn}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
