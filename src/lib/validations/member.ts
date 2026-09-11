import { z } from "zod";
import { UserRole } from "@/types/auth";

export const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z.string().optional(),
  ageOrDob: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
});

export const addMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum([UserRole.MEMBER, UserRole.COMMITTEE_MEMBER]),
  familyCount: z.number().int().min(0).optional(),
  family: z.array(familyMemberSchema).default([]),
});

export const updateMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  role: z.enum([UserRole.MEMBER, UserRole.COMMITTEE_MEMBER]),
  familyCount: z.number().int().min(0).optional(),
  family: z.array(familyMemberSchema).default([]),
});

export type FamilyMemberInput = z.infer<typeof familyMemberSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
