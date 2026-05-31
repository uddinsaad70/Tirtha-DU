import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (!member) {
    notFound();
  }

  return <EditForm member={member} />;
}
