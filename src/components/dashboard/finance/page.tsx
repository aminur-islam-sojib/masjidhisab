// app/dashboard/finance/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { getFinancialSummaryAction } from "@/lib/actions/finance";
import { getTransactionsAction } from "@/lib/actions/finance-queries";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Receipt,
} from "lucide-react";

export default function FinanceDashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Load summary and data
  const loadData = (page = 1, search = searchQuery, type = typeFilter) => {
    startTransition(async () => {
      // 1. Fetch Summary Totals
      const summaryRes = await getFinancialSummaryAction();
      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }

      // 2. Fetch Paginated List
      const listRes = await getTransactionsAction({
        page,
        limit: 8,
        search,
        type,
      });
      if (listRes.success && listRes.data) {
        setTransactions(listRes.data.transactions);
        setTotalPages(listRes.data.totalPages);
        setCurrentPage(listRes.data.currentPage);
      }
    });
  };

  useEffect(() => {
    loadData(1);
  }, [typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(1, searchQuery, typeFilter);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-body">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Mosque Accounts & Hisab
          </h1>
          <p className="text-sm text-slate-500">
            Track donations, Friday collections, utility costs, and financial
            reports.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Income</p>
            <h3 className="text-xl font-bold text-slate-900">
              ৳ {summary.totalIncome.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Expenses</p>
            <h3 className="text-xl font-bold text-slate-900">
              ৳ {summary.totalExpense.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Net Balance</p>
            <h3 className="text-xl font-bold text-slate-900">
              ৳ {summary.netBalance.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search category, receipt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "INCOME", "EXPENSE"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab === "ALL" ? "All Entries" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Donor / Payer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isPending ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No financial transactions found.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900">
                      {tx.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          tx.type === "INCOME"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {tx.donorName}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                      {tx.paymentMethod}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold ${
                        tx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"} ৳{" "}
                      {tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => loadData(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => loadData(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
