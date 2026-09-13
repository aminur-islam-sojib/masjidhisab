"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth/rbac";
import { User } from "@/lib/db/Model/User";
import connectDB from "@/lib/mongoose";
import {
  addMemberSchema,
  AddMemberInput,
  updateMemberSchema,
  UpdateMemberInput,
} from "@/lib/validations/member";

/**
 * Adds a mosque member (Member or Committee Member) with an optional embedded
 * family list. The added member gets a login account.
 */
export async function addMemberAction(input: AddMemberInput) {
  try {
    const { mosqueId } = await requireAuth("manage_members");
    const validated = addMemberSchema.parse(input);

    await connectDB();

    const existing = await User.findOne({
      email: validated.email.toLowerCase(),
    });
    if (existing) {
      throw new Error("A user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    await User.create({
      name: validated.name,
      email: validated.email.toLowerCase(),
      password: hashedPassword,
      phone: validated.phone,
      role: validated.role,
      mosqueId,
      family: validated.family ?? [],
      familyCount: validated.familyCount,
    });

    revalidatePath("/dashboard/members");

    return { success: true, message: "Member added successfully." };
  } catch (error: any) {
    console.error("Error adding member:", error);
    return {
      success: false,
      message: error.message || "Failed to add member.",
    };
  }
}

/**
 * Lists all members (and committee members) attached to the current mosque.
 */
export async function getMembersAction() {
  try {
    const { mosqueId } = await requireAuth();

    await connectDB();

    const members = await User.find({
      mosqueId: new mongoose.Types.ObjectId(mosqueId),
    })
      .select("name email role phone family familyCount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: members.map((m) => ({
        id: m._id.toString(),
        name: m.name,
        email: m.email,
        role: m.role,
        phone: m.phone || "",
        family: m.family || [],
        familyCount: m.familyCount,
        createdAt: m.createdAt,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching members:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch members.",
    };
  }
}

/**
 * Updates a member's info and family details (head name, phone, role,
 * household count, and family member records).
 */
export async function updateMemberAction(
  userId: string,
  input: UpdateMemberInput,
) {
  try {
    const { mosqueId } = await requireAuth("manage_members");
    const validated = updateMemberSchema.parse(input);

    await connectDB();

    const member = await User.findOne({
      _id: userId,
      mosqueId,
    });

    if (!member) {
      throw new Error("Member not found in this mosque.");
    }

    member.name = validated.name;
    member.phone = validated.phone;
    member.role = validated.role;
    member.family = validated.family ?? [];
    member.familyCount = validated.familyCount;
    await member.save();

    revalidatePath("/dashboard/members");

    return { success: true, message: "Member updated successfully." };
  } catch (error: any) {
    console.error("Error updating member:", error);
    return {
      success: false,
      message: error.message || "Failed to update member.",
    };
  }
}
