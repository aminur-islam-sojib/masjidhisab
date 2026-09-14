"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getFinancialSummaryAction,
  getFinanceAnalyticsAction,
} from "@/lib/actions/finance";
import { getTransactionsAction } from "@/lib/actions/finance-queries";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "@/lib/constants/finance";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Receipt,
  Pencil,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { Transaction, FinanceAnalytics } from "@/types/transaction";
import { MonthlyTrendChart } from "./monthly-trend-chart";
import { CategoryBreakdown } from "./category-breakdown";
import { CreateTransactionForm } from "./create-transaction-form";
import { EditTransactionForm } from "./edit-transaction-form";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export default function FinanceDashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [analytics, setAnalytics] = useState<FinanceAnalytics>({
    monthly: [],
    incomeByCategory: [],
    expenseByCategory: [],
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);

  const loadData = (page = 1) => {
    startTransition(async () => {
      const summaryRes = await getFinancialSummaryAction();
      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }

      const analyticsRes = await getFinanceAnalyticsAction();
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }

      const listRes = await getTransactionsAction({
        page,
        limit: 8,
        search: searchQuery,
        type: typeFilter,
        category: categoryFilter,
        paymentMethod: methodFilter,
        dateFrom,
        dateTo,
      });
      if (listRes.success && listRes.data) {
        setTransactions(listRes.data.transactions as Transaction[]);
        setTotalPages(listRes.data.totalPages);
        setCurrentPage(listRes.data.currentPage);
      }
    });
  };

  useEffect(() => {
    loadData(1);
  }, [typeFilter, categoryFilter, methodFilter, dateFrom, dateTo]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(1);
  };

  const resetFilters = () => {
    setCategoryFilter("ALL");
    setMethodFilter("ALL");
    setDateFrom("");
    setDateTo("");
  };

  const categoryOptions =
    typeFilter === "INCOME"
      ? [...INCOME_CATEGORIES]
      : typeFilter === "EXPENSE"
        ? [...EXPENSE_CATEGORIES]
        : [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  const typeBadgeClass = (type: Transaction["type"]) =>
    type === "INCOME"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <div className="space-y-6 mx-auto pb-12 font-body">
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

        <Button
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Transaction
        </Button>
      </div>

      {/* Summary + monthly trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Net Balance</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                ৳ {summary.netBalance.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-4">
            <MonthlyTrendChart data={analytics.monthly} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Income</p>
              <h3 className="text-lg font-bold text-slate-900">
                ৳ {summary.totalIncome.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Expenses</p>
              <h3 className="text-lg font-bold text-slate-900">
                ৳ {summary.totalExpense.toLocaleString()}
              </h3>
            </div>
          </div>
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
              onClick={() => {
                setTypeFilter(tab);
                setCategoryFilter("ALL");
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab === "ALL" ? "All Entries" : tab}
            </button>
          ))}

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              showFilters
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                Payment Method
              </label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Methods</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="text-slate-600"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Mobile / tablet card list */}
      <div className="space-y-3 md:hidden">
        {isPending ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            Loading records...
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <Receipt size={32} className="mx-auto mb-2 opacity-40" />
            <p>No financial transactions found.</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-slate-900">
                    {tx.receiptNumber}
                  </p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeBadgeClass(
                    tx.type,
                  )}`}
                >
                  {tx.type}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="text-slate-600">{tx.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Donor / Payer</p>
                  <p className="text-slate-600">{tx.donorName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Method</p>
                  <p className="text-slate-600">{tx.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Amount</p>
                  <p
                    className={`font-bold ${
                      tx.type === "INCOME"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"} ৳{" "}
                    {tx.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  onClick={() => setEditingTx(tx)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => setDeletingTx(tx)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isPending ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
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
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeBadgeClass(
                          tx.type,
                        )}`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {tx.donorName || "—"}
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingTx(tx)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
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

      {/* Add / Edit / Delete Modals */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <CreateTransactionForm
          onCancel={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            loadData(1);
          }}
        />
      </Modal>

      <Modal open={!!editingTx} onClose={() => setEditingTx(null)}>
        {editingTx && (
          <EditTransactionForm
            transaction={editingTx}
            onCancel={() => setEditingTx(null)}
            onSuccess={() => {
              setEditingTx(null);
              loadData(currentPage);
            }}
          />
        )}
      </Modal>

      <Modal open={!!deletingTx} onClose={() => setDeletingTx(null)}>
        {deletingTx && (
          <DeleteTransactionDialog
            transaction={deletingTx}
            onCancel={() => setDeletingTx(null)}
            onSuccess={() => {
              setDeletingTx(null);
              loadData(currentPage);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
