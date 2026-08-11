// features/finance/commitment-actions.ts
"use server";

import { revalidatePath } from "next/cache";
 
import { requireTenant } from "@/lib/auth/guards";
import { UserRole } from "@/types/auth";
import {
  createCommitmentSchema,
  CreateCommitmentInput,
} from "@/lib/validations/finance";
import connectDB from "@/lib/db/mongoose";
import { Commitment } from "@/lib/Model/Commitment";

export const createCommitment = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, input: CreateCommitmentInput) => {
    const parsed = createCommitmentSchema.parse(input);

    if (!parsed.familyId && !parsed.donorNameManual) {
      throw new Error("Provide either a member or a donor name");
    }

    await connectDB();

    const commitment = await Commitment.create({
      ...parsed,
      mosqueId: session.user.mosqueId,
      paidAmount: 0,
      status: "ACTIVE",
      createdBy: session.user.id,
    });

    revalidatePath("/dashboard/finance");
    return JSON.parse(JSON.stringify(commitment));
  },
);

export const cancelCommitment = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, commitmentId: string) => {
    await connectDB();

    const commitment = await Commitment.findOneAndUpdate(
      { _id: commitmentId, mosqueId: session.user.mosqueId },
      { status: "CANCELLED" },
      { new: true },
    );

    if (!commitment) throw new Error("Commitment not found");

    revalidatePath("/dashboard/finance");
    return JSON.parse(JSON.stringify(commitment));
  },
);
