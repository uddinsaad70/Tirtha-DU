import { createClient } from "@/lib/supabase/server";
import AdminNoticesListClient from "./_components/AdminNoticesListClient";

const ITEMS_PER_PAGE = 2;

export default async function NoticesListPage({
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

  // ১. ব্যাজগুলোতে (Tabs) দেখানোর জন্য মোট নোটিশের সংখ্যা (কোনো ফিল্টার ছাড়া)
  const { data: allStats } = await supabase
    .from("notices")
    .select("is_published, is_ticker");
  const totalCount = allStats?.length || 0;
  const publishedCount = allStats?.filter((n) => n.is_published).length || 0;
  const unpublishedCount = totalCount - publishedCount;
  const tickerCount = allStats?.filter((n) => n.is_ticker).length || 0;

  // ২. টেবিলের জন্য ডেটা ফেচিং (সার্চ, সর্ট, স্ট্যাটাস এবং পেজিনেশন সহ)
  let query = supabase.from("notices").select("*", { count: "exact" });

  // সার্চ (টাইটেল বা বডি দিয়ে)
  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
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

  const { data: notices, count, error } = await query;

  if (error) console.error("Failed to fetch notices:", error.message);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <AdminNoticesListClient
      noticeList={notices ?? []}
      totalCount={totalCount}
      publishedCount={publishedCount}
      unpublishedCount={unpublishedCount}
      tickerCount={tickerCount}
      initialSearch={search}
      initialSort={sort}
      initialStatus={status}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
