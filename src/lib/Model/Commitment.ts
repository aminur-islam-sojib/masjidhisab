// lib/db/Model/Commitment.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { DONATION_CATEGORIES, DonationCategory } from "@/lib/constants/finance";

export type CommitmentType = "PLEDGE" | "ASSESSMENT";
export type CommitmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface ICommitment extends Document {
  mosqueId: Types.ObjectId;
  projectId?: Types.ObjectId; // optional — assessments are usually tied to a project, pledges may not be
  familyId?: Types.ObjectId; // optional — allows anonymous/non-member pledges
  donorNameManual?: string; // used when there's no familyId
  type: CommitmentType;
  category: DonationCategory;
  targetAmount: number;
  paidAmount: number; // cached running total — updated when a Donation references this commitment
  dueDate?: Date;
  status: CommitmentStatus;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommitmentSchema: Schema<ICommitment> = new Schema(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    familyId: { type: Schema.Types.ObjectId, ref: "Family" },
    donorNameManual: { type: String, trim: true },

    type: { type: String, enum: ["PLEDGE", "ASSESSMENT"], required: true },
    category: {
      type: String,
      enum: DONATION_CATEGORIES,
      required: true,
      default: "GENERAL",
    },

    targetAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },

    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    notes: { type: String, trim: true, maxlength: 500 },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Dashboard: "all active pledges/assessments for this mosque"
CommitmentSchema.index({ mosqueId: 1, status: 1 });
// Member's own view: "my open commitments"
CommitmentSchema.index({ mosqueId: 1, familyId: 1 });
// Project detail: "all assessments under this project"
CommitmentSchema.index({ mosqueId: 1, projectId: 1 });

export const Commitment: Model<ICommitment> =
  mongoose.models.Commitment ||
  mongoose.model<ICommitment>("Commitment", CommitmentSchema);
