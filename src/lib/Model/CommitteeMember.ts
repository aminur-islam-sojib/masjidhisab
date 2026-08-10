// lib/db/Model/CommitteeMember.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type CommitteeDesignation =
  | "PRESIDENT"
  | "VICE_PRESIDENT"
  | "SECRETARY"
  | "ASSISTANT_SECRETARY"
  | "TREASURER"
  | "MEMBER";

export interface ICommitteeMember extends Document {
  mosqueId: Types.ObjectId;
  name: string;
  designation: CommitteeDesignation;
  photoUrl?: string;
  phone?: string;
  bio?: string;
  termStart?: Date;
  termEnd?: Date;
  isPublic: boolean;
  displayOrder: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommitteeMemberSchema: Schema<ICommitteeMember> = new Schema(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },

    designation: {
      type: String,
      enum: ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "ASSISTANT_SECRETARY", "TREASURER", "MEMBER"],
      required: true,
      default: "MEMBER",
    },

    photoUrl: { type: String, trim: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },

    termStart: { type: Date },
    termEnd: { type: Date },

    isPublic: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Dashboard listing (admin, all members, ordered)
CommitteeMemberSchema.index({ mosqueId: 1, displayOrder: 1 });

// Public page listing (only isPublic, ordered)
CommitteeMemberSchema.index({ mosqueId: 1, isPublic: 1, displayOrder: 1 });

export const CommitteeMember: Model<ICommitteeMember> =
  mongoose.models.CommitteeMember ||
  mongoose.model<ICommitteeMember>("CommitteeMember", CommitteeMemberSchema);