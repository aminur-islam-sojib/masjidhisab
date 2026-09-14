"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateTransactionSchema,
  UpdateTransactionInput,
} from "@/lib/validations/finance";
import { updateTransactionAction } from "@/lib/actions/finance";
import { getMembersAction } from "@/lib/actions/members";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
} from "@/lib/constants/finance";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Member } from "@/types/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditTransactionFormProps {
  transaction: Transaction;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditTransactionForm({
  transaction,
  onSuccess,
  onCancel,
}: EditTransactionFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTransactionInput>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      date: transaction.date,
      donorName: transaction.donorName || "",
      donorPhone: transaction.donorPhone || "",
      description: transaction.description || "",
    },
  });

  const currentType = watch("type");
  const baseCategories =
    currentType === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categories = baseCategories.some((c) => c === transaction.category)
    ? baseCategories
    : ([transaction.category, ...baseCategories] as readonly string[]);

  React.useEffect(() => {
    let active = true;
    getMembersAction().then((res) => {
      if (!active || !res.success) return;
      const list = res.data ?? [];
      setMembers(list);
      if (transaction.donorPhone) {
        const match = list.find((m) => m.phone === transaction.donorPhone);
        if (match) setSelectedMemberId(match.id);
      }
    });
    return () => {
      active = false;
    };
  }, [transaction.donorPhone]);

  const handleMemberSelect = (id: string) => {
    setSelectedMemberId(id);
    const member = members.find((m) => m.id === id);
    if (member) {
      setValue("donorName", member.name);
      setValue("donorPhone", member.phone || "");
    }
  };

  const onSubmit = async (data: UpdateTransactionInput) => {
    setServerError(null);
    setSuccessMsg(null);

    const res = await updateTransactionAction(transaction.id, data);

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
            <Receipt size={20} />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-ink">
              Edit Transaction
            </h2>
            <p className="text-xs text-ink-soft">
              Update {transaction.receiptNumber} details.
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
        {/* Type Toggle (Income / Expense) */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-sage-50 rounded-xl border border-sage-200/60">
          <button
            type="button"
            onClick={() => {
              setValue("type", "INCOME");
              setValue("category", "");
            }}
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
            onClick={() => {
              setValue("type", "EXPENSE");
              setValue("category", "");
            }}
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
            <select
              id="category"
              className="w-full h-11 px-3 rounded-xl border border-sage-200 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-sage-400/20"
              {...register("category")}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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

        {/* Payment Method & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-semibold text-ink">
              Date
            </Label>
            <input
              id="date"
              type="date"
              className="w-full h-11 px-3 rounded-xl border border-sage-200 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage-400/20"
              {...register("date")}
            />
          </div>
        </div>

        {/* Optional Donor / Payer Details (Shown mainly for Income) */}
        {currentType === "INCOME" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sage-100">
            <div className="space-y-1.5 sm:col-span-2">
              <Label
                htmlFor="memberDonor"
                className="text-xs font-semibold text-ink-soft"
              >
                Select Existing Member{" "}
                <span className="text-ink-faint">(Optional)</span>
              </Label>
              <select
                id="memberDonor"
                value={selectedMemberId}
                onChange={(e) => handleMemberSelect(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-sage-200 text-sm bg-white text-ink focus:outline-none focus:ring-2 focus:ring-sage-400/20"
              >
                <option value="">Type manually or select a mosque member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                    {member.phone ? ` — ${member.phone}` : ""}
                  </option>
                ))}
              </select>
            </div>

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

        <div className="flex justify-end gap-2 pt-4 border-t border-sage-100">
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
            className="bg-sage-600 text-white font-medium hover:bg-sage-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
