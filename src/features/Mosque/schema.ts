import { z } from "zod";

// Create Mosque Input Validation
export const createMosqueSchema = z.object({
  name: z.string().min(3, "Mosque name must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  area: z.string().optional(),
  phone: z.string().optional(),
  imamName: z.string().optional(),
  capacity: z.coerce.number().min(0).optional(),
});

// Update Mosque Input Validation
export const updateMosqueSchema = createMosqueSchema.partial().extend({
  calculationMethod: z.string().optional(),
  jummahTime: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  zakatNisabAutoFetch: z.boolean().optional(),
});

export type CreateMosqueInput = z.infer<typeof createMosqueSchema>;
export type UpdateMosqueInput = z.infer<typeof updateMosqueSchema>;
