// lib/actions/finance.ts
"use server";

import { requireAuth } from "@/lib/auth/rbac";

import { revalidatePath } from "next/cache";
import connectDB from "../db/mongoose";
import { Mosque } from "../Model/Mosque";
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

import bcrypt from "bcryptjs";
import {
  adminCreateMemberSchema,
  AdminCreateMemberInput,
} from "@/lib/validations/family";
import { UserRole } from "@/types/auth";
import { requireTenant } from "../auth/guards";
import { User } from "../Model/User";
import { Family } from "../Model/Family";

export const adminCreateMember = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, input: AdminCreateMemberInput) => {
    const parsed = adminCreateMemberSchema.parse(input);
    await connectDB();

    const existingUser = await User.findOne({ email: parsed.email });
    if (existingUser) throw new Error("A user with this email already exists");

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await User.create({
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      role: UserRole.MEMBER,
      mosqueId: session.user.mosqueId,
    });

    const family = await Family.create({
      mosqueId: session.user.mosqueId,
      userId: user._id,
      headOfFamilyName: parsed.headOfFamilyName,
      phone: parsed.phone,
      address: parsed.address,
      memberCount: parsed.memberCount,
      status: "APPROVED",
      isActive: true,
      joinedDate: new Date(),
    });

    revalidatePath("/dashboard/members");
    return JSON.parse(JSON.stringify(family));
  },
);
