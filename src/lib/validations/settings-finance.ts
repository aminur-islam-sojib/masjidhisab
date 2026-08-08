import { z } from "zod";

export const updateFinanceSettingsSchema = z.object({
  currency: z.string().default("BDT"),
  fiscalYearStart: z.string().default("July"),
  zakatNisabAutoFetch: z.boolean().default(false),
  donationAccounts: z.object({
    mobileBanking: z
      .array(
        z.object({
          provider: z
            .string()
            .min(1, "Provider name is required (e.g., bKash)"),
          number: z.string().min(1, "Account number is required"),
        }),
      )
      .optional(),
    bankDetails: z
      .object({
        bankName: z.string().optional(),
        accountName: z.string().optional(),
        accountNumber: z.string().optional(),
        routing: z.string().optional(),
      })
      .optional(),
  }),
});

export type UpdateFinanceSettingsInput = z.infer<
  typeof updateFinanceSettingsSchema
>;
