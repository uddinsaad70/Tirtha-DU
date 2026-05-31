// import { createClient } from "@/lib/supabase/server";
// import AdminDashboardClient from "./_components/AdminDashboardClient";

// export default async function AdminDashboardPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const adminEmail = user?.email ?? "Admin";

//   // Data passing logic (currently dummy, easily replaceable later)
//   const DUMMY_STATS = {
//     totalMembers: 148,
//     publishedNotices: 23,
//     totalActivities: 41,
//     bloodUnits: 312,
//   };

//   return (
//     <AdminDashboardClient adminEmail={adminEmail} dummyStats={DUMMY_STATS} />
//   );
// }

import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export type RecentActivityItem = {
  id: number;
  text: string;
  time: string;
  dot: "bg-blue-400" | "bg-green-400" | "bg-red-400";
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = user?.email ?? "Admin";

  const [
    { count: totalMembers },
    { count: publishedNotices },
    { count: totalActivities },
    { count: bloodActivities },
    { data: recentNotices },
    { data: recentMembers },
    { data: recentActivitiesData },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase
      .from("notices")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("category", "Blood Donation")
      .eq("is_published", true),
    supabase
      .from("notices")
      .select("id, title, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("members")
      .select("id, name, created_at")
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("activities")
      .select("id, title, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const stats = {
    totalMembers: totalMembers ?? 0,
    publishedNotices: publishedNotices ?? 0,
    totalActivities: totalActivities ?? 0,
    bloodUnits: bloodActivities ?? 0,
  };

  // সব রিসেন্ট আইটেম একসাথে মিশিয়ে সময় অনুযায়ী সাজানো হচ্ছে
  const recentActivity: RecentActivityItem[] = [
    ...(recentNotices ?? []).map((n) => ({
      id: n.id,
      text: n.title,
      time: n.created_at,
      dot: "bg-blue-400" as const,
    })),
    ...(recentMembers ?? []).map((m) => ({
      id: m.id,
      text: m.name,
      time: m.created_at,
      dot: "bg-green-400" as const,
    })),
    ...(recentActivitiesData ?? []).map((a) => ({
      id: a.id,
      text: a.title,
      time: a.created_at,
      dot: "bg-red-400" as const,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 3);

  return (
    <AdminDashboardClient
      adminEmail={adminEmail}
      stats={stats}
      recentActivity={recentActivity}
    />
  );
}
