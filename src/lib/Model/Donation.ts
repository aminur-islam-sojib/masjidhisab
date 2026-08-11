// lib/db/Model/Donation.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import {
  DONATION_CATEGORIES,
  DonationCategory,
  PAYMENT_METHODS,
  PaymentMethod,
} from "@/lib/constants/finance";

export interface IDonation extends Document {
  mosqueId: Types.ObjectId;
  familyId?: Types.ObjectId; // optional — anonymous/walk-in donors allowed
  donorNameManual?: string;
  commitmentId?: Types.ObjectId; // present when this payment counts toward a pledge/assessment
  category: DonationCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionRef?: string; // bKash/bank reference number
  date: Date;
  receiptNumber: number;
  receivedBy: Types.ObjectId; // which admin/staff logged this
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    familyId: { type: Schema.Types.ObjectId, ref: "Family" },
    donorNameManual: { type: String, trim: true },
    commitmentId: { type: Schema.Types.ObjectId, ref: "Commitment" },

    category: {
      type: String,
      enum: DONATION_CATEGORIES,
      required: true,
      default: "GENERAL",
    },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    transactionRef: { type: String, trim: true },

    date: { type: Date, required: true, default: Date.now },
    receiptNumber: { type: Number, required: true },
    receivedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

// Donation list/report: "all donations for this mosque, most recent first"
DonationSchema.index({ mosqueId: 1, date: -1 });
// Member's own donation history
DonationSchema.index({ mosqueId: 1, familyId: 1, date: -1 });
// "How much has been paid toward this pledge/assessment"
DonationSchema.index({ mosqueId: 1, commitmentId: 1 });
// Category-based reports (e.g. "total Zakat collected this year")
DonationSchema.index({ mosqueId: 1, category: 1, date: -1 });
// Receipt number should be unique per mosque, not globally
DonationSchema.index({ mosqueId: 1, receiptNumber: 1 }, { unique: true });

export const Donation: Model<IDonation> =
  mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", DonationSchema);
