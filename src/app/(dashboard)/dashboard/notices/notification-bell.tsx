"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import {
  getNoticeBellAction,
  markAllNoticesReadAction,
} from "@/lib/actions/notices";
import { Notice } from "@/types/notice";

interface BellNotice extends Notice {
  unread: boolean;
}

export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notices, setNotices] = React.useState<BellNotice[]>([]);

  const load = () => {
    React.startTransition(async () => {
      const res = await getNoticeBellAction();
      if (res.success && res.data) {
        setUnreadCount(res.data.unreadCount);
        setNotices(res.data.notices);
      }
    });
  };

  React.useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNoticesReadAction();
    load();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl text-ink-soft hover:bg-sage-100/70 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notices.length === 0 ? (
                <p className="text-sm text-slate-400 p-6 text-center">
                  No notices yet.
                </p>
              ) : (
                notices.map((notice) => (
                  <Link
                    key={notice.id}
                    href="/dashboard/notices"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {notice.unread && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {notice.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {notice.publishedAt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <Link
              href="/dashboard/notices"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 border-t border-slate-100"
            >
              View all notices
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
