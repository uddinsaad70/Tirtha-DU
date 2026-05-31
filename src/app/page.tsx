// // Server Component — owns data fetching only.
// // All UI (Hero, Ticker, Activities, Notices, CTA) lives in HomePageClient.

// import { createClient } from "@/lib/supabase/server";
// import HomePageClient from "./_components/HomePageClient";

// export const dynamic = "force-dynamic";

// export interface HomeNotice {
//   id: number;
//   title: string;
//   body: string | null;
//   file_url: string | null;
//   file_type: "image" | "pdf" | "none";
//   is_ticker: boolean;
//   published_at: string | null;
//   created_at: string;
// }

// export default async function HomePage() {
//   const supabase = await createClient();
//   const now = new Date().toISOString();

//   // ── সঠিক শিডিউলিং লজিক (AND of ORs) ──
//   const schedulingFilter = [
//     `and(published_at.lte.${now},expires_at.gt.${now})`,
//     `and(published_at.lte.${now},expires_at.is.null)`,
//     `and(published_at.is.null,expires_at.gt.${now})`,
//     `and(published_at.is.null,expires_at.is.null)`,
//   ].join(",");

//   const [
//     { data: tickerData, error: tickerError },
//     { data: latestData, error: latestError },
//   ] = await Promise.all([
//     supabase
//       .from("notices")
//       .select(
//         "id, title, body, file_url, file_type, is_ticker, published_at, created_at",
//       )
//       .eq("is_ticker", true)
//       .eq("is_published", true)
//       .or(schedulingFilter)
//       .order("published_at", { ascending: false, nullsFirst: false })
//       .limit(10),

//     supabase
//       .from("notices")
//       .select(
//         "id, title, body, file_url, file_type, is_ticker, published_at, created_at",
//       )
//       .eq("is_published", true)
//       .or(schedulingFilter)
//       .order("published_at", { ascending: false, nullsFirst: false })
//       .limit(3),
//   ]);

//   if (tickerError)
//     console.error("Ticker notices fetch error:", tickerError.message);
//   if (latestError)
//     console.error("Latest notices fetch error:", latestError.message);

//   const tickerNotices = (tickerData ?? []) as HomeNotice[];
//   const latestNotices = (latestData ?? []) as HomeNotice[];

//   return (
//     <HomePageClient
//       tickerNotices={tickerNotices}
//       latestNotices={latestNotices}
//     />
//   );
// }

import { createClient } from "@/lib/supabase/server";
import HomePageClient from "./_components/HomePageClient";

export const dynamic = "force-dynamic";

export interface HomeNotice {
  id: number;
  title: string;
  body: string | null;
  file_url: string | null;
  file_type: "image" | "pdf" | "none";
  is_ticker: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export default async function HomePage() {
  const supabase = await createClient();

  // ১. কোনো জটিল কন্ডিশন ছাড়া সব পাবলিশড নোটিশ নিয়ে আসা
  const { data, error } = await supabase
    .from("notices")
    .select(
      "id, title, body, file_url, file_type, is_ticker, published_at, expires_at, created_at",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) console.error("Fetch error:", error.message);

  const allNotices = (data ?? []) as HomeNotice[];

  // ২. জাভাস্ক্রিপ্ট দিয়ে নিখুঁত টাইম ফিল্টারিং
  const nowMs = Date.now(); // বর্তমান সময় (মিলিসেকেন্ডে)

  const validNotices = allNotices.filter((notice) => {
    // published_at না থাকলে ধরে নেবো অনেক আগে পাবলিশ হয়েছে (0)
    const pubTime = notice.published_at
      ? new Date(notice.published_at).getTime()
      : 0;

    // expires_at না থাকলে ধরে নেবো অনন্তকাল থাকবে (Infinity)
    const expTime = notice.expires_at
      ? new Date(notice.expires_at).getTime()
      : Infinity;

    // পাবলিশের সময় বর্তমান সময়ের চেয়ে কম/সমান হতে হবে এবং এক্সপায়ার সময় বর্তমানের চেয়ে বেশি হতে হবে
    return pubTime <= nowMs && expTime > nowMs;
  });

  // ৩. ফিল্টার করা ডেটা থেকে টিকার এবং লেটেস্ট নোটিশ আলাদা করা
  const tickerNotices = validNotices.filter((n) => n.is_ticker).slice(0, 10);
  const latestNotices = validNotices.slice(0, 3);

  return (
    <HomePageClient
      tickerNotices={tickerNotices}
      latestNotices={latestNotices}
    />
  );
}
