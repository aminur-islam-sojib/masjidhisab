// features/finance/donation-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
 
import { requireTenant } from "@/lib/auth/guards";
import { UserRole } from "@/types/auth";
import { createDonationSchema, CreateDonationInput } from "@/lib/validations/finance";
import connectDB from "@/lib/db/mongoose";
import { Mosque } from "@/lib/Model/Mosque";
import { Commitment } from "@/lib/Model/Commitment";
import { Donation } from "@/lib/Model/Donation";

export const createDonation = requireTenant(
  [UserRole.MOSQUE_ADMIN, UserRole.STAFF],
  async ({ session }, input: CreateDonationInput) => {
    const parsed = createDonationSchema.parse(input);

    if (!parsed.familyId && !parsed.donorNameManual) {
      throw new Error("Provide either a member or a donor name");
    }

    await connectDB();

    // Atomically claim the next receipt number — avoids two admins
    // logging donations at the same moment getting the same number
    const mosque = await Mosque.findByIdAndUpdate(
      session.user.mosqueId,
      { $inc: { "financeSettings.receiptCounter": 1 } },
      { new: true }
    );
    if (!mosque) throw new Error("Mosque not found");

    const receiptNumber = mosque.financeSettings.receiptCounter;

    // If this payment is toward a commitment, validate it belongs to this
    // mosque and isn't already completed/cancelled before accepting the payment
    if (parsed.commitmentId) {
      const commitment = await Commitment.findOne({
        _id: parsed.commitmentId,
        mosqueId: session.user.mosqueId,
        status: "ACTIVE",
      });
      if (!commitment) throw new Error("Commitment not found or no longer active");
    }

    const donation = await Donation.create({
      ...parsed,
      mosqueId: session.user.mosqueId,
      receiptNumber,
      receivedBy: session.user.id,
    });

    // Sync the commitment's running total + auto-complete it if fully paid
    if (parsed.commitmentId) {
      const updated = await Commitment.findByIdAndUpdate(
        parsed.commitmentId,
        { $inc: { paidAmount: parsed.amount } },
        { new: true }
      );
      if (updated && updated.paidAmount >= updated.targetAmount) {
        updated.status = "COMPLETED";
        await updated.save();
      }
    }

    revalidatePath("/dashboard/finance");
    return JSON.parse(JSON.stringify(donation));
  }
);