import { createClient } from "@/lib/supabase/server";
import AdminGalleryListClient from "./_components/AdminGalleryListClient";

const ITEMS_PER_PAGE = 12;

export default async function GalleryAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const currentPage = Number(resolvedParams.page) || 1;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // টেবিলের জন্য ডেটা ফেচিং (সার্চ, সর্ট এবং পেজিনেশন সহ)
  let query = supabase
    .from("gallery")
    .select("id, title, image_urls, event_name, taken_at, created_at", {
      count: "exact",
    });

  // সার্চ (অ্যালবামের নাম বা ইভেন্টের নাম দিয়ে)
  if (search) {
    query = query.or(`title.ilike.%${search}%,event_name.ilike.%${search}%`);
  }

  // সর্টিং
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }); // default: newest
  }

  // পেজিনেশন লিমিট
  query = query.range(from, to);

  const { data: albums, count, error } = await query;

  if (error) console.error("Gallery fetch error:", error.message);

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <AdminGalleryListClient
      items={albums ?? []}
      totalCount={count ?? 0}
      initialSearch={search}
      initialSort={sort}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
