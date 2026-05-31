import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import NoticeEditForm from "./_components/NoticeEditForm";

export default async function NoticeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const numericId = parseInt(resolvedParams.id, 10);

  if (isNaN(numericId)) notFound();

  const supabase = await createClient();
  const { data: notice, error } = await supabase
    .from("notices")
    .select(
      "id, title, body, file_url, file_type, is_ticker, is_published, expires_at",
    )
    .eq("id", numericId)
    .single();

  if (error || !notice) notFound();

  // হেডার UI এখান থেকে সরিয়ে NoticeEditForm এ নিয়ে যাওয়া হয়েছে
  return <NoticeEditForm notice={notice} />;
}
