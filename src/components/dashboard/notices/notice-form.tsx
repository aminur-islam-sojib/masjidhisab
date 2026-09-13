"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noticeSchema, NoticeInput } from "@/lib/validations/notice";
import {
  createNoticeAction,
  updateNoticeAction,
} from "@/lib/actions/notices";
import { Notice } from "@/types/notice";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoticeFormProps {
  notice?: Notice;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NoticeForm({ notice, onSuccess, onCancel }: NoticeFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoticeInput>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: notice?.title ?? "",
      message: notice?.message ?? "",
      pinned: notice?.pinned ?? false,
      publishedAt:
        notice?.publishedAt ?? new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: NoticeInput) => {
    setServerError(null);
    setSuccessMsg(null);

    const res = notice
      ? await updateNoticeAction(notice.id, data)
      : await createNoticeAction(data);

    if (!res.success) {
      setServerError(res.message);
      return;
    }

    setSuccessMsg(res.message);
    onSuccess();
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-700">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-ink">
              {notice ? "Edit Notice" : "Publish Notice"}
            </h2>
            <p className="text-xs text-ink-soft">
              {notice
                ? `Update ${notice.title}.`
                : "Share an announcement with members and the public."}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          aria-label="Close"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {serverError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 rounded-xl border border-sage-300 bg-sage-50 p-3.5 text-sm text-sage-700 flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            placeholder="e.g. Friday Jummah timing change"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-rose-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Write the full announcement here..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            {...register("message")}
          />
          {errors.message && (
            <p className="text-xs text-rose-600">{errors.message.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
              type="date"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("publishedAt")}
            />
          </div>

          <label className="flex items-center gap-2.5 px-3 h-11 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              {...register("pinned")}
            />
            <span className="text-sm font-medium text-slate-700">
              Pin this notice
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-slate-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            <span>
              {isSubmitting
                ? "Saving..."
                : notice
                  ? "Save Changes"
                  : "Publish Notice"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
