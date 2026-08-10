// features/family/actions.ts
"use server";

import { auth } from "@/lib/auth/auth";
import connectDB from "@/lib/mongoose";
import { Mosque } from "@/lib/db/Model/Mosque";
import { Family } from "@/lib/db/Model/Family";
import { joinMosqueSchema, JoinMosqueInput } from "@/lib/validations/family";

export async function requestToJoinAction(
  mosqueSlug: string,
  input: JoinMosqueInput,
) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Please log in first", requiresAuth: true };
  }
  if (session.user.mosqueId) {
    return {
      success: false,
      error: "Your account is already linked to a mosque",
    };
  }

  const parsed = joinMosqueSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await connectDB();

  const mosque = await Mosque.findOne(
    { slug: mosqueSlug, status: "ACTIVE" },
    "_id",
  );
  if (!mosque) return { success: false, error: "Mosque not found" };

  const existing = await Family.findOne({ userId: session.user.id });
  if (existing) {
    return {
      success: false,
      error: "You already have a pending or existing request",
    };
  }

  await Family.create({
    mosqueId: mosque._id,
    userId: session.user.id,
    ...parsed.data,
    status: "PENDING",
  });

  return { success: true };
}
