"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Shared return type for useActionState ────────────────────────────────────
export type ActionState = { error: string | null };

// ─── Constants ────────────────────────────────────────────────────────────────
const ACTIVITIES_BUCKET = "activities";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const VALID_CATEGORIES = [
  "Academic Care",
  "Blood Donation",
  "Humanitarian Support",
  "Cultural Programs",
] as const;

export type Category = (typeof VALID_CATEGORIES)[number];

// ─── Helper: extract filename from a Supabase public URL ─────────────────────
function getFilenameFromUrl(url: string | null): string | null {
  if (!url) return null;
  return url.split("/").pop() ?? null;
}

// ─── Helper: upload a cover image to the activities bucket ───────────────────
async function uploadCoverImage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  file: File,
): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw "ছবির সাইজ সর্বোচ্চ ৫ MB হতে হবে।";
  }
  if (!file.type.startsWith("image/")) {
    throw "শুধুমাত্র ইমেজ ফাইল (.jpg, .png, .webp) আপলোড করা যাবে।";
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(ACTIVITIES_BUCKET)
    .upload(filename, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    console.error("Activity cover upload error:", uploadError.message);
    throw "ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
  }

  const { data } = supabase.storage
    .from(ACTIVITIES_BUCKET)
    .getPublicUrl(filename);
  return data.publicUrl;
}

// ─── Helper: delete a file from storage by its public URL ────────────────────
async function deleteCoverFromStorage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  url: string | null,
): Promise<void> {
  const filename = getFilenameFromUrl(url);
  if (!filename) return;

  const { error } = await supabase.storage
    .from(ACTIVITIES_BUCKET)
    .remove([filename]);

  if (error) {
    console.error("Storage delete warning (non-fatal):", error.message);
  }
}

// ─── Helper: parse shared form fields ────────────────────────────────────────
function extractActivityFields(formData: FormData) {
  const title = formData.get("title")?.toString().trim() ?? "";
  const body = formData.get("body")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString().trim() ?? "";
  const is_published = formData.get("is_published") !== "false";
  const remove_image = formData.get("remove_image") === "true";

  const fileInput = formData.get("cover_image");
  const imageFile =
    fileInput instanceof File && fileInput.size > 0 ? fileInput : null;

  return { title, body, category, is_published, remove_image, imageFile };
}

// ─── createActivity ───────────────────────────────────────────────────────────
export async function createActivity(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const fields = extractActivityFields(formData);

  // Validation
  if (!fields.title) return { error: "কার্যক্রমের শিরোনাম আবশ্যক।" };
  if (fields.title.length < 3)
    return { error: "শিরোনামটি কমপক্ষে ৩ অক্ষরের হতে হবে।" };
  if (!fields.body) return { error: "বিবরণ আবশ্যক।" };
  if (!VALID_CATEGORIES.includes(fields.category as Category))
    return { error: "একটি বৈধ ক্যাটাগরি নির্বাচন করুন।" };

  // Upload cover image if provided
  let cover_image_url: string | null = null;
  if (fields.imageFile) {
    try {
      cover_image_url = await uploadCoverImage(supabase, fields.imageFile);
    } catch (msg) {
      return { error: msg as string };
    }
  }

  const { error } = await supabase.from("activities").insert({
    title: fields.title,
    body: fields.body,
    category: fields.category,
    cover_image_url,
    is_published: fields.is_published,
  });

  if (error) {
    console.error("createActivity error:", error.message);
    return { error: "কার্যক্রম সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
  }

  revalidatePath("/admin/activities");
  redirect("/admin/activities");
}

// ─── updateActivity ───────────────────────────────────────────────────────────
export async function updateActivity(
  id: number,
  existingImageUrl: string | null,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const fields = extractActivityFields(formData);

  // Validation
  if (!fields.title) return { error: "কার্যক্রমের শিরোনাম আবশ্যক।" };
  if (fields.title.length < 3)
    return { error: "শিরোনামটি কমপক্ষে ৩ অক্ষরের হতে হবে।" };
  if (!fields.body) return { error: "বিবরণ আবশ্যক।" };
  if (!VALID_CATEGORIES.includes(fields.category as Category))
    return { error: "একটি বৈধ ক্যাটাগরি নির্বাচন করুন।" };

  let cover_image_url: string | null = existingImageUrl;

  // Case 1: Admin explicitly removed the image
  if (fields.remove_image) {
    await deleteCoverFromStorage(supabase, existingImageUrl);
    cover_image_url = null;
  }

  // Case 2: Admin uploaded a new image — delete old, upload new
  if (!fields.remove_image && fields.imageFile) {
    await deleteCoverFromStorage(supabase, existingImageUrl);
    try {
      cover_image_url = await uploadCoverImage(supabase, fields.imageFile);
    } catch (msg) {
      return { error: msg as string };
    }
  }

  const { error } = await supabase
    .from("activities")
    .update({
      title: fields.title,
      body: fields.body,
      category: fields.category,
      cover_image_url,
      is_published: fields.is_published,
    })
    .eq("id", id);

  if (error) {
    console.error("updateActivity error:", error.message);
    return { error: "কার্যক্রম আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
  }

  revalidatePath("/admin/activities");
  revalidatePath(`/admin/activities/${id}/edit`);
  redirect("/admin/activities");
}

// ─── deleteActivity ───────────────────────────────────────────────────────────
export async function deleteActivity(id: number): Promise<ActionState> {
  const supabase = await createClient();

  // 1. Fetch the row first so we know which storage file to clean up
  const { data: activity } = await supabase
    .from("activities")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  // 2. Delete the database row
  const { error } = await supabase.from("activities").delete().eq("id", id);

  if (error) {
    console.error("deleteActivity error:", error.message);
    return { error: "কার্যক্রম মুছতে সমস্যা হয়েছে।" };
  }

  // 3. Clean up storage only after the DB delete succeeds
  await deleteCoverFromStorage(supabase, activity?.cover_image_url ?? null);

  revalidatePath("/admin/activities");
  return { error: null };
}
