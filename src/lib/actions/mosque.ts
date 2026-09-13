// lib/actions/mosque.ts
"use server";

import {
  updateMosqueSchema,
  UpdateMosqueInput,
} from "@/lib/validations/mosque";
import { revalidatePath } from "next/cache";
import { requireAuth } from "../auth/rbac";
import { Mosque } from "../db/Model/Mosque";
import connectDB from "../mongoose";

/**
 * Updates the current mosque's profile settings.
 * Required Role: MOSQUE_ADMIN (or SUPER_ADMIN) with 'manage_settings' permission.
 */
export async function updateMosqueSettingsAction(input: UpdateMosqueInput) {
  try {
    // 1. Guard check: Must be authenticated and have settings permissions
    const { mosqueId } = await requireAuth("manage_settings");

    // 2. Validate payload with Zod
    const validatedData = updateMosqueSchema.parse(input);

    // 3. Connect to Database
    await connectDB();

    // 4. Update the specific mosque (Multi-tenant isolation using mosqueId)
    const updatedMosque = await Mosque.findByIdAndUpdate(
      mosqueId,
      { $set: validatedData },
      { new: true, runValidators: true },
    );

    if (!updatedMosque) {
      throw new Error("Mosque workspace not found.");
    }

    // 5. Revalidate settings cache so frontend fetches fresh data
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Mosque settings updated successfully.",
      data: {
        name: updatedMosque.name,
      },
    };
  } catch (error: any) {
    console.error("Error updating mosque settings:", error);
    return {
      success: false,
      message: error.message || "Failed to update mosque settings.",
    };
  }
}

/**
 * Fetches the current mosque's profile and settings for the settings forms.
 * Allowed for any logged-in member attached to a mosque.
 */
export async function getMosqueSettingsAction() {
  try {
    const { mosqueId } = await requireAuth();
    await connectDB();

    const mosque = await Mosque.findById(mosqueId)
      .select(
        "name address contact establishedYear imamName capacity profileImageUrl coverImageUrl prayerSettings financeSettings",
      )
      .lean();

    if (!mosque) {
      throw new Error("Mosque workspace not found.");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(mosque)),
    };
  } catch (error: any) {
    console.error("Error loading mosque settings:", error);
    return {
      success: false,
      message: error.message || "Failed to load mosque settings.",
    };
  }
}
