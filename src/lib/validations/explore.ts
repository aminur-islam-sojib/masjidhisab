// lib/validations/explore.ts
import { z } from "zod";

export const exploreMosquesQuerySchema = z.object({
  search: z.string().trim().optional(),
  city: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ExploreMosquesQuery = z.infer<typeof exploreMosquesQuerySchema>;
