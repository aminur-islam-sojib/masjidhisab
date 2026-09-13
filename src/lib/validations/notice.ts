import { z } from "zod";

export const noticeSchema = z.object({
  title: z.string().min(3, "Title is required").trim(),
  message: z.string().min(3, "Message is required").trim(),
  pinned: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

export type NoticeInput = z.infer<typeof noticeSchema>;
