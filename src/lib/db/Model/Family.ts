// lib/db/Model/Family.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IFamily extends Document {
  mosqueId: Types.ObjectId;
  userId: Types.ObjectId; // links to the account that owns this profile
  headOfFamilyName: string;
  phone: string;
  address: string;
  memberCount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isActive: { type: Boolean, default: true },
  joinedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FamilySchema: Schema<IFamily> = new Schema(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    headOfFamilyName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    memberCount: { type: Number, required: true, min: 1, default: 1 },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    joinedDate: { type: Date },
  },
  { timestamps: true },
);

FamilySchema.index({ mosqueId: 1, phone: 1 }, { unique: true });

export const Family: Model<IFamily> =
  mongoose.models.Family || mongoose.model<IFamily>("Family", FamilySchema);
