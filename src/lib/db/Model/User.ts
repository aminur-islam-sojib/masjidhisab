import { UserRole } from "@/types/auth";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  mosqueId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false }, // Excluded by default for security
    name: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
    },
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      default: null,
      // Temporarily set to false to allow registration without a mosque.
      // You can implement the logic later to require this during onboarding.
      required: false,
      //   required: function() {
      //     // Super Admins don't belong to a specific mosque
      //     return this.role !== UserRole.SUPER_ADMIN;
      //   }
    },
  },
  { timestamps: true },
);

// Ensure indexing for multi-tenant query performance
UserSchema.index({ mosqueId: 1, email: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
