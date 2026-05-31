"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { error: string | null };

const GALLERY_BUCKET = "gallery";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per image

function getFilenameFromUrl(url: string | null): string | null {
  if (!url) return null;
  return url.split("/").pop() ?? null;
}

// ─── Helper: upload a single image ────────────────────────────────────────────
async function uploadGalleryImage(supabase: any, file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw `"${file.name}" ছবিটির সাইজ ৫ MB এর বেশি।`;
  }
  if (!file.type.startsWith("image/")) {
    throw `"${file.name}" কোনো বৈধ ইমেজ ফাইল নয়।`;
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(filename, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    console.error("Gallery upload error:", uploadError.message);
    throw "ছবি আপলোড করতে সমস্যা হয়েছে।";
  }

  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

// ─── Helper: delete a single image from storage ───────────────────────────────
async function deleteImageFromStorage(
  supabase: any,
  url: string | null,
): Promise<void> {
  const filename = getFilenameFromUrl(url);
  if (!filename) return;

  const { error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .remove([filename]);
  if (error) console.error("Storage delete warning:", error.message);
}

// ─── createGalleryAlbum ───────────────────────────────────────────────────────
export async function createGalleryAlbum(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const title = formData.get("title")?.toString().trim() ?? "";
  const event_name = formData.get("event_name")?.toString().trim() || null;
  const taken_at = formData.get("taken_at")?.toString().trim() || null;

  const files = formData.getAll("images");
  const imageFiles = files.filter(
    (f) => f instanceof File && f.size > 0,
  ) as File[];

  if (!title || title.length < 2)
    return { error: "সঠিক শিরোনাম আবশ্যক (অন্তত ২ অক্ষর)।" };
  if (imageFiles.length === 0)
    return { error: "অ্যালবামের জন্য অন্তত একটি ছবি আবশ্যক।" };
  if (imageFiles.length > 20)
    return { error: "এক অ্যালবামে সর্বোচ্চ ২০টি ছবি আপলোড করা যাবে।" };

  let imageUrls: string[] = [];

  try {
    // সবগুলো ছবি সমান্তরালে (Parallel) আপলোড করা হচ্ছে
    const uploadPromises = imageFiles.map((file) =>
      uploadGalleryImage(supabase, file),
    );
    imageUrls = await Promise.all(uploadPromises);

    // ডাটাবেজে ১টি মাত্র রো (Row) তৈরি করা হচ্ছে, যেখানে সব ছবির লিংক অ্যারে হিসেবে থাকবে
    const { error } = await supabase.from("gallery").insert({
      title,
      event_name,
      taken_at,
      image_urls: imageUrls, // TEXT[] in database
    });

    if (error) {
      console.error("createGalleryAlbum DB error:", error.message);
      // ফেইল করলে আপলোড হওয়া ছবিগুলো ক্লিনআপ করা
      await Promise.all(
        imageUrls.map((url) => deleteImageFromStorage(supabase, url)),
      );
      return { error: "অ্যালবাম সেভ করতে সমস্যা হয়েছে।" };
    }
  } catch (msg) {
    return { error: msg as string };
  }

  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

// ─── deleteGalleryAlbum ───────────────────────────────────────────────────────
export async function deleteGalleryAlbum(id: number): Promise<ActionState> {
  const supabase = await createClient();

  const { data: album } = await supabase
    .from("gallery")
    .select("image_urls")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) return { error: "অ্যালবাম মুছতে সমস্যা হয়েছে।" };

  // অ্যালবামের সবগুলো ছবি স্টোরেজ থেকে ডিলিট করা
  if (album?.image_urls && album.image_urls.length > 0) {
    await Promise.all(
      album.image_urls.map((url: string) =>
        deleteImageFromStorage(supabase, url),
      ),
    );
  }

  revalidatePath("/admin/gallery");
  return { error: null };
}

// ─── updateGalleryAlbum (ALBUM UPDATE) ────────────────────────────────────────
export async function updateGalleryAlbum(
  id: number,
  existingUrls: string[],
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const title = formData.get("title")?.toString().trim() ?? "";
  const event_name = formData.get("event_name")?.toString().trim() || null;
  const taken_at = formData.get("taken_at")?.toString().trim() || null;

  // ক্লায়েন্ট থেকে যে পুরনো ছবিগুলো ইউজার রেখে দিতে চায় (JSON String হিসেবে আসবে)
  const retainedUrlsJson = formData.get("retained_urls")?.toString() || "[]";
  let retainedUrls: string[] = [];
  try {
    retainedUrls = JSON.parse(retainedUrlsJson);
  } catch (e) {}

  // নতুন আপলোড করা ছবিগুলো
  const files = formData.getAll("images");
  const newFiles = files.filter(
    (f) => f instanceof File && f.size > 0,
  ) as File[];

  if (!title || title.length < 2)
    return { error: "সঠিক শিরোনাম আবশ্যক (অন্তত ২ অক্ষর)।" };
  if (retainedUrls.length + newFiles.length === 0)
    return { error: "অ্যালবামে অন্তত একটি ছবি থাকতে হবে।" };
  if (retainedUrls.length + newFiles.length > 20)
    return { error: "এক অ্যালবামে সর্বোচ্চ ২০টি ছবি রাখা যাবে।" };

  let newUploadedUrls: string[] = [];

  try {
    // ১. নতুন কোনো ছবি দিলে সেগুলো আপলোড করা
    if (newFiles.length > 0) {
      const uploadPromises = newFiles.map((file) =>
        uploadGalleryImage(supabase, file),
      );
      newUploadedUrls = await Promise.all(uploadPromises);
    }

    // ২. পুরনো রাখা ছবি + নতুন আপলোড করা ছবির লিংক একসাথে করা
    const finalUrls = [...retainedUrls, ...newUploadedUrls];

    // ৩. ডাটাবেজ আপডেট করা
    const { error } = await supabase
      .from("gallery")
      .update({
        title,
        event_name,
        taken_at,
        image_urls: finalUrls,
      })
      .eq("id", id);

    if (error) throw new Error("অ্যালবাম আপডেট করতে সমস্যা হয়েছে।");

    // ৪. স্টোরেজ ক্লিনআপ: যে পুরনো ছবিগুলো ইউজার রিমুভ করেছে, সেগুলো স্টোরেজ থেকে ডিলিট করা
    const removedUrls = existingUrls.filter(
      (url) => !retainedUrls.includes(url),
    );
    if (removedUrls.length > 0) {
      await Promise.all(
        removedUrls.map((url) => deleteImageFromStorage(supabase, url)),
      );
    }
  } catch (msg) {
    return {
      error: typeof msg === "string" ? msg : "আপডেট করতে সমস্যা হয়েছে।",
    };
  }

  revalidatePath("/admin/gallery");
  revalidatePath(`/admin/gallery/${id}/edit`);
  redirect("/admin/gallery");
}
