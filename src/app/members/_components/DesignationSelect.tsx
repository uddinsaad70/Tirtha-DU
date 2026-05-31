"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  DESIGNATION_GROUPS,
  DESIGNATION_MAP,
  type DesignationKey,
} from "@/constants/designations";

interface Props {
  currentLang?: "bn" | "en";
  defaultValue?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function DesignationSelect({
  defaultValue = "",
  name = "designation",
  required = false,
  disabled = false,
}: Props) {
  // Reads active language from global context — no prop needed
  const { lang, t } = useLanguage();

  return (
    <select
      name={name}
      defaultValue={defaultValue}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all bg-white disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {/* Placeholder option uses dictionary key */}
      <option value="">{t.adminMembers.selectDesignationPlaceholder}</option>

      {DESIGNATION_GROUPS.map((group) => (
        <optgroup
          key={group.groupLabel.en}
          // Group label switches with global language toggle
          label={group.groupLabel[lang]}
        >
          {group.keys.map((key: DesignationKey) => (
            <option key={key} value={key}>
              {/* Option display text switches with global language toggle */}
              {DESIGNATION_MAP[key][lang]}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
