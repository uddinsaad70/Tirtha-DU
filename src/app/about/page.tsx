import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AboutClient from "./_components/AboutClient";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description: "তীর্থের ইতিহাস, লক্ষ্য ও দর্শন সম্পর্কে জানুন।",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const supabase = await createClient();

  // ১. ডায়নামিক ক্যালকুলেশন (যেমন: বর্তমান বছর - ২০০৭)
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - 2007;

  // ২. ডাটাবেজ থেকে সমান্তরালে (Parallel) রিয়েল ডেটা ফেচ করা
  const [
    { count: totalMembers },
    { count: bloodDonors },
    { count: currentStudents },
  ] = await Promise.all([
    // মোট মেম্বার সংখ্যা
    supabase.from("members").select("*", { count: "exact", head: true }),

    // যাদের ব্লাড গ্রুপ দেওয়া আছে (রক্তদাতা)
    supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .not("blood_group", "is", null),

    // বর্তমান শিক্ষার্থী (যারা সাবেক নয়)
    supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("is_alumni", false),
  ]);

  const dynamicStats = {
    years: yearsOfExperience,
    members: totalMembers ?? 0,
    blood: bloodDonors ?? 0,
    students: currentStudents ?? 0,
  };

  return <AboutClient dynamicStats={dynamicStats} />;
}
