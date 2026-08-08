"use server";

import { requireAuth } from "@/lib/auth/rbac";

import {
  updateFinanceSettingsSchema,
  UpdateFinanceSettingsInput,
} from "@/lib/validations/settings-finance";
import { revalidatePath } from "next/cache";
import connectDB from "../mongoose";
import { Mosque } from "../db/Model/Mosque";

/**
 * Updates mosque finance rules, MFS accounts, and bank details.
 * Required Role: MOSQUE_ADMIN with 'manage_settings' permission.
 */
export async function updateFinanceSettingsAction(
  input: UpdateFinanceSettingsInput,
) {
  try {
    const { mosqueId } = await requireAuth("manage_settings");
    const validated = updateFinanceSettingsSchema.parse(input);

    await connectDB();

    const updated = await Mosque.findByIdAndUpdate(
      mosqueId,
      { $set: { financeSettings: validated } },
      { new: true, runValidators: true },
    );

    if (!updated) throw new Error("Mosque workspace not found.");

    revalidatePath("/dashboard/settings");

    return { success: true, message: "Finance settings updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update finance settings.",
    };
  }
}
