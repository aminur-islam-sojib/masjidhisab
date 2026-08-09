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
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { 
      type: String, 
      select: false // Excellent for security
    }, 
    name: { 
      type: String, 
      required: [true, "Full name is required"] 
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // This strictly enforces your 4 roles
      default: UserRole.MEMBER,
    },
    mosqueId: {
      type: Schema.Types.ObjectId,
      ref: "Mosque",
      default: null,
      // Keep this false. We will enforce mosqueId requirements in the API/Server Actions
      // so users can register first, and then create their mosque in step 2.
      required: false, 
    },
  },
  { timestamps: true },
);

// Ensure indexing for multi-tenant query performance
UserSchema.index({ mosqueId: 1, email: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);