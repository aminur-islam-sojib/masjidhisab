// lib/validations/prayer.ts
import { z } from "zod";

export const updatePrayerSettingsSchema = z.object({
  calculationMethod: z.string().min(1, "Calculation method is required"),
  jummahTime: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  timezone: z.string().default("Asia/Dhaka"),
  mode: z.enum(["auto", "manual"]).default("auto"),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .default({ lat: 23.8103, lng: 90.4125 }),
  iqamahOffsets: z
    .object({
      fajr: z.number().min(0).max(60),
      dhuhr: z.number().min(0).max(60),
      asr: z.number().min(0).max(60),
      maghrib: z.number().min(0).max(60),
      isha: z.number().min(0).max(60),
    })
    .default({ fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 }),
  manualTimes: z
    .object({
      fajr: z.string().optional(),
      dhuhr: z.string().optional(),
      asr: z.string().optional(),
      maghrib: z.string().optional(),
      isha: z.string().optional(),
    })
    .optional(),
});

export type UpdatePrayerSettingsInput = z.infer<
  typeof updatePrayerSettingsSchema
>;
