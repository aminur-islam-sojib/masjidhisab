import "server-only";
import connectDB from "@/lib/mongoose";
import { Mosque } from "@/lib/db/Model/Mosque";
import { Notice } from "@/lib/db/Notice";

/**
 * Fetches an active mosque and its public notices by slug.
 */
export async function getPublicNoticesBySlug(slug: string) {
  await connectDB();

  const mosque = await Mosque.findOne({ slug, status: "ACTIVE" }).lean();
  if (!mosque) return null;

  const notices = await Notice.find({ mosqueId: mosque._id })
    .sort({ pinned: -1, publishedAt: -1, createdAt: -1 })
    .lean();

  return {
    mosque: JSON.parse(JSON.stringify(mosque)),
    notices: notices.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      pinned: n.pinned,
      publishedAt: new Date(n.publishedAt).toISOString().split("T")[0],
    })),
  };
}
