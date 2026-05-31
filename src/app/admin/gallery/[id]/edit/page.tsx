import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import GalleryEditForm from "./_components/GalleryEditForm";

export default async function GalleryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  const supabase = await createClient();
  const { data: album, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error || !album) notFound();

  // হেডার ক্লায়েন্টে নিয়ে যাওয়া হয়েছে
  return <GalleryEditForm album={album} />;
}
