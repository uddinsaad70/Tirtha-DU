import { createClient } from "@/lib/supabase/server";
import MembersClient, { type Member } from "./_components/MembersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "সদস্যবৃন্দ",
  description:
    "তীর্থের বর্তমান শিক্ষার্থী, প্রাক্তন সদস্য ও স্বেচ্ছাসেবকদের তালিকা।",
};

const ITEMS_PER_PAGE = 15;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    status?: string;
    blood?: string; // নতুন প্যারামিটার
  }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const status = resolvedParams.status || "all";
  const blood = resolvedParams.blood || ""; // ব্লাড গ্রুপ রিসিভ করা
  const currentPage = Number(resolvedParams.page) || 1;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // ১. Hero Section এবং Tabs এ দেখানোর জন্য মোট পরিসংখ্যান
  const { data: allStats } = await supabase
    .from("members")
    .select("is_current, is_alumni, designation, blood_group");

  const stats = allStats || [];
  const totalCount = stats.length;
  const currentCount = stats.filter((m) => m.is_current && !m.is_alumni).length;
  const alumniCount = stats.filter((m) => m.is_alumni).length;
  const committeeCount = stats.filter((m) => Boolean(m.designation)).length;

  // আপডেট: এখন এটি দেখাবে মোট কতজনের ব্লাড গ্রুপ সেভ করা আছে (কতজন রক্তদাতা)
  const bloodGroupCount = stats.filter(
    (m) => Boolean(m.blood_group) && m.blood_group !== "",
  ).length;

  // ২. কার্ডগুলোর জন্য ডেটা ফেচিং
  let query = supabase
    .from("members")
    .select(
      "id, name, designation, department, session, phone, facebook_url, photo_url, bio, committee_year, is_current, is_alumni, blood_group",
      { count: "exact" },
    );

  // সার্চ
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,department.ilike.%${search}%,designation.ilike.%${search}%`,
    );
  }

  // স্ট্যাটাস অনুযায়ী ফিল্টার
  if (status === "current") {
    query = query.eq("is_current", true).eq("is_alumni", false);
  } else if (status === "alumni") {
    query = query.eq("is_alumni", true);
  } else if (status === "blood") {
    // যাদের ব্লাড গ্রুপ দেওয়া আছে, শুধু তাদের দেখাবে
    query = query.not("blood_group", "is", null).neq("blood_group", "");

    // যদি নির্দিষ্ট কোনো ব্লাড গ্রুপ (যেমন A+) ফিল্টার করা হয়
    if (blood) {
      query = query.eq("blood_group", blood);
    }
  }

  // সর্টিং
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "session_desc") {
    query = query.order("session", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false }); // default: newest
  }

  // পেজিনেশন লিমিট
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Failed to fetch members:", error.message);
  }

  const members: Member[] = data ?? [];
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <MembersClient
      members={members}
      totalCount={totalCount}
      currentCount={currentCount}
      alumniCount={alumniCount}
      committeeCount={committeeCount}
      bloodGroupCount={bloodGroupCount}
      initialSearch={search}
      initialSort={sort}
      initialStatus={status}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
