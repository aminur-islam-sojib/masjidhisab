"use client";

import * as React from "react";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { deleteNoticeAction } from "@/lib/actions/notices";
import { Notice } from "@/types/notice";
import { Button } from "@/components/ui/button";

interface DeleteNoticeDialogProps {
  notice: Notice;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeleteNoticeDialog({
  notice,
  onSuccess,
  onCancel,
}: DeleteNoticeDialogProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const onDelete = async () => {
    setServerError(null);
    setIsDeleting(true);

    const res = await deleteNoticeAction(notice.id);

    if (!res.success) {
      setServerError(res.message);
      setIsDeleting(false);
      return;
    }

    setIsDeleting(false);
    onSuccess();
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Trash2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Notice
            </h2>
            <p className="text-sm text-slate-500">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <p className="font-medium text-slate-900">{notice.title}</p>
        <p className="text-xs text-slate-500 mt-1">{notice.publishedAt}</p>
      </div>

      {serverError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
          className="text-slate-600"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white hover:bg-red-700 inline-flex items-center gap-2"
        >
          {isDeleting && <Loader2 size={16} className="animate-spin" />}
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>
      </div>
    </div>
  );
}
