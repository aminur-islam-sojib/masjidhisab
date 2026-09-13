// lib/actions/finance-queries.ts
"use server";

import { requireAuth } from "@/lib/auth/rbac";
import { Transaction } from "@/lib/db/Transaction";
import connectDB from "@/lib/mongoose";

import mongoose from "mongoose";

export async function getTransactionsAction(
  params: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
    category?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {},
) {
  try {
    const { mosqueId } = await requireAuth();
    await connectDB();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = { mosqueId: new mongoose.Types.ObjectId(mosqueId) };

    if (params.type && params.type !== "ALL") {
      query.type = params.type;
    }

    if (params.category && params.category !== "ALL") {
      query.category = params.category;
    }

    if (params.paymentMethod && params.paymentMethod !== "ALL") {
      query.paymentMethod = params.paymentMethod;
    }

    if (params.dateFrom || params.dateTo) {
      query.date = {};
      if (params.dateFrom) {
        query.date.$gte = new Date(`${params.dateFrom}T00:00:00.000Z`);
      }
      if (params.dateTo) {
        query.date.$lte = new Date(`${params.dateTo}T23:59:59.999Z`);
      }
    }

    if (params.search) {
      query.$or = [
        { category: { $regex: params.search, $options: "i" } },
        { receiptNumber: { $regex: params.search, $options: "i" } },
        { donorName: { $regex: params.search, $options: "i" } },
      ];
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        transactions: transactions.map((t) => ({
          id: t._id.toString(),
          type: t.type,
          category: t.category,
          amount: t.amount,
          paymentMethod: t.paymentMethod,
          receiptNumber: t.receiptNumber,
          donorName: t.donorName || "",
          donorPhone: t.donorPhone || "",
          description: t.description || "",
          date: new Date(t.date).toISOString().split("T")[0],
        })),
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch transactions.",
    };
  }
}
