// features/family/queries.ts
import connectDB from "@/lib/mongoose";
import { Family } from "@/lib/db/Model/Family";

export async function getPendingJoinRequests(mosqueId: string) {
  await connectDB();
  return Family.find({ mosqueId, status: "PENDING" })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();
}
// features/family/queries.ts (add)
export async function getPendingRequestsCount(mosqueId: string) {
  await connectDB();
  return Family.countDocuments({ mosqueId, status: "PENDING" });
}