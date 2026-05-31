import { createClient } from "@/lib/supabase/server";
import AdminMembersListClient from "./_components/AdminMembersListClient";

const ITEMS_PER_PAGE = 10;

export default async function MembersListPage({
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

  // ১. ব্যাজগুলোতে (Tabs) দেখানোর জন্য মোট মেম্বারের সংখ্যা (কোনো ফিল্টার ছাড়া)
  const { data: allStats } = await supabase.from("members").select("is_alumni");
  const totalCount = allStats?.length || 0;
  const currentCount = allStats?.filter((m) => !m.is_alumni).length || 0;
  const alumniCount = allStats?.filter((m) => m.is_alumni).length || 0;

  // ২. টেবিলের জন্য ডেটা ফেচিং (সার্চ, সর্ট, স্ট্যাটাস এবং পেজিনেশন সহ)
  let query = supabase.from("members").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,department.ilike.%${search}%,designation.ilike.%${search}%`,
    );
  }

  // স্ট্যাটাস অনুযায়ী ফিল্টার
  if (status === "current") {
    query = query.eq("is_alumni", false);
  } else if (status === "alumni") {
    query = query.eq("is_alumni", true);
  }

  // সর্টিং
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "session_desc") {
    query = query.order("session", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false }); // default
  }

  // পেজিনেশন লিমিট
  query = query.range(from, to);

  const { data: members, count, error } = await query;

  if (error) console.error("Failed to fetch members:", error.message);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <AdminMembersListClient
      memberList={members ?? []}
      totalCount={totalCount}
      currentCount={currentCount}
      alumniCount={alumniCount}
      initialSearch={search}
      initialSort={sort}
      initialStatus={status}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
