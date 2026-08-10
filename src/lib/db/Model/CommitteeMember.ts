// lib/db/Model/CommitteeMember.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type CommitteeDesignation =
  | "PRESIDENT"
  | "SECRETARY"
  | "TREASURER"
  | "VICE_PRESIDENT"
  | "ASSISTANT_SECRETARY"
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
      enum: [
        "PRESIDENT",
        "SECRETARY",
        "TREASURER",
        "VICE_PRESIDENT",
        "ASSISTANT_SECRETARY",
        "MEMBER",
      ],
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
  { timestamps: true },
);

// Query pattern: dashboard list (admin, all members, in display order)
CommitteeMemberSchema.index({ mosqueId: 1, displayOrder: 1 });

// Query pattern: public page (only isPublic ones, in display order)
CommitteeMemberSchema.index({ mosqueId: 1, isPublic: 1, displayOrder: 1 });

export const CommitteeMember: Model<ICommitteeMember> =
  mongoose.models.CommitteeMember ||
  mongoose.model<ICommitteeMember>("CommitteeMember", CommitteeMemberSchema);
