// lib/validations/mosque.ts
import { z } from "zod";

export const updateMosqueSchema = z.object({
  name: z.string().min(2, "Mosque name is required").trim(),
  address: z.object({
    area: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
    city: z.string().min(1, "City is required").trim(),
    district: z.string().min(1, "District is required").trim(),
    postalCode: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
  }),
  contact: z
    .object({
      phone: z
        .string()
        .optional()
        .transform((val) => val?.trim()),
      email: z.string().email("Invalid email").optional().or(z.literal("")),
      whatsapp: z
        .string()
        .optional()
        .transform((val) => val?.trim()),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
      website: z.string().url("Invalid URL").optional().or(z.literal("")),
    })
    .optional(),
  establishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  imamName: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  capacity: z.number().nonnegative().optional(),
});

export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;
