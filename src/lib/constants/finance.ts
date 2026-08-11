// lib/constants/finance.ts

export const DONATION_CATEGORIES = [
  "GENERAL",
  "SADAQAH",
  "ZAKAT",
  "QURBANI",
  "WAQF",
  "MEMBERSHIP_DUE",
  "DEVELOPMENT_FUND",
  "OTHER",
] as const;

export type DonationCategory = (typeof DONATION_CATEGORIES)[number];

export const CATEGORY_LABEL: Record<DonationCategory, string> = {
  GENERAL: "General Donation",
  SADAQAH: "Sadaqah",
  ZAKAT: "Zakat",
  QURBANI: "Qurbani",
  WAQF: "Waqf",
  MEMBERSHIP_DUE: "Membership Due",
  DEVELOPMENT_FUND: "Development Fund",
  OTHER: "Other",
};

export const PAYMENT_METHODS = [
  "CASH",
  "BKASH",
  "NAGAD",
  "BANK",
  "OTHER",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: "Cash",
  BKASH: "bKash",
  NAGAD: "Nagad",
  BANK: "Bank Transfer",
  OTHER: "Other",
};
