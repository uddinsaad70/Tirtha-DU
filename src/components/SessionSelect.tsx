"use client";

interface Props {
  currentLang: "bn" | "en";
  name?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}

// ২০১৫ থেকে বর্তমান বছর পর্যন্ত অটো-জেনারেট
function generateSessions(): string[] {
  const sessions: string[] = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 2015; y--) {
    const short = String(y + 1).slice(2); // "26" from 2026
    sessions.push(`${y}-${short}`);
  }
  return sessions;
}

const SESSIONS = generateSessions();

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

export default function SessionSelect({
  currentLang,
  name = "session",
  required,
  disabled,
  defaultValue = "",
}: Props) {
  const placeholder =
    currentLang === "bn" ? "— সেশন নির্বাচন করুন —" : "— Select session —";

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
      {SESSIONS.map((s) => (
        <option key={s} value={s}>
          {currentLang === "bn" ? toBanglaDigits(s) : s}
        </option>
      ))}
    </select>
  );
}
