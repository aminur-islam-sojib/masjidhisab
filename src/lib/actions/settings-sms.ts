"use server";

import { requireAuth } from "@/lib/auth/rbac";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import connectDB from "../db/mongoose";
import { Mosque } from "../Model/Mosque";

const updateSmsSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z.string().min(1, "Gateway provider is required"),
  apiKey: z.string().min(1, "API Key is required"),
  senderId: z.string().min(1, "Sender ID / Masking name is required"),
});

export async function updateSmsSettingsAction(
  input: z.infer<typeof updateSmsSettingsSchema>,
) {
  try {
    const { mosqueId } = await requireAuth("manage_settings");
    const validated = updateSmsSettingsSchema.parse(input);

    await connectDB();

    await Mosque.findByIdAndUpdate(
      mosqueId,
      { $set: { smsSettings: validated } },
      { new: true },
    );

    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: "SMS Gateway configuration saved successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to save SMS settings.",
    };
  }
}
