// lib/actions/upload.ts
"use server";

import { requireAuth } from "@/lib/auth/rbac";

/**
 * Uploads a base64 image to ImgBB and returns the public URL.
 * Required Role: manage_settings (only admins upload mosque images).
 */
export async function uploadImageToImgbbAction(base64: string) {
  try {
    await requireAuth("manage_settings");

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("IMGBB_API_KEY is not configured.");
    }

    if (!base64 || !base64.startsWith("data:image/")) {
      throw new Error("Invalid image data.");
    }

    const image = base64.replace(/^data:image\/\w+;base64,/, "");
    if (image.length > 7_000_000) {
      throw new Error("Image must be under 5 MB.");
    }

    const body = new FormData();
    body.append("key", apiKey);
    body.append("image", image);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body,
    });

    const json = await res.json();

    if (!json?.success) {
      throw new Error(json?.error?.message || "Image upload failed.");
    }

    return { success: true, url: json.data.url as string };
  } catch (error: any) {
    console.error("ImgBB upload error:", error);
    return {
      success: false,
      message: error.message || "Failed to upload image.",
    };
  }
}
