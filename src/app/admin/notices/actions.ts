"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  error: string | null;
};

const NOTICES_BUCKET = "notices";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ─── Helper: Determine file_type from MIME type ───────────────────────────────
function resolveFileType(file: File): "image" | "pdf" {
  if (file.type === "application/pdf") return "pdf";
  return "image";
}

// ─── Helper: Extract filename from Supabase public URL ───────────────────────
function getFilenameFromUrl(url: string | null): string | null {
  if (!url) return null;
  return url.split("/").pop() ?? null;
}

// ─── Helper: Upload a file to the notices bucket ─────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uploadNoticeFile(
  supabase: any,
  file: File,
): Promise<{ publicUrl: string; fileType: "image" | "pdf" }> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw "ফাইলের সাইজ সর্বোচ্চ ১০ MB হতে হবে।";
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(NOTICES_BUCKET)
    .upload(filename, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    console.error("Storage upload error:", uploadError.message);
    throw "ফাইল আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
  }

  const { data } = supabase.storage.from(NOTICES_BUCKET).getPublicUrl(filename);

  return { publicUrl: data.publicUrl, fileType: resolveFileType(file) };
}

// ─── Helper: Parse shared form fields ────────────────────────────────────────
function extractNoticeFields(formData: FormData) {
  const title = formData.get("title")?.toString().trim() ?? "";
  const body = formData.get("body")?.toString().trim() || null;
  const is_ticker = formData.get("is_ticker") === "true";
  const is_published = formData.get("is_published") !== "false";
  const expires_at = formData.get("expires_at")?.toString() || null;
  const remove_file = formData.get("remove_file") === "true";

  // ── টাইম কনভার্সন ফিক্স ──
  const rawPublishedAt = formData.get("published_at")?.toString().trim();
  let published_at = null;
  if (rawPublishedAt) {
    // ব্রাউজারের লোকাল টাইমকে UTC-তে কনভার্ট করে দিচ্ছি
    published_at = new Date(rawPublishedAt).toISOString();
  }

  const fileInput = formData.get("file");
  const uploadedFile =
    fileInput instanceof File && fileInput.size > 0 ? fileInput : null;

  return {
    title,
    body,
    is_ticker,
    is_published,
    expires_at,
    published_at,
    remove_file,
    uploadedFile,
  };
}

// ─── createNotice ─────────────────────────────────────────────────────────────
export async function createNotice(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const fields = extractNoticeFields(formData);

  if (!fields.title) return { error: "নোটিশের শিরোনাম আবশ্যক।" };
  if (fields.title.length < 3)
    return { error: "শিরোনামটি কমপক্ষে ৩ অক্ষরের হতে হবে।" };

  let file_url: string | null = null;
  let file_type: "image" | "pdf" | "none" = "none";

  if (fields.uploadedFile) {
    try {
      const result = await uploadNoticeFile(supabase, fields.uploadedFile);
      file_url = result.publicUrl;
      file_type = result.fileType;
    } catch (msg) {
      return { error: msg as string };
    }
  }

  const { error } = await supabase.from("notices").insert({
    title: fields.title,
    body: fields.body,
    file_url,
    file_type,
    is_ticker: fields.is_ticker,
    is_published: fields.is_published,
    expires_at: fields.expires_at,
    published_at: fields.published_at || new Date().toISOString(),
  });

  if (error) {
    console.error("createNotice error:", error.message);
    return { error: "নোটিশ সেভ করতে সমস্যা হয়েছে।" };
  }

  revalidatePath("/admin/notices");
  redirect("/admin/notices");
}

// ─── updateNotice ─────────────────────────────────────────────────────────────
export async function updateNotice(
  id: number,
  existingFileUrl: string | null,
  existingFileType: "image" | "pdf" | "none",
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const fields = extractNoticeFields(formData);

  if (!fields.title) return { error: "নোটিশের শিরোনাম আবশ্যক।" };
  if (fields.title.length < 3)
    return { error: "শিরোনামটি কমপক্ষে ৩ অক্ষরের হতে হবে।" };

  // Start with the existing file state
  let file_url: string | null = existingFileUrl;
  let file_type: "image" | "pdf" | "none" = existingFileType;

  // Case 1: User explicitly wants to remove the file
  if (fields.remove_file) {
    if (existingFileUrl) {
      const filename = getFilenameFromUrl(existingFileUrl);
      if (filename) {
        await supabase.storage.from(NOTICES_BUCKET).remove([filename]);
      }
    }
    file_url = null;
    file_type = "none";
  }

  // Case 2: User uploaded a new file (replaces old one)
  if (!fields.remove_file && fields.uploadedFile) {
    try {
      // Delete the old file from storage before uploading the new one
      if (existingFileUrl) {
        const oldFilename = getFilenameFromUrl(existingFileUrl);
        if (oldFilename) {
          await supabase.storage.from(NOTICES_BUCKET).remove([oldFilename]);
        }
      }
      const result = await uploadNoticeFile(supabase, fields.uploadedFile);
      file_url = result.publicUrl;
      file_type = result.fileType;
    } catch (msg) {
      return { error: msg as string };
    }
  }

  const { error } = await supabase
    .from("notices")
    .update({
      title: fields.title,
      body: fields.body,
      file_url,
      file_type,
      is_ticker: fields.is_ticker,
      is_published: fields.is_published,
      expires_at: fields.expires_at,
      published_at: fields.published_at || new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("updateNotice error:", error.message);
    return { error: "নোটিশ আপডেট করতে সমস্যা হয়েছে।" };
  }

  revalidatePath("/admin/notices");
  revalidatePath(`/admin/notices/${id}/edit`);
  redirect("/admin/notices");
}

// ─── deleteNotice ─────────────────────────────────────────────────────────────
export async function deleteNotice(id: number): Promise<ActionState> {
  const supabase = await createClient();

  // 1. Fetch the notice first to get the attached file URL
  const { data: notice } = await supabase
    .from("notices")
    .select("file_url")
    .eq("id", id)
    .single();

  // 2. Delete the database row
  const { error } = await supabase.from("notices").delete().eq("id", id);

  if (error) {
    console.error("deleteNotice error:", error.message);
    return { error: "নোটিশ মুছতে সমস্যা হয়েছে।" };
  }

  // 3. If deletion succeeded, also remove the file from storage
  if (notice?.file_url) {
    const filename = getFilenameFromUrl(notice.file_url);
    if (filename) {
      await supabase.storage.from(NOTICES_BUCKET).remove([filename]);
    }
  }

  revalidatePath("/admin/notices");
  return { error: null };
}
