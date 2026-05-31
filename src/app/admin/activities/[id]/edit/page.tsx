import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ActivityEditForm from "./_components/ActivityEditForm";

export default async function ActivityEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  const supabase = await createClient();
  const { data: activity, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error || !activity) notFound();

  // হেডার ক্লায়েন্টে নিয়ে যাওয়া হয়েছে
  return <ActivityEditForm activity={activity} />;
}
