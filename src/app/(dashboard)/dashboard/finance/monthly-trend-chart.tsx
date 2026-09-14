"use client";

import { MonthlyPoint } from "@/types/transaction";

interface MonthlyTrendChartProps {
  data: MonthlyPoint[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (!data.length) {
    return (
      <div className="text-sm text-slate-400 py-10 text-center">
        No activity yet.
      </div>
    );
  }

  const width = 560;
  const height = 160;
  const paddingX = 16;
  const paddingTop = 10;
  const paddingBottom = 24;
  const chartHeight = height - paddingTop - paddingBottom;
  const groupWidth = (width - paddingX * 2) / data.length;
  const barWidth = Math.min(14, groupWidth * 0.26);

  const max = Math.max(
    1,
    ...data.map((d) => Math.max(d.income, d.expense)),
  );

  const yFor = (value: number) =>
    paddingTop + chartHeight - (value / max) * chartHeight;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {gridLines.map((p) => {
          const y = paddingTop + chartHeight - p * chartHeight;
          return (
            <line
              key={p}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
          );
        })}

        {data.map((d, i) => {
          const centerX = paddingX + i * groupWidth + groupWidth / 2;
          const incomeX = centerX - barWidth - 2;
          const expenseX = centerX + 2;
          const incomeY = yFor(d.income);
          const expenseY = yFor(d.expense);
          const incomeHeight = chartHeight - (incomeY - paddingTop);
          const expenseHeight = chartHeight - (expenseY - paddingTop);

          return (
            <g key={`${d.month}-${i}`}>
              <rect
                x={incomeX}
                y={incomeY}
                width={barWidth}
                height={incomeHeight}
                rx={4}
                fill="#10b981"
              />
              <rect
                x={expenseX}
                y={expenseY}
                width={barWidth}
                height={expenseHeight}
                rx={4}
                fill="#f43f5e"
              />
              <text
                x={centerX}
                y={height - 8}
                textAnchor="middle"
                fontSize={10}
                className="fill-slate-500"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-1.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          Expense
        </span>
      </div>
    </div>
  );
}
