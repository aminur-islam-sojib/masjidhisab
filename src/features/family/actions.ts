// features/family/actions.ts
"use server";
import connectDB from "@/lib/mongoose";
import { Mosque } from "@/lib/db/Model/Mosque";
import { joinMosqueSchema, JoinMosqueInput } from "@/lib/validations/family";
import { revalidatePath } from "next/cache";
import { Family } from "@/lib/db/Model/Family";
import { User } from "@/lib/db/Model/User";
import { requireTenant } from "@/lib/auth/guards"; // ← this import was missing/pointing nowhere
import { UserRole } from "@/types/auth";
import { auth } from "@/lib/auth/auth";

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
// features/family/actions.ts (add alongside requestToJoinAction)


export const approveJoinRequest = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, familyId: string) => {
    await connectDB();

    const family = await Family.findOneAndUpdate(
      { _id: familyId, mosqueId: session.user.mosqueId, status: "PENDING" },
      { status: "APPROVED", joinedDate: new Date() },
      { new: true }
    );

    if (!family) throw new Error("Request not found or already processed");

    // This is what makes the family a real member: their User account
    // now has mosqueId + MEMBER role. Your existing JWT "bulletproof fix"
    // in auth.ts picks this up automatically next time they hit the app —
    // no separate re-login step needed.
    await User.findByIdAndUpdate(family.userId, {
      mosqueId: session.user.mosqueId,
      role: UserRole.MEMBER,
    });

    revalidatePath(`/dashboard/${session.user.mosqueId}/requests`);
    return { approved: true };
  }
);

export const rejectJoinRequest = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, familyId: string) => {
    await connectDB();

    const family = await Family.findOneAndUpdate(
      { _id: familyId, mosqueId: session.user.mosqueId, status: "PENDING" },
      { status: "REJECTED" },
      { new: true }
    );

    if (!family) throw new Error("Request not found or already processed");

    revalidatePath(`/dashboard/${session.user.mosqueId}/requests`);
    return { rejected: true };
  }
);

// features/family/actions.ts (add)
export const updateFamily = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, familyId: string, input: Partial<JoinMosqueInput>) => {
    await connectDB();
    const family = await Family.findOneAndUpdate(
      { _id: familyId, mosqueId: session.user.mosqueId },
      input,
      { new: true }
    );
    if (!family) throw new Error("Member not found");
    return JSON.parse(JSON.stringify(family));
  }
);

export const toggleFamilyActive = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, familyId: string, isActive: boolean) => {
    await connectDB();
    const family = await Family.findOneAndUpdate(
      { _id: familyId, mosqueId: session.user.mosqueId },
      { isActive },
      { new: true }
    );
    if (!family) throw new Error("Member not found");
    return JSON.parse(JSON.stringify(family));
  }
);


import bcrypt from "bcryptjs";
import { adminCreateMemberSchema, AdminCreateMemberInput } from "@/lib/validations/family";
 

export const adminCreateMember = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, input: AdminCreateMemberInput) => {
    const parsed = adminCreateMemberSchema.parse(input);
    await connectDB();

    const existingUser = await User.findOne({ email: parsed.email });
    if (existingUser) throw new Error("A user with this email already exists");

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const user = await User.create({
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      role: UserRole.MEMBER,
      mosqueId: session.user.mosqueId,
    });

    const family = await Family.create({
      mosqueId: session.user.mosqueId,
      userId: user._id,
      headOfFamilyName: parsed.headOfFamilyName,
      phone: parsed.phone,
      address: parsed.address,
      memberCount: parsed.memberCount,
      status: "APPROVED",
      isActive: true,
      joinedDate: new Date(),
    });

    revalidatePath("/dashboard/members");
    return JSON.parse(JSON.stringify(family));
  }
);