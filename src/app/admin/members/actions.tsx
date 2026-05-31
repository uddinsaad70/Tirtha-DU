"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  error: string | null;
};

const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const AVATAR_BUCKET = "avatars";
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// ─── Helper: Extract filename from Supabase Public URL ───────────────────────
function getFilenameFromUrl(url: string | null): string | null {
  if (!url) return null;
  // লিংকের একদম শেষের অংশটুকু (ফাইলের নাম) আলাদা করবে
  return url.split("/").pop() ?? null;
}

// ─── Helper: upload a photo ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function uploadPhoto(
  supabase: any,
  file: File | null,
  existingUrl?: string | null,
): Promise<string | null> {
  if (!file || file.size === 0) return existingUrl ?? null;
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw "ছবির সাইজ সর্বোচ্চ ২ MB হতে হবে।";
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filename, file, { upsert: false, contentType: file.type });

  if (uploadError) {
    console.error("Storage upload error:", uploadError.message);
    throw "ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

// ─── Helper: extract fields ──────────────────────────────────────────────────
function extractFields(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const department = formData.get("department")?.toString().trim() || null;
  const session = formData.get("session")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const facebook_url = formData.get("facebook_url")?.toString().trim() || null;
  const bio = formData.get("bio")?.toString().trim() || null;
  const committee_year =
    formData.get("committee_year")?.toString().trim() || null;

  const rawBloodGroup = formData.get("blood_group")?.toString().trim() ?? "";
  const blood_group = VALID_BLOOD_GROUPS.includes(rawBloodGroup)
    ? rawBloodGroup
    : null;

  const rawIsAlumni = formData.get("is_alumni")?.toString();
  const is_alumni = rawIsAlumni === "true"; // যদি "true" হয়, তাহলে প্রাক্তন
  const is_current = !is_alumni; // প্রাক্তন না হলে সে বর্তমান

  const role = formData.get("role")?.toString() ?? "general";
  const designation =
    role === "committee"
      ? formData.get("designation")?.toString().trim() || null
      : null;

  const photo = formData.get("photo");
  const photoFile = photo instanceof File && photo.size > 0 ? photo : null;

  return {
    name,
    department,
    session,
    phone,
    facebook_url,
    bio,
    committee_year,
    blood_group,
    is_current,
    is_alumni,
    role,
    designation,
    photoFile,
  };
}

// ─── createMember ─────────────────────────────────────────────────────────────
export async function createMember(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const fields = extractFields(formData);

  if (!fields.name) return { error: "সদস্যের নাম আবশ্যক।" };
  if (fields.name.length < 2)
    return { error: "নামটি কমপক্ষে ২ অক্ষরের হতে হবে।" };
  if (fields.role === "committee" && !fields.designation) {
    return { error: "কমিটি সদস্যের জন্য পদবী আবশ্যক।" };
  }

  let photo_url: string | null = null;
  try {
    photo_url = await uploadPhoto(supabase, fields.photoFile, null);
  } catch (msg) {
    return { error: msg as string };
  }

  const { error } = await supabase.from("members").insert({
    name: fields.name,
    department: fields.department,
    session: fields.session,
    blood_group: fields.blood_group,
    phone: fields.phone,
    facebook_url: fields.facebook_url,
    photo_url,
    bio: fields.bio,
    designation: fields.designation,
    committee_year: fields.committee_year,
    is_current: fields.is_current,
    is_alumni: fields.is_alumni,
  });

  if (error) {
    console.error("createMember error:", error.message);
    return { error: "সদস্য সেভ করতে সমস্যা হয়েছে।" };
  }

  revalidatePath("/admin/members");
  redirect("/admin/members");
}

// ─── updateMember ─────────────────────────────────────────────────────────────
export async function updateMember(
  id: number,
  existingPhotoUrl: string | null,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const fields = extractFields(formData);

  if (!fields.name) return { error: "সদস্যের নাম আবশ্যক।" };
  if (fields.name.length < 2)
    return { error: "নামটি কমপক্ষে ২ অক্ষরের হতে হবে।" };
  if (fields.role === "committee" && !fields.designation) {
    return { error: "কমিটি সদস্যের জন্য পদবী আবশ্যক।" };
  }

  let photo_url: string | null = existingPhotoUrl;
  try {
    // যদি নতুন ছবি সিলেক্ট করা হয়, তবেই পুরনো ছবি ডিলিট করে নতুন আপলোড হবে
    if (fields.photoFile) {
      photo_url = await uploadPhoto(supabase, fields.photoFile, null);

      // নতুন ছবি সফলভাবে আপলোড হলে, স্টোরেজ থেকে পুরনো ছবিটি মুছে ফেলা
      if (existingPhotoUrl) {
        const oldFilename = getFilenameFromUrl(existingPhotoUrl);
        if (oldFilename) {
          await supabase.storage.from(AVATAR_BUCKET).remove([oldFilename]);
        }
      }
    }
  } catch (msg) {
    return { error: msg as string };
  }

  const { error } = await supabase
    .from("members")
    .update({
      name: fields.name,
      department: fields.department,
      session: fields.session,
      blood_group: fields.blood_group,
      phone: fields.phone,
      facebook_url: fields.facebook_url,
      photo_url,
      bio: fields.bio,
      designation: fields.designation,
      committee_year: fields.committee_year,
      is_current: fields.is_current,
      is_alumni: fields.is_alumni,
    })
    .eq("id", id);

  if (error) {
    console.error("updateMember error:", error.message);
    return { error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  }

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${id}/edit`);
  redirect("/admin/members");
}

// ─── deleteMember ─────────────────────────────────────────────────────────────
export async function deleteMember(id: number): Promise<ActionState> {
  const supabase = await createClient();

  // ১. ডিলিট করার আগে মেম্বারের ডাটা ফেচ করে ছবির লিংকটি বের করা
  const { data: member } = await supabase
    .from("members")
    .select("photo_url")
    .eq("id", id)
    .single();

  // ২. ডাটাবেজ থেকে মেম্বারকে ডিলিট করা
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) {
    console.error("deleteMember error:", error.message);
    return { error: "সদস্য মুছতে সমস্যা হয়েছে।" };
  }

  // ৩. মেম্বার সফলভাবে ডিলিট হলে, তার ছবিটিও স্টোরেজ থেকে মুছে ফেলা
  if (member?.photo_url) {
    const filename = getFilenameFromUrl(member.photo_url);
    if (filename) {
      await supabase.storage.from(AVATAR_BUCKET).remove([filename]);
    }
  }

  revalidatePath("/admin/members");
  return { error: null };
}
