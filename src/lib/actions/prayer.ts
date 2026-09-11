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
import { computeDaySchedule } from "@/lib/prayer-times";

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

/**
 * Returns today + the next 6 days of prayer times for the current mosque.
 */
export async function getPrayerScheduleAction() {
  try {
    const { mosqueId } = await requireAuth();

    await connectDB();

    const mosque = await Mosque.findById(mosqueId)
      .select("prayerSettings")
      .lean();

    if (!mosque) {
      throw new Error("Mosque workspace not found.");
    }

    const settings = mosque.prayerSettings || {};
    const today = new Date();

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i,
      );
      return computeDaySchedule(settings, date);
    });

    return { success: true, data: days };
  } catch (error: any) {
    console.error("Error loading prayer schedule:", error);
    return {
      success: false,
      message: error.message || "Failed to load prayer schedule.",
    };
  }
}
