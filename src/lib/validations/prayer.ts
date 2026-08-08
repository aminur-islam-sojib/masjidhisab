// lib/validations/prayer.ts
import { z } from "zod";

export const updatePrayerSettingsSchema = z.object({
  calculationMethod: z.string().min(1, "Calculation method is required"),
  jummahTime: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  timezone: z.string().default("Asia/Dhaka"),
  iqamahOffsets: z
    .object({
      fajr: z.number().min(0).max(60, "Offset cannot exceed 60 minutes"),
      dhuhr: z.number().min(0).max(60),
      asr: z.number().min(0).max(60),
      maghrib: z.number().min(0).max(60),
      isha: z.number().min(0).max(60),
    })
    .optional(),
});

export type UpdatePrayerSettingsInput = z.infer<
  typeof updatePrayerSettingsSchema
>;
