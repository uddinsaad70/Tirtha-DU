import { createClient } from "@/lib/supabase/server";
import AdminActivitiesListClient from "./_components/AdminActivitiesListClient";

const ITEMS_PER_PAGE = 10;

export default async function ActivitiesListPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const status = resolvedParams.status || "all";
  const currentPage = Number(resolvedParams.page) || 1;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // ১. ব্যাজগুলোতে (Tabs) দেখানোর জন্য মোট অ্যাক্টিভিটিজের সংখ্যা (কোনো ফিল্টার ছাড়া)
  const { data: allStats } = await supabase
    .from("activities")
    .select("is_published");
  const totalCount = allStats?.length || 0;
  const publishedCount = allStats?.filter((a) => a.is_published).length || 0;
  const unpublishedCount = totalCount - publishedCount;

  // ২. টেবিলের জন্য ডেটা ফেচিং (সার্চ, সর্ট, স্ট্যাটাস এবং পেজিনেশন সহ)
  let query = supabase
    .from("activities")
    .select("id, title, category, cover_image_url, is_published, created_at", {
      count: "exact",
    });

  // সার্চ (টাইটেল বা ক্যাটাগরি দিয়ে)
  if (search) {
    query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
  }

  // স্ট্যাটাস অনুযায়ী ফিল্টার
  if (status === "published") {
    query = query.eq("is_published", true);
  } else if (status === "unpublished") {
    query = query.eq("is_published", false);
  }

  // সর্টিং
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }); // default: newest
  }

  // পেজিনেশন লিমিট
  query = query.range(from, to);

  const { data: activities, count, error } = await query;

  if (error) console.error("Failed to fetch activities:", error.message);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <AdminActivitiesListClient
      list={activities ?? []}
      totalCount={totalCount}
      publishedCount={publishedCount}
      unpublishedCount={unpublishedCount}
      initialSearch={search}
      initialSort={sort}
      initialStatus={status}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
