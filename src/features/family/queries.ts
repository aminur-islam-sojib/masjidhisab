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

// features/family/queries.ts (add)
export async function getApprovedFamilies(mosqueId: string) {
  await connectDB();
  return Family.find({ mosqueId, status: "APPROVED" })
    .populate("userId", "name email")
    .sort({ headOfFamilyName: 1 })
    .lean();
}

export async function getFamilyById(mosqueId: string, familyId: string) {
  await connectDB();
  return Family.findOne({ _id: familyId, mosqueId }).populate("userId", "name email").lean();
}

// The member's own view — scoped by their own userId, not mosqueId + familyId from a URL
export async function getOwnFamilyProfile(userId: string) {
  await connectDB();
  return Family.findOne({ userId }).lean();
}
 
 