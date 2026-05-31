import { type Lang } from "@/i18n";

export function translateNumbers(
  str: string | null,
  targetLang: Lang,
): string | null {
  if (!str) return null; // যদি ডেটা না থাকে (যেমন সেশন ফাঁকা), তাহলে null রিটার্ন করবে

  const en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  // স্ট্রিংয়ের প্রতিটি অক্ষর (character) চেক করবে
  return str
    .split("")
    .map((char) => {
      if (targetLang === "bn") {
        // যদি ভাষা বাংলা হয়, ইংরেজি সংখ্যাকে বাংলায় কনভার্ট করবে
        const idx = en.indexOf(char);
        return idx !== -1 ? bn[idx] : char;
      } else {
        // যদি ভাষা ইংরেজি হয়, বাংলা সংখ্যাকে ইংরেজিতে কনভার্ট করবে
        const idx = bn.indexOf(char);
        return idx !== -1 ? en[idx] : char;
      }
    })
    .join("");
}
