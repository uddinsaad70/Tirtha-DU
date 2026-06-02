import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CommitteeTabs from "./_components/CommitteeTabs";
import { headers } from "next/headers";
import { DESIGNATION_MAP, type DesignationKey } from "@/constants/designations";

const ITEMS_PER_PAGE = 15;

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ id?: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;

  const headersList = await headers();
  const host = headersList.get("host") || "tirthodu.top";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (!id) {
    return {
      title: "সদস্যবৃন্দ | তীর্থ",
      description:
        "তীর্থের বর্তমান শিক্ষার্থী, প্রাক্তন সদস্য ও স্বেচ্ছাসেবকদের তালিকা।",
    };
  }

  const supabase = await createClient();
  const { data: member } = await supabase
    .from("members")
    .select("name, designation, department, photo_url, blood_group")
    .eq("id", id)
    .single();

  if (!member) {
    return {
      title: "সদস্য পাওয়া যায়নি | তীর্থ",
    };
  }

  const title = `${member.name} | তীর্থ - ঢাকা বিশ্ববিদ্যালয়`;
  let description = "";
  if (member.department) description += `${member.department}`;

  if (member.designation) {
    // আপনার কনস্ট্যান্ট থেকে বাংলা পদবীটি নিয়ে আসবে
    const designationKey = member.designation as DesignationKey;
    const prettyDesignation =
      DESIGNATION_MAP[designationKey]?.bn ||
      member.designation
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    description += ` • ${prettyDesignation}`;
  }

  if (member.blood_group)
    description += ` • Blood Group: ${member.blood_group}`;

  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = member.photo_url?.startsWith("http")
    ? member.photo_url
    : `${baseUrl}${member.photo_url || "/logo.png"}`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/members?id=${id}`,
      siteName: "তীর্থ-ঢাকা বিশ্ববিদ্যালয়",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: member.name,
        },
        ...previousImages,
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    },
  };
}

// বাংলা সংখ্যাকে ইংরেজিতে রূপান্তরের হেল্পার (বছর বের করার জন্য)
function normalizeBengaliDigits(str: string): string {
  const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str
    .split("")
    .map((ch) => {
      const idx = BENGALI_DIGITS.indexOf(ch);
      return idx !== -1 ? String(idx) : ch;
    })
    .join("");
}

export default async function CommitteePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    status?: string;
  }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";
  const status = resolvedParams.status || "current"; // ডিফল্ট বর্তমান কমিটি
  const currentPage = Number(resolvedParams.page) || 1;

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // ১. ব্যাজগুলোতে (Tabs) দেখানোর জন্য এবং currentYear বের করার জন্য
  const { data: allStats } = await supabase
    .from("members")
    .select("is_alumni, committee_year")
    .not("designation", "is", null);

  const currentCount = allStats?.filter((m) => !m.is_alumni).length || 0;
  const alumniCount = allStats?.filter((m) => m.is_alumni).length || 0;

  // বর্তমান কমিটির সাল বের করা
  const currentYears =
    allStats
      ?.filter((m) => !m.is_alumni && m.committee_year)
      .map((m) => parseInt(normalizeBengaliDigits(m.committee_year!), 10))
      .filter((y) => !isNaN(y)) || [];
  const currentYear =
    currentYears.length > 0
      ? Math.max(...currentYears)
      : new Date().getFullYear();

  // ২. কার্ডগুলোর জন্য ডেটা ফেচিং (সার্চ, সর্ট এবং পেজিনেশন সহ)
  let query = supabase
    .from("members")
    .select(
      "id, name, designation, department, session, photo_url, facebook_url, committee_year, is_alumni, blood_group, phone, bio",
      { count: "exact" },
    )
    .not("designation", "is", null);

  // স্ট্যাটাস অনুযায়ী ফিল্টার
  if (status === "current") {
    query = query.eq("is_alumni", false);
  } else if (status === "alumni") {
    query = query.eq("is_alumni", true);
  } else {
    query = query.order("is_alumni", { ascending: true }); // 'all' হলে বর্তমান আগে আসবে
  }

  // সার্চ
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,department.ilike.%${search}%,designation.ilike.%${search}%`,
    );
  }

  // সর্টিং
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "session_desc") {
    query = query.order("session", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false }); // default: newest
  }

  // পেজিনেশন লিমিট
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("CommitteePage fetch error:", error.message);
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 1;

  return (
    <CommitteeTabs
      members={data ?? []}
      currentCount={currentCount}
      alumniCount={alumniCount}
      currentYear={currentYear}
      initialSearch={search}
      initialSort={sort}
      initialStatus={status}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
