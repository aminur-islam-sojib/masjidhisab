"use server";

import connectDB from "@/lib/mongoose";
// import { Mosque } from "@/db/Model/Mosque";
import {
  createMosqueSchema,
  updateMosqueSchema,
  CreateMosqueInput,
  UpdateMosqueInput,
} from "./schema";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { Mosque } from "@/lib/db/Model/Mosque";
import { User } from "@/lib/db/Model/User";
import { auth } from "@/lib/auth/auth";

/**
 * 1. CREATE MOSQUE
 * Creates mosque & links mosqueId to the active user in MongoDB
 */
export async function createMosqueAction(data: CreateMosqueInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized. Please log in." };
    }

    // Check if user already owns a mosque
    if (session.user.mosqueId) {
      return { error: "You are already assigned to a mosque." };
    }

    // Validate Input
    const validated = createMosqueSchema.parse(data);

    await connectDB();

    // Generate unique slug
    let baseSlug = slugify(validated.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await Mosque.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 1. Create Mosque Document
    const newMosque = await Mosque.create({
      name: validated.name,
      slug,
      address: {
        city: validated.city,
        district: validated.district,
        area: validated.area,
      },
      contact: {
        phone: validated.phone,
      },
      imamName: validated.imamName,
      capacity: validated.capacity,
      createdBy: session.user.id,
    });

    // 2. Link Mosque ID to the User
    await User.findByIdAndUpdate(session.user.id, {
      mosqueId: newMosque._id,
      role: "ADMIN",
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      mosqueId: newMosque._id.toString(),
      slug: newMosque.slug,
    };
  } catch (err: any) {
    return { error: err.message || "Failed to create mosque." };
  }
}

/**
 * 2. UPDATE MOSQUE
 * Updates mosque details. Restricted to members of this mosque.
 */
export async function updateMosqueAction(data: UpdateMosqueInput) {
  try {
    const session = await auth();
    if (!session?.user?.mosqueId) {
      return { error: "Unauthorized. You do not belong to a mosque." };
    }

    const validated = updateMosqueSchema.parse(data);
    await connectDB();

    const updatedMosque = await Mosque.findByIdAndUpdate(
      session.user.mosqueId,
      {
        $set: {
          ...(validated.name && { name: validated.name }),
          "address.city": validated.city,
          "address.district": validated.district,
          "address.area": validated.area,
          "contact.phone": validated.phone,
          imamName: validated.imamName,
          capacity: validated.capacity,
          "prayerSettings.calculationMethod": validated.calculationMethod,
          "prayerSettings.jummahTime": validated.jummahTime,
          "prayerSettings.timezone": validated.timezone,
          "financeSettings.currency": validated.currency,
          "financeSettings.zakatNisabAutoFetch": validated.zakatNisabAutoFetch,
        },
      },
      { new: true },
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true, data: JSON.parse(JSON.stringify(updatedMosque)) };
  } catch (err: any) {
    return { error: err.message || "Failed to update mosque." };
  }
}

/**
 * 3. DELETE / SUSPEND MOSQUE (Soft Delete)
 * Marks status as SUSPENDED to protect accounting logs & financial history.
 */
export async function suspendMosqueAction() {
  try {
    const session = await auth();
    if (!session?.user?.mosqueId || session.user.role !== "ADMIN") {
      return { error: "Forbidden. Admin access required." };
    }

    await connectDB();

    // Soft delete: Change status to SUSPENDED instead of dropping data
    await Mosque.findByIdAndUpdate(session.user.mosqueId, {
      status: "SUSPENDED",
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to suspend mosque." };
  }
}
