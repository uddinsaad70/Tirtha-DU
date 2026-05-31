export type Lang = "bn" | "en";

export type DesignationKey =
  | "chief_advisor"
  | "advisor"
  | "former_advisor"
  | "president"
  | "senior_vice_president"
  | "vice_president"
  | "general_secretary"
  | "senior_joint_general_secretary"
  | "joint_general_secretary"
  | "organizing_secretary"
  | "office_secretary"
  | "asst_office_secretary"
  | "publicity_secretary"
  | "asst_publicity_secretary"
  | "publication_secretary"
  | "asst_publication_secretary"
  | "student_welfare_male"
  | "student_welfare_female"
  | "program_planning_secretary"
  | "co_curricular_secretary"
  | "sports_secretary"
  | "executive_member";

export interface DesignationEntry {
  bn: string;
  en: string;
}

export const DESIGNATION_MAP: Record<DesignationKey, DesignationEntry> = {
  // Advisors
  chief_advisor: { bn: "প্রধান উপদেষ্টা", en: "Chief Advisor" },
  advisor: { bn: "উপদেষ্টা", en: "Advisor" },
  former_advisor: { bn: "সাবেক উপদেষ্টা", en: "Former Advisor" },

  // Top Leadership
  president: { bn: "সভাপতি", en: "President" },
  senior_vice_president: {
    bn: "সিনিয়র সহ-সভাপতি",
    en: "Senior Vice President",
  },
  vice_president: { bn: "সহ-সভাপতি", en: "Vice President" },
  general_secretary: { bn: "সাধারণ সম্পাদক", en: "General Secretary" },
  senior_joint_general_secretary: {
    bn: "সিনিয়র যুগ্ম-সাধারণ সম্পাদক",
    en: "Senior Joint General Secretary",
  },
  joint_general_secretary: {
    bn: "যুগ্ম-সাধারণ সম্পাদক",
    en: "Joint General Secretary",
  },

  // Secretaries
  organizing_secretary: { bn: "সাংগঠনিক সম্পাদক", en: "Organizing Secretary" },
  office_secretary: { bn: "দপ্তর সম্পাদক", en: "Office Secretary" },
  asst_office_secretary: {
    bn: "উপ-দপ্তর সম্পাদক",
    en: "Assistant Office Secretary",
  },
  publicity_secretary: { bn: "প্রচার সম্পাদক", en: "Publicity Secretary" },
  asst_publicity_secretary: {
    bn: "উপ-প্রচার সম্পাদক",
    en: "Assistant Publicity Secretary",
  },
  publication_secretary: {
    bn: "প্রকাশনা বিষয়ক সম্পাদক",
    en: "Publication Secretary",
  },
  asst_publication_secretary: {
    bn: "উপ-প্রকাশনা বিষয়ক সম্পাদক",
    en: "Assistant Publication Secretary",
  },
  student_welfare_male: {
    bn: "শিক্ষার্থী কল্যাণ বিষয়ক সম্পাদক (ছেলে)",
    en: "Student Welfare Secretary (Male)",
  },
  student_welfare_female: {
    bn: "শিক্ষার্থী কল্যাণ বিষয়ক সম্পাদক (মেয়ে)",
    en: "Student Welfare Secretary (Female)",
  },
  program_planning_secretary: {
    bn: "কর্মসূচি ও পরিকল্পনা বিষয়ক সম্পাদক",
    en: "Program & Planning Secretary",
  },
  co_curricular_secretary: {
    bn: "সহ-শিক্ষা কার্যক্রম বিষয়ক সম্পাদক",
    en: "Co-curricular Activities Secretary",
  },
  sports_secretary: { bn: "ক্রীড়া সম্পাদক", en: "Sports Secretary" },

  // Others
  executive_member: { bn: "কার্যনির্বাহী সদস্য", en: "Executive Member" },
};

export interface DesignationGroup {
  groupLabel: { bn: string; en: string };
  keys: DesignationKey[];
}

export const DESIGNATION_GROUPS: DesignationGroup[] = [
  {
    groupLabel: { bn: "উপদেষ্টামণ্ডলী", en: "Advisors" },
    keys: ["chief_advisor", "advisor", "former_advisor"],
  },
  {
    groupLabel: { bn: "শীর্ষ নেতৃত্ব", en: "Top Leadership" },
    keys: [
      "president",
      "senior_vice_president",
      "vice_president",
      "general_secretary",
      "senior_joint_general_secretary",
      "joint_general_secretary",
    ],
  },
  {
    groupLabel: { bn: "সম্পাদকমণ্ডলী", en: "Secretaries" },
    keys: [
      "organizing_secretary",
      "office_secretary",
      "asst_office_secretary",
      "publicity_secretary",
      "asst_publicity_secretary",
      "publication_secretary",
      "asst_publication_secretary",
      "student_welfare_male",
      "student_welfare_female",
      "program_planning_secretary",
      "co_curricular_secretary",
      "sports_secretary",
    ],
  },
  {
    groupLabel: { bn: "অন্যান্য", en: "Others" },
    keys: ["executive_member"],
  },
];

export function resolveDesignation(
  key: string | null | undefined,
  lang: Lang,
): string {
  if (!key) return "";
  const entry = DESIGNATION_MAP[key as DesignationKey];
  return entry ? entry[lang] : key;
}
