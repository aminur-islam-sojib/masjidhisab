// lib/db/Model/Project.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IProject extends Document {
  mosqueId: Types.ObjectId;
  title: string;
  description?: string;
  targetAmount?: number;
  startDate: Date;
  endDate?: Date;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    targetAmount: { type: Number, min: 0 },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

ProjectSchema.index({ mosqueId: 1, status: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
