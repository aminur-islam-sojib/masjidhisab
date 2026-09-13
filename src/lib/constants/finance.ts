export const INCOME_CATEGORIES = [
  "Friday Collection",
  "Zakat",
  "Fitrana",
  "Donation",
  "Membership Fee",
  "Fundraising",
  "Other Income",
] as const;

export const EXPENSE_CATEGORIES = [
  "Utility Bills",
  "Salary & Wages",
  "Maintenance & Repairs",
  "Construction",
  "Food & Refreshments",
  "Charity / Welfare",
  "Other Expense",
] as const;

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "BKASH", label: "bKash Merchant" },
  { value: "NAGAD", label: "Nagad" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
] as const;
