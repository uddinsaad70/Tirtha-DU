"use client";

import { DU_FACULTIES } from "@/data/du-departments";

interface Props {
  currentLang: "bn" | "en";
  name?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}

export default function DepartmentSelect({
  currentLang,
  name = "department",
  required,
  disabled,
  defaultValue = "",
}: Props) {
  const placeholder =
    currentLang === "bn" ? "— বিভাগ নির্বাচন করুন —" : "— Select department —";

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
      {DU_FACULTIES.map((faculty) => (
        <optgroup
          key={faculty.faculty_name_en}
          label={
            currentLang === "bn"
              ? faculty.faculty_name_bn
              : faculty.faculty_name_en
          }
          className="font-bold text-gray-700 bg-gray-50"
        >
          {faculty.departments.map((dept) => (
            <option
              key={dept.name_en}
              value={dept.name_en} // DB-তে সবসময় English সেভ হবে
              className="font-normal text-gray-900 bg-white"
            >
              {currentLang === "bn" ? dept.name_bn : dept.name_en}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
