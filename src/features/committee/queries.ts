import { CommitteeMember } from "@/lib/db/Model/CommitteeMember";
import connectDB from "@/lib/mongoose";
import { unstable_cache } from "next/cache";

// features/committee/queries.ts
export async function fetchPublicCommittee(mosqueId: string) {
  await connectDB();
  return CommitteeMember.find(
    { mosqueId, isPublic: true },
    "name designation photoUrl displayOrder",
  )
    .sort({ displayOrder: 1 })
    .lean();
}

export const getPublicCommittee = unstable_cache(
  fetchPublicCommittee,
  ["public-committee"],
  { revalidate: 300, tags: ["committee"] },
);
// features/committee/queries.ts (add alongside the public one from before)
export async function getCommitteeForDashboard(mosqueId: string) {
  await connectDB();
  return CommitteeMember.find({ mosqueId }).sort({ displayOrder: 1 }).lean();
}
