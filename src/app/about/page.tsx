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
  const [{ count: totalMembers }, { data: activitiesData }] = await Promise.all(
    [
      // মোট মেম্বার সংখ্যা (members টেবিল থেকে)
      supabase.from("members").select("*", { count: "exact", head: true }),

      // অ্যাক্টিভিটিস টেবিল থেকে ক্যাটাগরি এবং ইমপ্যাক্ট কাউন্ট ফেচ করা
      supabase.from("activities").select("category, impact_count"),
    ],
  );

  // ৩. ব্লাড ডোনেশন এবং একাডেমিক কেয়ারের ইমপ্যাক্ট যোগ (Sum) করা
  let totalBloodBags = 0;
  let totalStudentsHelped = 0;

  if (activitiesData) {
    activitiesData.forEach((activity) => {
      // আপনার অ্যাডমিন প্যানেলের ক্যাটাগরি স্পেলিং এর সাথে মিল রেখে
      if (activity.category === "Blood Donation") {
        totalBloodBags += activity.impact_count || 0;
      } else if (activity.category === "Academic Care") {
        totalStudentsHelped += activity.impact_count || 0;
      }
    });
  }

  // ৪. ডাইনামিক স্ট্যাটস অবজেক্ট তৈরি করে ক্লায়েন্টে পাঠানো
  const dynamicStats = {
    years: yearsOfExperience,
    members: totalMembers ?? 0,
    blood: totalBloodBags, // 👈 activities থেকে আসা ব্লাড ব্যাগের যোগফল
    students: totalStudentsHelped, // 👈 activities থেকে আসা শিক্ষার্থীর যোগফল
  };

  return <AboutClient dynamicStats={dynamicStats} />;
}
