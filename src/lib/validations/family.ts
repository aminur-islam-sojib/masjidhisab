// lib/validations/family.ts
import { z } from "zod";

export const joinMosqueSchema = z.object({
  headOfFamilyName: z.string().min(2, "Name is required").trim(),
  phone: z.string().min(11, "Enter a valid phone number").trim(),
  address: z.string().min(3, "Address is required").trim(),
  memberCount: z.coerce.number().int().min(1, "At least 1 member"),
});

export type JoinMosqueInput = z.infer<typeof joinMosqueSchema>;
