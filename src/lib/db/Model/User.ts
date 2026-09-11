import { UserRole } from "@/types/auth";
import mongoose, { Schema, Document } from "mongoose";

export interface IFamilyMember {
  name: string;
  relation: string;
  phone?: string;
  ageOrDob?: string;
  gender?: "Male" | "Female";
}

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  phone?: string;
  family?: IFamilyMember[];
  familyCount?: number;
  mosqueId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMember>(
  {
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    ageOrDob: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female"] },
  },
  { _id: false },
);

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
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
    },
    family: { type: [FamilyMemberSchema], default: [] },
    familyCount: { type: Number, min: 0 },
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
