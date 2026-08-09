// lib/validations/mosque.ts
import { z } from "zod";

export const updateMosqueSchema = z.object({
  name: z.string().min(2, "Mosque name is required").trim(),
  // Image URL validations
  logoUrl: z.string().url("Invalid URL").nullish().or(z.literal("")),   
  coverUrl: z.string().url("Invalid URL").nullish().or(z.literal("")),
     
  address: z.object({
    // Changed to .nullish() to accept both null from DB and undefined
    area: z.string().nullish().transform((val) => (val ? val.trim() : "")),
    city: z.string().min(1, "City is required").trim(),
    district: z.string().min(1, "District is required").trim(),
    postalCode: z.string().nullish().transform((val) => (val ? val.trim() : "")),
  }),

  contact: z.object({
      phone: z.string().nullish().transform((val) => (val ? val.trim() : "")),
      // allow null, undefined, or empty string ""
      email: z.string().email("Invalid email").nullish().or(z.literal("")),
      whatsapp: z.string().nullish().transform((val) => (val ? val.trim() : "")),
    }).nullish(), // entire contact object can be nullish

  socialLinks: z.object({
      facebook: z.string().url("Invalid URL").nullish().or(z.literal("")),
      website: z.string().url("Invalid URL").nullish().or(z.literal("")),
    }).nullish(),

  establishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .nullish(),

  imamName: z.string().nullish().transform((val) => (val ? val.trim() : "")),
  
  capacity: z.number().nonnegative().nullish(),
});

export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;