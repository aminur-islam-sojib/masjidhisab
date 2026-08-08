"use server";
import { signIn } from "@/lib/auth/auth";
 
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { User } from "@/lib/db/Model/User";
import { LoginInput, loginSchema, RegisterInput, registerSchema } from "@/features/Auth/schema";
import connectDB from "@/lib/mongoose";

export async function loginAction(data: LoginInput) {
  const validated = loginSchema.safeParse(data);
  if (!validated.success) return { error: "Invalid input data" };

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false, // Handle redirect client-side for smoother UX
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
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