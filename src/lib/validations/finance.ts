// lib/validations/finance.ts
import { z } from "zod";
import { DONATION_CATEGORIES, PAYMENT_METHODS } from "@/lib/constants/finance";

export const createDonationSchema = z.object({
  familyId: z.string().nullish(),
  donorNameManual: z.string().trim().nullish(),
  commitmentId: z.string().nullish(),
  category: z.enum(DONATION_CATEGORIES),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum(PAYMENT_METHODS),
  transactionRef: z.string().trim().nullish(),
  date: z.coerce.date().default(() => new Date()),
  notes: z.string().max(500).nullish(),
});
export type CreateDonationInput = z.infer<typeof createDonationSchema>;

export const createCommitmentSchema = z.object({
  projectId: z.string().nullish(),
  familyId: z.string().nullish(),
  donorNameManual: z.string().trim().nullish(),
  type: z.enum(["PLEDGE", "ASSESSMENT"]),
  category: z.enum(DONATION_CATEGORIES),
  targetAmount: z.coerce
    .number()
    .positive("Target amount must be greater than 0"),
  dueDate: z.coerce.date().nullish(),
  notes: z.string().max(500).nullish(),
});
export type CreateCommitmentInput = z.infer<typeof createCommitmentSchema>;

export const createProjectSchema = z.object({
  title: z.string().min(2, "Title is required").trim(),
  description: z.string().max(1000).nullish(),
  targetAmount: z.coerce.number().positive().nullish(),
  startDate: z.coerce.date().default(() => new Date()),
  endDate: z.coerce.date().nullish(),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
