export interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  paymentMethod: "CASH" | "BKASH" | "NAGAD" | "BANK_TRANSFER";
  receiptNumber: string;
  description?: string;
  donorName?: string;
  donorPhone?: string;
  date: string; // YYYY-MM-DD
}

export interface MonthlyPoint {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

export interface FinanceAnalytics {
  monthly: MonthlyPoint[];
  incomeByCategory: CategoryTotal[];
  expenseByCategory: CategoryTotal[];
}
