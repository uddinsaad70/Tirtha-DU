"use client";

interface Props {
  currentLang: "bn" | "en";
  name?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}

// ২০২০ থেকে current+3 পর্যন্ত অটো-জেনারেট
function generateYears(): number[] {
  const years: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear + 3; y >= 2020; y--) {
    years.push(y);
  }
  return years;
}

const YEARS = generateYears();

function toBanglaDigits(str: string): string {
  const map: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return str.replace(/[0-9]/g, (d) => map[d]);
}

export default function CommitteeYearSelect({
  currentLang,
  name = "committee_year",
  required,
  disabled,
  defaultValue = "",
}: Props) {
  const placeholder =
    currentLang === "bn" ? "— বছর নির্বাচন করুন —" : "— Select year —";

  return (
    <select
      name={name}
      required={required}
      disabled={disabled}
      defaultValue={defaultValue}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all bg-white"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {YEARS.map((y) => (
        <option key={y} value={String(y)}>
          {currentLang === "bn" ? toBanglaDigits(String(y)) : y}
        </option>
      ))}
    </select>
  );
}
