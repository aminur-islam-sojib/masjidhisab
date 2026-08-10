// features/committee/queries.ts
import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongoose";
import { CommitteeMember } from "@/lib/db/Model/CommitteeMember";

// Admin dashboard — authenticated, low traffic, no caching needed
export async function getCommitteeForDashboard(mosqueId: string) {
  await connectDB();
  return CommitteeMember.find({ mosqueId }).sort({ displayOrder: 1 }).lean();
}

// Public mosque page — cached, invalidated via the "committee" tag on writes
async function fetchPublicCommittee(mosqueId: string) {
  await connectDB();
  return CommitteeMember.find(
    { mosqueId, isPublic: true },
    "name designation photoUrl bio displayOrder"
  )
    .sort({ displayOrder: 1 })
    .lean();
}

export const getPublicCommittee = unstable_cache(
  fetchPublicCommittee,
  ["public-committee"],
  { revalidate: 300, tags: ["committee"] }
);