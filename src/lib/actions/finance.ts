// lib/actions/finance.ts
"use server";

import { requireAuth } from "@/lib/auth/rbac";

import {
  createTransactionSchema,
  CreateTransactionInput,
  updateTransactionSchema,
  UpdateTransactionInput,
} from "@/lib/validations/finance";
import { revalidatePath } from "next/cache";
import connectDB from "../mongoose";
import { Mosque } from "../db/Model/Mosque";
import { Transaction } from "../db/Transaction";
import mongoose from "mongoose";

/**
 * Creates a new Income or Expense record with auto-incrementing receipt numbers.
 * Required Role: MOSQUE_ADMIN or STAFF with 'manage_finance' permission.
 */
export async function createTransactionAction(input: CreateTransactionInput) {
  try {
    // 1. Authenticate & authorize using our RBAC guard
    const { mosqueId, userId } = await requireAuth("manage_finance");

    // 2. Validate input payload with Zod
    const validated = createTransactionSchema.parse(input);

    await connectDB();

    // 3. Atomically increment the mosque's receipt counter
    const mosque = await Mosque.findByIdAndUpdate(
      mosqueId,
      { $inc: { "financeSettings.receiptCounter": 1 } },
      { new: true },
    );

    if (!mosque) {
      throw new Error("Mosque workspace not found.");
    }

    const counter = mosque.financeSettings?.receiptCounter || 1001;
    const receiptNumber = `MH-${new Date().getFullYear()}-${counter}`;

    // 4. Create the financial record
    const transaction = await Transaction.create({
      ...validated,
      mosqueId,
      createdBy: userId,
      receiptNumber,
      date: validated.date ? new Date(validated.date) : new Date(),
    });

    // 5. Revalidate dashboard cache
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Transaction recorded successfully.",
      data: {
        id: transaction._id.toString(),
        receiptNumber: transaction.receiptNumber,
      },
    };
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return {
      success: false,
      message: error.message || "Failed to record transaction.",
    };
  }
}

/**
 * Updates an existing Income or Expense record.
 * Required Role: MOSQUE_ADMIN or STAFF with 'manage_finance' permission.
 */
export async function updateTransactionAction(
  transactionId: string,
  input: UpdateTransactionInput,
) {
  try {
    const { mosqueId } = await requireAuth("manage_finance");
    const validated = updateTransactionSchema.parse(input);

    await connectDB();

    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, mosqueId },
      {
        $set: {
          ...validated,
          date: validated.date ? new Date(validated.date) : new Date(),
        },
      },
      { new: true },
    );

    if (!transaction) {
      throw new Error("Transaction not found in this mosque.");
    }

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");

    return { success: true, message: "Transaction updated successfully." };
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return {
      success: false,
      message: error.message || "Failed to update transaction.",
    };
  }
}

/**
 * Deletes a transaction for the current mosque.
 * Required Role: MOSQUE_ADMIN or STAFF with 'manage_finance' permission.
 */
export async function deleteTransactionAction(transactionId: string) {
  try {
    const { mosqueId } = await requireAuth("manage_finance");

    await connectDB();

    const result = await Transaction.deleteOne({
      _id: transactionId,
      mosqueId,
    });

    if (result.deletedCount === 0) {
      throw new Error("Transaction not found in this mosque.");
    }

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");

    return { success: true, message: "Transaction deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    return {
      success: false,
      message: error.message || "Failed to delete transaction.",
    };
  }
}

/**
 * Fetches dashboard financial totals (Total Income, Total Expense, Net Balance).
 * Allowed Roles: All mosque members.
 */
export async function getFinancialSummaryAction() {
  try {
    const { mosqueId } = await requireAuth(); // Any logged-in member can view summary

    await connectDB();

    const summary = await Transaction.aggregate([
      { $match: { mosqueId: new mongoose.Types.ObjectId(mosqueId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = summary.find((s) => s._id === "INCOME")?.total || 0;
    const expense = summary.find((s) => s._id === "EXPENSE")?.total || 0;

    return {
      success: true,
      data: {
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch financial summary.",
    };
  }
}

/**
 * Fetches chart data for the finance dashboard: monthly income/expense trend
 * and income/expense totals grouped by category.
 * Allowed Roles: All mosque members.
 */
export async function getFinanceAnalyticsAction() {
  try {
    const { mosqueId } = await requireAuth();
    await connectDB();

    const mosqueObjectId = new mongoose.Types.ObjectId(mosqueId);

    // Build the last 6 month keys (oldest -> newest).
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyRaw = await Transaction.aggregate([
      { $match: { mosqueId: mosqueObjectId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            ym: { $dateToString: { format: "%Y-%m", date: "$date" } },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const monthKeys: string[] = [];
    const monthLabels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      monthKeys.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      );
      monthLabels.push(d.toLocaleString("en-US", { month: "short" }));
    }

    const monthlyMap: Record<
      string,
      { income: number; expense: number }
    > = {};
    for (const row of monthlyRaw) {
      const key = row._id.ym;
      if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
      if (row._id.type === "INCOME") monthlyMap[key].income += row.total;
      else monthlyMap[key].expense += row.total;
    }

    const monthly = monthKeys.map((key, index) => ({
      month: monthLabels[index],
      income: monthlyMap[key]?.income || 0,
      expense: monthlyMap[key]?.expense || 0,
    }));

    const categoryRaw = await Transaction.aggregate([
      { $match: { mosqueId: mosqueObjectId } },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const incomeByCategory = categoryRaw
      .filter((row) => row._id.type === "INCOME")
      .slice(0, 6)
      .map((row) => ({ category: row._id.category, amount: row.total }));

    const expenseByCategory = categoryRaw
      .filter((row) => row._id.type === "EXPENSE")
      .slice(0, 6)
      .map((row) => ({ category: row._id.category, amount: row.total }));

    return {
      success: true,
      data: { monthly, incomeByCategory, expenseByCategory },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch finance analytics.",
    };
  }
}
