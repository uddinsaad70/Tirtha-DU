export type Department = {
  name_bn: string;
  name_en: string;
};

export type Faculty = {
  faculty_name_bn: string;
  faculty_name_en: string;
  departments: Department[];
};

export const DU_FACULTIES: Faculty[] = [
  {
    faculty_name_bn: "কলা অনুষদ",
    faculty_name_en: "Faculty of Arts",
    departments: [
      { name_bn: "বাংলা বিভাগ", name_en: "Department of Bangla" },
      { name_bn: "ইংরেজি বিভাগ", name_en: "Department of English" },
      { name_bn: "আরবি বিভাগ", name_en: "Department of Arabic" },
      {
        name_bn: "ফারসি ভাষা ও সাহিত্য বিভাগ",
        name_en: "Department of Persian Language and Literature",
      },
      { name_bn: "উর্দু বিভাগ", name_en: "Department of Urdu" },
      { name_bn: "সংস্কৃত বিভাগ", name_en: "Department of Sanskrit" },
      {
        name_bn: "পালি ও বৌদ্ধ শিক্ষা বিভাগ",
        name_en: "Department of Pali and Buddhist Studies",
      },
      { name_bn: "ইতিহাস বিভাগ", name_en: "Department of History" },
      { name_bn: "দর্শন বিভাগ", name_en: "Department of Philosophy" },
      {
        name_bn: "ইসলামিক স্টাডিজ বিভাগ",
        name_en: "Department of Islamic Studies",
      },
      {
        name_bn: "ইসলামের ইতিহাস ও সংস্কৃতি বিভাগ",
        name_en: "Department of Islamic History and Culture",
      },
      {
        name_bn: "তথ্যবিজ্ঞান ও গ্রন্থাগার ব্যবস্থাপনা বিভাগ",
        name_en: "Department of Information Science and Library Management",
      },
      {
        name_bn: "থিয়েটার অ্যান্ড পারফরম্যান্স স্টাডিজ বিভাগ",
        name_en: "Department of Theatre and Performance Studies",
      },
      { name_bn: "ভাষাবিজ্ঞান বিভাগ", name_en: "Department of Linguistics" },
      { name_bn: "সংগীত বিভাগ", name_en: "Department of Music" }, // ← নতুন
      {
        name_bn: "বিশ্ব ধর্ম ও সংস্কৃতি বিভাগ",
        name_en: "Department of World Religions and Culture",
      },
      { name_bn: "নৃত্যকলা বিভাগ", name_en: "Department of Dance" },
    ],
  },
  {
    faculty_name_bn: "বিজ্ঞান অনুষদ",
    faculty_name_en: "Faculty of Science",
    departments: [
      { name_bn: "পদার্থবিজ্ঞান বিভাগ", name_en: "Department of Physics" },
      { name_bn: "রসায়ন বিভাগ", name_en: "Department of Chemistry" },
      { name_bn: "গণিত বিভাগ", name_en: "Department of Mathematics" },
      { name_bn: "পরিসংখ্যান বিভাগ", name_en: "Department of Statistics" },
      {
        name_bn: "তাত্ত্বিক পদার্থবিজ্ঞান বিভাগ",
        name_en: "Department of Theoretical Physics",
      },
      {
        name_bn: "বায়োমেডিকেল ফিজিক্স অ্যান্ড টেকনোলজি বিভাগ",
        name_en: "Department of Biomedical Physics and Technology",
      },
      {
        name_bn: "ফলিত গণিত বিভাগ",
        name_en: "Department of Applied Mathematics",
      },
    ],
  },
  {
    faculty_name_bn: "আইন অনুষদ",
    faculty_name_en: "Faculty of Law",
    departments: [{ name_bn: "আইন বিভাগ", name_en: "Department of Law" }],
  },
  {
    faculty_name_bn: "সামাজিক বিজ্ঞান অনুষদ",
    faculty_name_en: "Faculty of Social Sciences",
    departments: [
      { name_bn: "অর্থনীতি বিভাগ", name_en: "Department of Economics" },
      {
        name_bn: "রাষ্ট্রবিজ্ঞান বিভাগ",
        name_en: "Department of Political Science",
      },
      {
        name_bn: "আন্তর্জাতিক সম্পর্ক বিভাগ",
        name_en: "Department of International Relations",
      },
      { name_bn: "সমাজবিজ্ঞান বিভাগ", name_en: "Department of Sociology" },
      {
        name_bn: "লোক প্রশাসন বিভাগ",
        name_en: "Department of Public Administration",
      },
      {
        name_bn: "গণযোগাযোগ ও সাংবাদিকতা বিভাগ",
        name_en: "Department of Mass Communication and Journalism",
      },
      { name_bn: "নৃবিজ্ঞান বিভাগ", name_en: "Department of Anthropology" },
      {
        name_bn: "জনসংখ্যা বিজ্ঞান বিভাগ",
        name_en: "Department of Population Sciences",
      },
      {
        name_bn: "শান্তি ও সংঘর্ষ অধ্যয়ন বিভাগ",
        name_en: "Department of Peace and Conflict Studies",
      },
      {
        name_bn: "নারী ও লিঙ্গ অধ্যয়ন বিভাগ",
        name_en: "Department of Women and Gender Studies",
      }, // ← নতুন
      {
        name_bn: "উন্নয়ন অধ্যয়ন বিভাগ",
        name_en: "Department of Development Studies",
      },
      {
        name_bn: "টেলিভিশন, চলচ্চিত্র ও আলোকচিত্র বিভাগ",
        name_en: "Department of Television, Film and Photography",
      }, // ← নতুন
      { name_bn: "অপরাধবিজ্ঞান বিভাগ", name_en: "Department of Criminology" },
      {
        name_bn: "যোগাযোগ বৈকল্য বিভাগ",
        name_en: "Department of Communication Disorders",
      },
      {
        name_bn: "মুদ্রণ ও প্রকাশনা অধ্যয়ন বিভাগ",
        name_en: "Department of Printing and Publication Studies",
      },
      {
        name_bn: "জাপানিজ স্টাডিজ বিভাগ",
        name_en: "Department of Japanese Studies",
      },
    ],
  },
  {
    faculty_name_bn: "বিজনেস স্টাডিজ অনুষদ",
    faculty_name_en: "Faculty of Business Studies",
    departments: [
      { name_bn: "ম্যানেজমেন্ট বিভাগ", name_en: "Department of Management" },
      {
        name_bn: "অ্যাকাউন্টিং অ্যান্ড ইনফরমেশন সিস্টেমস বিভাগ",
        name_en: "Department of Accounting and Information Systems",
      },
      { name_bn: "মার্কেটিং বিভাগ", name_en: "Department of Marketing" },
      { name_bn: "ফিন্যান্স বিভাগ", name_en: "Department of Finance" },
      {
        name_bn: "ব্যাংকিং অ্যান্ড ইন্স্যুরেন্স বিভাগ",
        name_en: "Department of Banking and Insurance",
      },
      {
        name_bn: "ম্যানেজমেন্ট ইনফরমেশন সিস্টেমস বিভাগ",
        name_en: "Department of Management Information Systems",
      },
      {
        name_bn: "আন্তর্জাতিক ব্যবসা বিভাগ",
        name_en: "Department of International Business",
      },
      {
        name_bn: "ট্যুরিজম অ্যান্ড হসপিটালিটি ম্যানেজমেন্ট বিভাগ",
        name_en: "Department of Tourism and Hospitality Management",
      },
      {
        name_bn: "অর্গানাইজেশন স্ট্র্যাটেজি অ্যান্ড লিডারশিপ বিভাগ",
        name_en: "Department of Organisation Strategy and Leadership",
      },
    ],
  },
  {
    faculty_name_bn: "জীববিজ্ঞান অনুষদ",
    faculty_name_en: "Faculty of Biological Sciences",
    departments: [
      { name_bn: "উদ্ভিদবিজ্ঞান বিভাগ", name_en: "Department of Botany" },
      { name_bn: "প্রাণিবিজ্ঞান বিভাগ", name_en: "Department of Zoology" },
      {
        name_bn: "মৃত্তিকা, পানি ও পরিবেশ বিভাগ",
        name_en: "Department of Soil, Water and Environment",
      },
      {
        name_bn: "অণুজীব বিজ্ঞান বিভাগ",
        name_en: "Department of Microbiology",
      },
      {
        name_bn: "প্রাণরসায়ন ও অনুপ্রাণ বিজ্ঞান বিভাগ",
        name_en: "Department of Biochemistry and Molecular Biology",
      },
      { name_bn: "মনোবিজ্ঞান বিভাগ", name_en: "Department of Psychology" },
      {
        name_bn: "চিকিৎসা মনোবিজ্ঞান বিভাগ",
        name_en: "Department of Clinical Psychology",
      },
      {
        name_bn: "জেনেটিক ইঞ্জিনিয়ারিং অ্যান্ড বায়োটেকনোলজি বিভাগ",
        name_en: "Department of Genetic Engineering and Biotechnology",
      },
      { name_bn: "মৎস্যবিজ্ঞান বিভাগ", name_en: "Department of Fisheries" },
      {
        name_bn: "শিক্ষামূলক ও কাউন্সেলিং মনোবিজ্ঞান বিভাগ",
        name_en: "Department of Educational and Counselling Psychology",
      }, // ← নতুন
    ],
  },
  {
    faculty_name_bn: "ফার্মেসি অনুষদ",
    faculty_name_en: "Faculty of Pharmacy",
    departments: [
      {
        name_bn: "ফার্মাসিউটিক্যাল কেমিস্ট্রি বিভাগ",
        name_en: "Department of Pharmaceutical Chemistry",
      },
      {
        name_bn: "ক্লিনিক্যাল ফার্মেসি ও ফার্মাকোলজি বিভাগ",
        name_en: "Department of Clinical Pharmacy and Pharmacology",
      },
      {
        name_bn: "ফার্মাসিউটিক্যাল টেকনোলজি বিভাগ",
        name_en: "Department of Pharmaceutical Technology",
      },
      { name_bn: "ফার্মেসি বিভাগ", name_en: "Department of Pharmacy" }, // ← নতুন
    ],
  },
  {
    faculty_name_bn: "প্রকৌশল ও প্রযুক্তি অনুষদ",
    faculty_name_en: "Faculty of Engineering and Technology",
    departments: [
      {
        name_bn: "কম্পিউটার বিজ্ঞান ও প্রকৌশল বিভাগ",
        name_en: "Department of Computer Science and Engineering",
      },
      {
        name_bn: "তড়িৎ ও ইলেকট্রনিক প্রকৌশল বিভাগ",
        name_en: "Department of Electrical and Electronic Engineering",
      },
      {
        name_bn: "ফলিত রসায়ন ও রাসায়নিক প্রকৌশল বিভাগ",
        name_en: "Department of Applied Chemistry and Chemical Engineering",
      },
      {
        name_bn: "নিউক্লিয়ার ইঞ্জিনিয়ারিং বিভাগ",
        name_en: "Department of Nuclear Engineering",
      },
      {
        name_bn: "রোবটিক্স অ্যান্ড মেকাট্রনিক্স ইঞ্জিনিয়ারিং বিভাগ",
        name_en: "Department of Robotics and Mechatronics Engineering",
      },
    ],
  },
  {
    faculty_name_bn: "ভূ-বিজ্ঞান ও পরিবেশ অনুষদ",
    faculty_name_en: "Faculty of Earth and Environmental Sciences",
    departments: [
      {
        name_bn: "ভূগোল ও পরিবেশ বিভাগ",
        name_en: "Department of Geography and Environment",
      },
      { name_bn: "ভূতত্ত্ব বিভাগ", name_en: "Department of Geology" },
      { name_bn: "সমুদ্রবিজ্ঞান বিভাগ", name_en: "Department of Oceanography" },
      {
        name_bn: "দুর্যোগ বিজ্ঞান ও জলবায়ু স্থিতিস্থাপকতা বিভাগ",
        name_en: "Department of Disaster Science and Climate Resilience",
      },
      {
        name_bn: "আবহাওয়া বিজ্ঞান বিভাগ",
        name_en: "Department of Meteorology",
      },
    ],
  },
  {
    faculty_name_bn: "চারুকলা অনুষদ",
    faculty_name_en: "Faculty of Fine Art",
    departments: [
      {
        name_bn: "অঙ্কন ও চিত্রায়ণ বিভাগ",
        name_en: "Department of Drawing and Painting",
      },
      {
        name_bn: "গ্রাফিক ডিজাইন বিভাগ",
        name_en: "Department of Graphic Design",
      },
      { name_bn: "প্রিন্টমেকিং বিভাগ", name_en: "Department of Printmaking" },
      { name_bn: "প্রাচ্যকলা বিভাগ", name_en: "Department of Oriental Art" },
      { name_bn: "মৃৎশিল্প বিভাগ", name_en: "Department of Ceramics" },
      { name_bn: "ভাস্কর্য বিভাগ", name_en: "Department of Sculpture" },
      { name_bn: "কারুশিল্প বিভাগ", name_en: "Department of Crafts" },
      {
        name_bn: "শিল্পকলার ইতিহাস বিভাগ",
        name_en: "Department of History of Art",
      },
    ],
  },
  {
    // ← সম্পূর্ণ নতুন অনুষদ
    faculty_name_bn: "শিক্ষা অনুষদ",
    faculty_name_en: "Faculty of Education",
    departments: [
      {
        name_bn: "শিক্ষা বিভাগ (IER)",
        name_en: "Institute of Education and Research (IER)",
      },
    ],
  },
  {
    // ← সম্পূর্ণ নতুন অনুষদ
    faculty_name_bn: "চিকিৎসা অনুষদ",
    faculty_name_en: "Faculty of Medicine",
    departments: [
      {
        name_bn: "চিকিৎসা ও শল্যবিদ্যা বিভাগ",
        name_en: "Department of Medicine and Surgery",
      },
      { name_bn: "ভাইরোলজি বিভাগ", name_en: "Department of Virology" },
    ],
  },
  {
    // ← সম্পূর্ণ নতুন অনুষদ
    faculty_name_bn: "স্নাতকোত্তর চিকিৎসা বিজ্ঞান অনুষদ",
    faculty_name_en: "Faculty of Postgraduate Medical Sciences and Research",
    departments: [
      {
        name_bn: "স্নাতকোত্তর চিকিৎসা বিজ্ঞান বিভাগ",
        name_en: "Department of Postgraduate Medical Sciences",
      },
    ],
  },
];
