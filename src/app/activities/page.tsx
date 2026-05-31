import { createClient } from "@/lib/supabase/server";
import ActivitiesTabs, {
  type Activity,
  type CategoryKey,
} from "./_components/ActivitiesTabs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "কার্যক্রম",
  description:
    "তীর্থের একাডেমিক সহায়তা, রক্তদান, মানবিক সহায়তা ও সাংস্কৃতিক কার্যক্রমের বিস্তারিত।",
};

const ITEMS_PER_PAGE = 9;

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    category?: string;
  }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const category = (resolvedParams.category || "Academic Care") as CategoryKey;
  const currentPage = Number(resolvedParams.page) || 1;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // ১. ব্যাজগুলোতে (Tabs) দেখানোর জন্য মোট কার্যক্রমের সংখ্যা (কোনো ফিল্টার ছাড়া)
  const { data: allActivities } = await supabase
    .from("activities")
    .select("category")
    .eq("is_published", true);

  const categoryTotals = (allActivities || []).reduce<Record<string, number>>(
    (acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + 1;
      return acc;
    },
    {},
  );

  // ২. কার্ডগুলোর জন্য ডেটা ফেচিং (সার্চ, সর্ট এবং পেজিনেশন সহ)
  let query = supabase
    .from("activities")
    .select(
      "id, title, body, category, cover_image_url, is_published, created_at",
      { count: "exact" },
    )
    .eq("is_published", true)
    .eq("category", category); // নির্বাচিত ট্যাবের ক্যাটাগরি অনুযায়ী

  // সার্চ
  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
  }

  // সর্টিং
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }); // default: newest
  }

  // পেজিনেশন লিমিট
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Failed to fetch activities:", error.message);
  }

  const activities: Activity[] = data ?? [];
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  // page.tsx owns zero UI strings — all text lives in ActivitiesTabs
  return (
    <ActivitiesTabs
      activities={activities}
      categoryTotals={categoryTotals}
      initialSearch={search}
      initialSort={sort}
      initialCategory={category}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
