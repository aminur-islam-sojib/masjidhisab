"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Users,
  Receipt,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  getFinancialSummaryAction,
  getFinanceAnalyticsAction,
} from "@/lib/actions/finance";
import { getTransactionsAction } from "@/lib/actions/finance-queries";
import { getMembersAction } from "@/lib/actions/members";
import { getPrayerScheduleAction } from "@/lib/actions/prayer";
import { getMosqueSettingsAction } from "@/lib/actions/mosque";
import { FinanceAnalytics, Transaction } from "@/types/transaction";
import { Member } from "@/types/member";
import { DaySchedule } from "@/lib/prayer-times";
import { MonthlyTrendChart } from "@/app/(dashboard)/dashboard/finance/monthly-trend-chart";
import { CategoryBreakdown } from "@/app/(dashboard)/dashboard/finance/category-breakdown";
import { NextPrayerCard } from "./next-prayer-card";

type StatTone = "emerald" | "rose" | "slate";

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  tone: StatTone;
}) {
  const toneClass: Record<StatTone, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneClass[tone]}`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
        {subtitle && (
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [summary, setSummary] = React.useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [analytics, setAnalytics] = React.useState<FinanceAnalytics>({
    monthly: [],
    incomeByCategory: [],
    expenseByCategory: [],
  });
  const [recent, setRecent] = React.useState<Transaction[]>([]);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [schedule, setSchedule] = React.useState<DaySchedule[]>([]);
  const [mosqueName, setMosqueName] = React.useState("My Mosque");
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    let active = true;

    (async () => {
      const [
        summaryRes,
        analyticsRes,
        recentRes,
        membersRes,
        prayerRes,
        mosqueRes,
      ] = await Promise.all([
        getFinancialSummaryAction(),
        getFinanceAnalyticsAction(),
        getTransactionsAction({ page: 1, limit: 5 }),
        getMembersAction(),
        getPrayerScheduleAction(),
        getMosqueSettingsAction(),
      ]);

      if (!active) return;

      if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
      if (analyticsRes.success && analyticsRes.data)
        setAnalytics(analyticsRes.data);
      if (recentRes.success && recentRes.data)
        setRecent(recentRes.data.transactions as Transaction[]);
      if (membersRes.success && membersRes.data) setMembers(membersRes.data);
      if (prayerRes.success && prayerRes.data) setSchedule(prayerRes.data);
      if (mosqueRes.success && mosqueRes.data)
        setMosqueName(mosqueRes.data.name || "My Mosque");
    })();

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalMembers = members.length;
  const household = members.reduce(
    (sum, m) => sum + (m.familyCount ?? 0),
    0,
  );

  const today = schedule[0];
  const tomorrow = schedule[1];
  const nextPrayer =
    [...(today?.prayers ?? []), ...(tomorrow?.prayers ?? [])].find(
      (p) => p.azanTs > now,
    ) ?? null;

  return (
    <div className="space-y-5 mx-auto pb-12 font-body">
      {/* Header + quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {mosqueName}
          </h1>
          <p className="text-sm text-slate-500">
            Here&apos;s your mosque at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/finance"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            Add Transaction
          </Link>
          <Link
            href="/dashboard/members"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Users size={16} />
            Add Member
          </Link>
        </div>
      </div>

      {/* Asymmetric metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Net Balance</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                ৳ {summary.netBalance.toLocaleString()}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">All-time balance</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-4">
            <MonthlyTrendChart data={analytics.monthly} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <StatCard
            label="Total Income"
            value={`৳ ${summary.totalIncome.toLocaleString()}`}
            icon={TrendingUp}
            tone="emerald"
          />
          <StatCard
            label="Total Expenses"
            value={`৳ ${summary.totalExpense.toLocaleString()}`}
            icon={TrendingDown}
            tone="rose"
          />
          <StatCard
            label="Total Members"
            value={String(totalMembers)}
            subtitle={`${household} household`}
            icon={Users}
            tone="slate"
          />
        </div>
      </div>

      {/* Next prayer + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NextPrayerCard today={today} nextPrayer={nextPrayer} now={now} />

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Transactions
            </h3>
            <Link
              href="/dashboard/finance"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <Receipt size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No transactions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recent.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.type === "INCOME"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {tx.type === "INCOME" ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {tx.category}
                      </p>
                      <p className="text-xs text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tx.type === "INCOME"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}৳{" "}
                    {tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdown
          title="Income by Category"
          data={analytics.incomeByCategory}
          color="emerald"
        />
        <CategoryBreakdown
          title="Expense by Category"
          data={analytics.expenseByCategory}
          color="rose"
        />
      </div>
    </div>
  );
}
