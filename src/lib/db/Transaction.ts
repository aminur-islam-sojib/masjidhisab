// lib/db/models/Transaction.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type TransactionType = "INCOME" | "EXPENSE";
export type PaymentMethod = "CASH" | "BKASH" | "NAGAD" | "BANK_TRANSFER";

export interface ITransaction extends Document {
  mosqueId: mongoose.Types.ObjectId;
  type: TransactionType;
  category: string; // e.g., "Friday Collection", "Zakat", "Utility Bills", "Salary"
  amount: number;
  paymentMethod: PaymentMethod;
  receiptNumber: string; // Auto-generated e.g., MH-2026-1001
  description?: string;
  donorName?: string;
  donorPhone?: string;
  createdBy: mongoose.Types.ObjectId;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: {
      type: String,
      enum: ["CASH", "BKASH", "NAGAD", "BANK_TRANSFER"],
      default: "CASH",
    },
    receiptNumber: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    donorName: { type: String, trim: true },
    donorPhone: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

// Indexes for high-speed financial reporting queries
TransactionSchema.index({ mosqueId: 1, type: 1, date: -1 });

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
