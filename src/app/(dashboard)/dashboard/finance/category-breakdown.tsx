"use client";

import { CategoryTotal } from "@/types/transaction";

interface CategoryBreakdownProps {
  title: string;
  data: CategoryTotal[];
  color: "emerald" | "rose";
}

export function CategoryBreakdown({
  title,
  data,
  color,
}: CategoryBreakdownProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const barClass = color === "emerald" ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span className="text-xs font-medium text-slate-400">
          ৳ {total.toLocaleString()}
        </span>
      </div>

      {!data.length ? (
        <p className="text-sm text-slate-400 py-8 text-center">No records yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((d) => {
            const pct = total ? Math.round((d.amount / total) * 100) : 0;
            return (
              <div key={d.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{d.category}</span>
                  <span className="text-slate-500">
                    ৳ {d.amount.toLocaleString()} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
