"use client";

import * as React from "react";
import {
  getNoticesAction,
  markAllNoticesReadAction,
} from "@/lib/actions/notices";
import { Notice } from "@/types/notice";
import { NoticeForm } from "./notice-form";
import { DeleteNoticeDialog } from "./delete-notice-dialog";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Megaphone,
  Pin,
  Pencil,
  Trash2,
  CheckCheck,
} from "lucide-react";

export default function NoticesPage() {
  const [notices, setNotices] = React.useState<Notice[]>([]);
  const [canManage, setCanManage] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [reloadKey, setReloadKey] = React.useState(0);

  const [showAdd, setShowAdd] = React.useState(false);
  const [editingNotice, setEditingNotice] = React.useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = React.useState<Notice | null>(
    null,
  );

  React.useEffect(() => {
    let active = true;

    startTransition(async () => {
      const res = await getNoticesAction();
      if (!active) return;
      if (res.success && res.data) {
        setNotices(res.data.notices);
        setCanManage(res.data.canManage);
      }
    });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleMarkAllRead = async () => {
    await markAllNoticesReadAction();
  };

  return (
    <div className="space-y-6 mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Notices & Events
          </h1>
          <p className="text-sm text-slate-500">
            Publish announcements for members and the public.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            className="text-slate-600"
          >
            <CheckCheck size={16} />
            Mark all read
          </Button>
          {canManage && (
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
            >
              <Plus size={16} />
              Publish Notice
            </Button>
          )}
        </div>
      </div>

      {/* Notice cards */}
      {isPending && notices.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
          Loading notices...
        </div>
      ) : notices.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
          <Megaphone size={32} className="mx-auto mb-2 opacity-40" />
          <p>No notices published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs ${
                notice.pinned ? "border-amber-200" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                        <Pin size={12} />
                        Pinned
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {notice.publishedAt}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-2">
                    {notice.title}
                  </h3>
                </div>

                {canManage && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingNotice(notice)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      aria-label="Edit notice"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingNotice(notice)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      aria-label="Delete notice"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">
                {notice.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit / Delete Modals */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <NoticeForm
          onCancel={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            setReloadKey((k) => k + 1);
          }}
        />
      </Modal>

      <Modal open={!!editingNotice} onClose={() => setEditingNotice(null)}>
        {editingNotice && (
          <NoticeForm
            notice={editingNotice}
            onCancel={() => setEditingNotice(null)}
            onSuccess={() => {
              setEditingNotice(null);
              setReloadKey((k) => k + 1);
            }}
          />
        )}
      </Modal>

      <Modal open={!!deletingNotice} onClose={() => setDeletingNotice(null)}>
        {deletingNotice && (
          <DeleteNoticeDialog
            notice={deletingNotice}
            onCancel={() => setDeletingNotice(null)}
            onSuccess={() => {
              setDeletingNotice(null);
              setReloadKey((k) => k + 1);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
