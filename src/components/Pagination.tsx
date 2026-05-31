"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
      <p className="text-xs text-gray-500">
        {lang === "bn" ? "পৃষ্ঠা" : "Page"}{" "}
        <span className="font-bold text-[#0a1628]">
          {translateNumbers(currentPage.toString(), lang)}
        </span>{" "}
        {lang === "bn" ? "এর মধ্যে" : "of"}{" "}
        <span className="font-bold text-[#0a1628]">
          {translateNumbers(totalPages.toString(), lang)}
        </span>
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#c9a84c] transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </span>
        )}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={createPageURL(currentPage + 1)}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-[#c9a84c] transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="p-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
}
