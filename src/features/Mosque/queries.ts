import "server-only";
import connectDB from "@/lib/mongoose";
import { Mosque } from "@/lib/db/Model/Mosque";
import { auth } from "@/lib/auth/auth";
// import { Mosque } from "@/db/Model/Mosque";

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

/**
 * Fetches all active mosques for the public directory / feed.
 */
export async function getPublicMosques() {
  await connectDB();

  const mosques = await Mosque.find({ status: "ACTIVE" })
    .select("name slug address capacity imamName establishedYear")
    .sort({ name: 1 })
    .lean();

  return mosques.map((m) => ({
    slug: m.slug,
    name: m.name,
    city: m.address?.city || "",
    district: m.address?.district || "",
    area: m.address?.area || "",
    capacity: m.capacity,
    imamName: m.imamName,
    establishedYear: m.establishedYear,
  }));
}
