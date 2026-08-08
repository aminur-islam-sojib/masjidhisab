// lib/actions/prayer.ts
"use server";

import { requireAuth } from "@/lib/auth/rbac";

import {
  updatePrayerSettingsSchema,
  UpdatePrayerSettingsInput,
} from "@/lib/validations/prayer";
import { revalidatePath } from "next/cache";
import connectDB from "../mongoose";
import { Mosque } from "../db/Model/Mosque";

/**
 * Updates the mosque's prayer calculation rules and Iqamah delay offsets.
 * Allowed Roles: MOSQUE_ADMIN, STAFF (Imam) with 'manage_prayers' permission.
 */
export async function updatePrayerSettingsAction(
  input: UpdatePrayerSettingsInput,
) {
  try {
    // 1. Authenticate & authorize user role via RBAC guard
    const { mosqueId } = await requireAuth("manage_prayers");

    // 2. Validate input payload
    const validated = updatePrayerSettingsSchema.parse(input);

    await connectDB();

    // 3. Safely update prayer settings for the tenant mosque only
    const updatedMosque = await Mosque.findByIdAndUpdate(
      mosqueId,
      { $set: { prayerSettings: validated } },
      { new: true, runValidators: true },
    );

    if (!updatedMosque) {
      throw new Error("Mosque workspace not found.");
    }

    // 4. Revalidate pages displaying prayer timings
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/prayers");

    return {
      success: true,
      message: "Prayer schedules and Iqamah rules updated successfully.",
    };
  } catch (error: any) {
    console.error("Error updating prayer settings:", error);
    return {
      success: false,
      message: error.message || "Failed to update prayer settings.",
    };
  }
}
