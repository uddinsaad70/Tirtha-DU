import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee] flex flex-col lg:flex-row">
      <AdminSidebar adminEmail={user.email ?? ""} />

      {/* pt-16 যোগ করা হয়েছে যাতে মোবাইলে টপ-বারের জায়গাটা ফাঁকা থাকে */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
