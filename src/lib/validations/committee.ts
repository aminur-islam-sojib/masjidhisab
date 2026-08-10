// lib/validations/committee.ts
import { z } from "zod";

export const DESIGNATIONS = [
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETARY",
  "ASSISTANT_SECRETARY",
  "TREASURER",
  "MEMBER",
] as const;

export const committeeMemberSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  designation: z.enum(DESIGNATIONS),
  photoUrl: z.string().url("Invalid URL").nullish().or(z.literal("")),
  phone: z.string().nullish().transform((val) => (val ? val.trim() : "")),
  bio: z.string().max(500, "Bio must be under 500 characters").nullish(),
  termStart: z.coerce.date().nullish(),
  termEnd: z.coerce.date().nullish(),
  isPublic: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

export type CommitteeMemberInput = z.infer<typeof committeeMemberSchema>;