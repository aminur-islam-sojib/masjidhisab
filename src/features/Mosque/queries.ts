import "server-only";
import connectDB from "@/lib/db/mongoose";
import { Mosque } from "@/lib/Model/Mosque";
import { auth } from "@/lib/auth/auth";
import { unstable_cache } from "next/cache";
import { escapeRegex } from "@/lib/utils/regex";

/**
 * Fetches current user's Mosque data for Dashboard pages
 */
export async function getMyMosque() {
  const session = await auth();
  if (!session?.user?.mosqueId) return null;

  await connectDB();
  const mosque = await Mosque.findById(session.user.mosqueId).lean();

  if (!mosque) return null;
  return JSON.parse(JSON.stringify(mosque));
}

/**
 * Fetches Mosque data by Slug for Public Pages
 */
export async function getMosqueBySlug(slug: string) {
  await connectDB();
  const mosque = await Mosque.findOne({ slug, status: "ACTIVE" }).lean();

  if (!mosque) return null;
  return JSON.parse(JSON.stringify(mosque));
}

const PUBLIC_PROJECTION =
  "name slug logoUrl coverUrl address.area address.city address.district imamName capacity establishedYear";

export const getExploreMosques = unstable_cache(
  fetchExploreMosques,
  ["explore-mosques"], // cache key prefix
  { revalidate: 60, tags: ["mosques-explore"] }, // 60s cache, tag for manual invalidation
);

const SINGLE_MOSQUE_PROJECTION =
  "name slug logoUrl coverUrl address contact.phone contact.whatsapp imamName capacity establishedYear prayerSettings socialLinks status";

async function fetchPublicMosqueBySlug(slug: string) {
  await connectDB();
  const mosque = await Mosque.findOne(
    { slug, status: "ACTIVE" },
    SINGLE_MOSQUE_PROJECTION,
  ).lean();
  return mosque; // null → page should 404
}

export const getPublicMosqueBySlug = unstable_cache(
  fetchPublicMosqueBySlug,
  ["public-mosque-by-slug"],
  { revalidate: 120, tags: ["mosques-explore"] }, // reuse the same tag so admin edits invalidate both
);

async function fetchExploreMosques(
  search: string | undefined,
  city: string | undefined,
  page: number,
  limit: number,
) {
  await connectDB();

  const filter: Record<string, unknown> = { status: "ACTIVE" };

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i"); // case-insensitive, partial match
    filter.$or = [
      { name: regex },
      { "address.city": regex },
      { "address.district": regex },
    ];
  }
  if (search) {
    const prefix = new RegExp(`^${escapeRegex(search.toLowerCase())}`);
    filter.searchTokens = prefix;
  }
  if (city) {
    filter["address.city"] = new RegExp(`^${escapeRegex(city)}$`, "i");
  }

  const skip = (page - 1) * limit;
  const projection =
    "name slug logoUrl coverUrl address.area address.city address.district imamName capacity establishedYear";

  const [mosques, total] = await Promise.all([
    Mosque.find(filter, projection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Mosque.countDocuments(filter),
  ]);

  return {
    mosques,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
