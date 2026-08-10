// lib/validations/family.ts
import { z } from "zod";

export const joinMosqueSchema = z.object({
  headOfFamilyName: z.string().min(2, "Name is required").trim(),
  phone: z.string().min(11, "Enter a valid phone number").trim(),
  address: z.string().min(3, "Address is required").trim(),
  memberCount: z.coerce.number().int().min(1, "At least 1 member"),
});

export type JoinMosqueInput = z.infer<typeof joinMosqueSchema>;
// lib/validations/family.ts (add)
export const adminCreateMemberSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  headOfFamilyName: z.string().min(2, "Head of family name is required").trim(),
  phone: z.string().min(11, "Enter a valid phone number").trim(),
  address: z.string().min(3, "Address is required").trim(),
  memberCount: z.coerce.number().int().min(1, "At least 1 member"),
});

export type AdminCreateMemberInput = z.infer<typeof adminCreateMemberSchema>;