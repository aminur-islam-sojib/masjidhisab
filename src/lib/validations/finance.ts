// lib/validations/finance.ts
import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Type must be INCOME or EXPENSE",
  }),
  category: z.string().min(2, "Category is required").trim(),
  amount: z.number().positive("Amount must be greater than zero"),
  paymentMethod: z.enum(["CASH", "BKASH", "NAGAD", "BANK_TRANSFER"]),
  description: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  donorName: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  donorPhone: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
  date: z.string().optional(), // Date string from input field
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
