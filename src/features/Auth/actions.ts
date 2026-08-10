"use server";
import { signIn } from "@/lib/auth/auth";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { User } from "@/lib/Model/User";
import {
  LoginInput,
  loginSchema,
  RegisterInput,
  registerSchema,
} from "@/features/Auth/schema";
import connectDB from "@/lib/db/mongoose";

export async function loginAction(data: LoginInput) {
  try {
    // signIn automatically redirects on success if redirectTo is provided
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/welcome",
    });
  } catch (error) {
    // 1. Catch specific Auth.js errors to return to the client
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or security key." };
        case "AccessDenied":
          return { error: "You do not have access to this system." };
        default:
          return { error: "An unexpected authentication error occurred." };
      }
    }

    // 2. CRITICAL: Re-throw the error if it is not an AuthError!
    // This allows Next.js to process the NEXT_REDIRECT thrown by a successful signIn.
    throw error;
  }
}

export async function registerAction(data: RegisterInput) {
  const validated = registerSchema.safeParse(data);
  if (!validated.success) return { error: "Invalid input data" };

  await connectDB();

  const existingUser = await User.findOne({ email: validated.data.email });
  if (existingUser) return { error: "User already exists." };

  const hashedPassword = await bcrypt.hash(validated.data.password, 12);

  try {
    await User.create({
      name: validated.data.name,
      email: validated.data.email,
      password: hashedPassword,
      role: validated.data.role,
      mosqueId: validated.data.mosqueId || null,
    });
    return { success: true };
  } catch (err) {
    console.error("🔴 DATABASE CREATION ERROR:", err?.message || err);
    return { error: "Failed to create user." };
  }
}
