// lib/actions/notices.ts
"use server";

import { requireAuth, hasRolePermission } from "@/lib/auth/rbac";
import { noticeSchema, NoticeInput } from "@/lib/validations/notice";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import connectDB from "../mongoose";
import { Notice } from "../db/Notice";
import { User } from "../db/Model/User";

function mapNotice(n: any) {
  return {
    id: n._id.toString(),
    title: n.title,
    message: n.message,
    pinned: n.pinned,
    publishedAt: new Date(n.publishedAt).toISOString().split("T")[0],
    createdAt: new Date(n.createdAt).toISOString(),
  };
}

/**
 * Lists notices for the current mosque. All members can view; the response
 * includes whether the current user can manage notices.
 */
export async function getNoticesAction() {
  try {
    const { mosqueId, role } = await requireAuth();
    await connectDB();

    const notices = await Notice.find({
      mosqueId: new mongoose.Types.ObjectId(mosqueId),
    })
      .sort({ pinned: -1, publishedAt: -1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: {
        canManage: hasRolePermission(role, "manage_notices"),
        notices: notices.map(mapNotice),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch notices.",
    };
  }
}

/**
 * Returns unread count + latest notices for the notification bell.
 */
export async function getNoticeBellAction() {
  try {
    const { mosqueId, userId } = await requireAuth();
    await connectDB();

    const mosqueObjectId = new mongoose.Types.ObjectId(mosqueId);
    const user = await User.findById(userId).select("noticesReadAt").lean();
    const readAt = user?.noticesReadAt
      ? new Date(user.noticesReadAt)
      : new Date(0);

    const [notices, unreadCount] = await Promise.all([
      Notice.find({ mosqueId: mosqueObjectId })
        .sort({ pinned: -1, publishedAt: -1, createdAt: -1 })
        .limit(8)
        .lean(),
      Notice.countDocuments({
        mosqueId: mosqueObjectId,
        createdAt: { $gt: readAt },
      }),
    ]);

    return {
      success: true,
      data: {
        unreadCount,
        notices: notices.map((n) => ({
          ...mapNotice(n),
          unread: new Date(n.createdAt) > readAt,
        })),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch notifications.",
    };
  }
}

/**
 * Marks all current notices as read for the current user.
 */
export async function markAllNoticesReadAction() {
  try {
    const { userId } = await requireAuth();
    await connectDB();

    await User.findByIdAndUpdate(userId, { noticesReadAt: new Date() });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to mark notices as read.",
    };
  }
}

/**
 * Creates a public notice. Required Role: manage_notices.
 */
export async function createNoticeAction(input: NoticeInput) {
  try {
    const { mosqueId, userId } = await requireAuth("manage_notices");
    const validated = noticeSchema.parse(input);

    await connectDB();

    await Notice.create({
      ...validated,
      pinned: validated.pinned ?? false,
      mosqueId,
      createdBy: userId,
      publishedAt: validated.publishedAt
        ? new Date(validated.publishedAt)
        : new Date(),
    });

    revalidatePath("/dashboard/notices");

    return { success: true, message: "Notice published successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create notice.",
    };
  }
}

/**
 * Updates a notice. Required Role: manage_notices.
 */
export async function updateNoticeAction(id: string, input: NoticeInput) {
  try {
    const { mosqueId } = await requireAuth("manage_notices");
    const validated = noticeSchema.parse(input);

    await connectDB();

    const notice = await Notice.findOneAndUpdate(
      { _id: id, mosqueId },
      {
        $set: {
          ...validated,
          pinned: validated.pinned ?? false,
          publishedAt: validated.publishedAt
            ? new Date(validated.publishedAt)
            : new Date(),
        },
      },
      { new: true },
    );

    if (!notice) {
      throw new Error("Notice not found in this mosque.");
    }

    revalidatePath("/dashboard/notices");

    return { success: true, message: "Notice updated successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update notice.",
    };
  }
}

/**
 * Deletes a notice. Required Role: manage_notices.
 */
export async function deleteNoticeAction(id: string) {
  try {
    const { mosqueId } = await requireAuth("manage_notices");

    await connectDB();

    const result = await Notice.deleteOne({ _id: id, mosqueId });

    if (result.deletedCount === 0) {
      throw new Error("Notice not found in this mosque.");
    }

    revalidatePath("/dashboard/notices");

    return { success: true, message: "Notice deleted successfully." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete notice.",
    };
  }
}
