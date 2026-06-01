import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "তীর্থ — ঢাকা বিশ্ববিদ্যালয়", template: "%s | তীর্থ" },
  description:
    "তীর্থ — ঢাকা বিশ্ববিদ্যালয়ের শিক্ষার্থীদের কল্যাণে নিবেদিত সামাজিক সংগঠন।",
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={hindSiliguri.variable}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-[#f5f3ee] text-[#1a1a2e] antialiased"
      >
        {/*
          LanguageProvider is a Client Component but wraps Server Component
          children correctly — Next.js App Router supports this pattern.
          The Navbar and Footer (both "use client") will consume the context.
        */}
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
