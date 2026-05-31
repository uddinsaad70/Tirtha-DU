import { createClient } from "@/lib/supabase/server";
import NewsTabs from "./_components/NewsTabs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "নিউজ ও গ্যালারি",
  description: "তীর্থের আপডেট, বিজ্ঞপ্তি এবং স্মৃতিময় আলোকচিত্র।",
};

const NOTICES_PER_PAGE = 10;
const GALLERY_PER_PAGE = 12; // গ্রিড লেআউটের জন্য ১২টি মানানসই

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    tab?: string;
  }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const tab = resolvedParams.tab || "notices";
  const currentPage = Number(resolvedParams.page) || 1;

  const now = new Date().toISOString();

  // সঠিক শিডিউলিং লজিক
  const schedulingFilter = [
    `and(published_at.lte.${now},expires_at.gt.${now})`,
    `and(published_at.lte.${now},expires_at.is.null)`,
    `and(published_at.is.null,expires_at.gt.${now})`,
    `and(published_at.is.null,expires_at.is.null)`,
  ].join(",");

  // ১. ব্যাজগুলোতে (Tabs) দেখানোর জন্য মোট সংখ্যা (কোনো ফিল্টার ছাড়া)
  const [noticesCountRes, galleryCountRes] = await Promise.all([
    supabase
      .from("notices")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true)
      .or(schedulingFilter),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
  ]);

  const noticesCount = noticesCountRes.count ?? 0;
  const galleryCount = galleryCountRes.count ?? 0;

  let notices = [];
  let albums = [];
  let totalPages = 1;

  // ২. নির্বাচিত ট্যাবের ওপর ভিত্তি করে ডেটা ফেচিং (সার্চ, সর্ট এবং পেজিনেশন সহ)
  if (tab === "notices") {
    const from = (currentPage - 1) * NOTICES_PER_PAGE;
    const to = from + NOTICES_PER_PAGE - 1;

    let query = supabase
      .from("notices")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .or(schedulingFilter);

    if (search) {
      query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
    }

    if (sort === "oldest") {
      query = query.order("published_at", {
        ascending: true,
        nullsFirst: false,
      });
    } else {
      query = query.order("published_at", {
        ascending: false,
        nullsFirst: false,
      });
    }

    const { data, count, error } = await query.range(from, to);
    if (error) console.error("Notices fetch error:", error.message);

    notices = data ?? [];
    totalPages = count ? Math.ceil(count / NOTICES_PER_PAGE) : 1;
  } else if (tab === "gallery") {
    const from = (currentPage - 1) * GALLERY_PER_PAGE;
    const to = from + GALLERY_PER_PAGE - 1;

    let query = supabase.from("gallery").select("*", { count: "exact" });

    if (search) {
      query = query.or(`title.ilike.%${search}%,event_name.ilike.%${search}%`);
    }

    if (sort === "oldest") {
      query = query.order("taken_at", { ascending: true, nullsFirst: false });
    } else {
      query = query.order("taken_at", { ascending: false, nullsFirst: false });
    }

    const { data, count, error } = await query.range(from, to);
    if (error) console.error("Gallery fetch error:", error.message);

    // Filter albums that actually have images
    albums = (data ?? []).filter(
      (a) => Array.isArray(a.image_urls) && a.image_urls.length > 0,
    );
    totalPages = count ? Math.ceil(count / GALLERY_PER_PAGE) : 1;
  }

  return (
    <NewsTabs
      initialNotices={notices}
      initialAlbums={albums}
      noticesCount={noticesCount}
      galleryCount={galleryCount}
      initialTab={tab}
      initialSearch={search}
      initialSort={sort}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
