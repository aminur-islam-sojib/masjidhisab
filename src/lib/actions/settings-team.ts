"use server";

import { requireAuth } from "@/lib/auth/rbac";

import { UserRole } from "@/types/auth";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "../db/mongoose";
import { User } from "../Model/User";

/**
 * Fetches all team members and staff tied to the current mosque workspace.
 */
export async function getMosqueTeamAction() {
  try {
    const { mosqueId } = await requireAuth("manage_members");

    await connectDB();

    const members = await User.find({
      mosqueId: new mongoose.Types.ObjectId(mosqueId),
    })
      .select("name email role createdAt")
      .lean();

    return {
      success: true,
      data: members.map((m) => ({
        id: m._id.toString(),
        name: m.name,
        email: m.email,
        role: m.role,
        createdAt: m.createdAt,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch team members.",
    };
  }
}

/**
 * Updates a member's role within the mosque workspace.
 */
export async function updateMemberRoleAction(
  userId: string,
  newRole: UserRole,
) {
  try {
    const { mosqueId, userId: currentUserId } =
      await requireAuth("manage_members");

    // Prevent admin from changing their own role accidentally
    if (userId === currentUserId) {
      throw new Error("You cannot change your own role.");
    }

    await connectDB();

    const member = await User.findOne({ _id: userId, mosqueId });
    if (!member) throw new Error("Member not found in this mosque.");

    member.role = newRole;
    await member.save();

    revalidatePath("/dashboard/settings");

    return { success: true, message: "Member role updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update member role.",
    };
  }
}
