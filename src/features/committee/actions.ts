// features/committee/actions.ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongoose";
import { CommitteeMember } from "@/lib/Model/CommitteeMember";
import { committeeMemberSchema, CommitteeMemberInput } from "@/lib/validations/committee";
import { requireTenant } from "@/lib/auth/guards";
import { UserRole } from "@/types/auth";

export const createCommitteeMember = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, input: CommitteeMemberInput) => {
    const parsed = committeeMemberSchema.parse(input);
    await connectDB();

    const member = await CommitteeMember.create({
      ...parsed,
      mosqueId: session.user.mosqueId,
      createdBy: session.user.id,
    });

    revalidateTag("committee");
    revalidatePath("/dashboard/members");
    return JSON.parse(JSON.stringify(member));
  }
);

export const updateCommitteeMember = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, memberId: string, input: CommitteeMemberInput) => {
    const parsed = committeeMemberSchema.parse(input);
    await connectDB();

    const member = await CommitteeMember.findOneAndUpdate(
      { _id: memberId, mosqueId: session.user.mosqueId }, // scoped — can't touch another mosque's data
      parsed,
      { new: true }
    );

    if (!member) throw new Error("Committee member not found");

    revalidateTag("committee");
    revalidatePath("/dashboard/members");
    return JSON.parse(JSON.stringify(member));
  }
);

export const deleteCommitteeMember = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, memberId: string) => {
    await connectDB();

    const result = await CommitteeMember.findOneAndDelete({
      _id: memberId,
      mosqueId: session.user.mosqueId,
    });

    if (!result) throw new Error("Committee member not found");

    revalidateTag("committee");
    revalidatePath("/dashboard/members");
    return { deleted: true };
  }
);