"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransactionSchema,
  CreateTransactionInput,
} from "@/lib/validations/finance";
import { createTransactionAction } from "@/lib/actions/finance";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateTransactionFormProps {
  onSuccess?: () => void;
}

export function CreateTransactionForm({
  onSuccess,
}: CreateTransactionFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: "INCOME",
      paymentMethod: "CASH",
      amount: 0,
    },
  });

  const currentType = watch("type");

  const onSubmit = async (data: CreateTransactionInput) => {
    setServerError(null);
    setSuccessMsg(null);

    const res = await createTransactionAction(data);

    if (!res.success) {
      setServerError(res.message);
      return;
    }

    setSuccessMsg(`Successfully recorded! Receipt: ${res.data?.receiptNumber}`);
    reset();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white border border-sage-200/80 rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)] max-w-xl mx-auto font-body">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-700">
          <Receipt size={20} />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-ink">
            Record Transaction
          </h2>
          <p className="text-xs text-ink-soft">
            Add mosque income or expense entry with auto-receipting.
          </p>
        </div>
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
        {/* Type Toggle (Income / Expense) */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-sage-50 rounded-xl border border-sage-200/60">
          <button
            type="button"
            onClick={() => setValue("type", "INCOME")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentType === "INCOME"
                ? "bg-white text-sage-700 shadow-sm border border-sage-200/80 font-semibold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <ArrowDownLeft size={16} className="text-emerald-600" />
            <span>Income</span>
          </button>

          <button
            type="button"
            onClick={() => setValue("type", "EXPENSE")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentType === "EXPENSE"
                ? "bg-white text-rose-700 shadow-sm border border-sage-200/80 font-semibold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <ArrowUpRight size={16} className="text-rose-600" />
            <span>Expense</span>
          </button>
        </div>

        {/* Category & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="category"
              className="text-xs font-semibold text-ink"
            >
              Category <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category"
              placeholder={
                currentType === "INCOME"
                  ? "e.g. Friday Collection"
                  : "e.g. Electricity Bill"
              }
              className="h-11 rounded-xl border-sage-200 text-ink focus-visible:ring-sage-400/20"
              {...register("category")}
            />
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-semibold text-ink">
              Amount (BDT) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="e.g. 5000"
              className="h-11 rounded-xl border-sage-200 text-ink focus-visible:ring-sage-400/20"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-1.5">
          <Label
            htmlFor="paymentMethod"
            className="text-xs font-semibold text-ink"
          >
            Payment Method
          </Label>
          <select
            id="paymentMethod"
            className="w-full h-11 px-3 rounded-xl border border-sage-200 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-sage-400/20"
            {...register("paymentMethod")}
          >
            <option value="CASH">Cash</option>
            <option value="BKASH">bKash Merchant</option>
            <option value="NAGAD">Nagad</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        {/* Optional Donor / Payer Details (Shown mainly for Income) */}
        {currentType === "INCOME" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sage-100">
            <div className="space-y-1.5">
              <Label
                htmlFor="donorName"
                className="text-xs font-semibold text-ink-soft"
              >
                Donor Name <span className="text-ink-faint">(Optional)</span>
              </Label>
              <Input
                id="donorName"
                placeholder="e.g. Alhaj Mohammad Ali"
                className="h-11 rounded-xl border-sage-200 text-ink focus-visible:ring-sage-400/20"
                {...register("donorName")}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="donorPhone"
                className="text-xs font-semibold text-ink-soft"
              >
                Donor Phone <span className="text-ink-faint">(Optional)</span>
              </Label>
              <Input
                id="donorPhone"
                placeholder="e.g. 01700000000"
                className="h-11 rounded-xl border-sage-200 text-ink focus-visible:ring-sage-400/20"
                {...register("donorPhone")}
              />
            </div>
          </div>
        )}

        {/* Description / Notes */}
        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="text-xs font-semibold text-ink-soft"
          >
            Notes / Description{" "}
            <span className="text-ink-faint">(Optional)</span>
          </Label>
          <input
            id="description"
            placeholder="Add any additional context..."
            className="w-full h-11 px-3 rounded-xl border border-sage-200 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage-400/20"
            {...register("description")}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-4 rounded-xl bg-sage-600 text-white font-medium hover:bg-sage-700 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Recording Transaction...</span>
            </>
          ) : (
            <span>Save Transaction Entry</span>
          )}
        </Button>
      </form>
    </div>
  );
}
