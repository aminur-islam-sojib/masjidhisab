// app/dashboard/settings/_components/finance-settings-form.tsx
"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateFinanceSettingsSchema,
  UpdateFinanceSettingsInput,
} from "@/lib/validations/settings-finance";
import { updateFinanceSettingsAction } from "@/lib/actions/settings-finance";
import {
  Wallet,
  Smartphone,
  Landmark,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinanceSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFinanceSettingsInput>({
    resolver: zodResolver(updateFinanceSettingsSchema),
    defaultValues: {
      currency: "BDT",
      fiscalYearStart: "July",
      zakatNisabAutoFetch: false,
      donationAccounts: {
        mobileBanking: [{ provider: "bKash", number: "" }],
        bankDetails: {
          bankName: "",
          accountName: "",
          accountNumber: "",
          routing: "",
        },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "donationAccounts.mobileBanking",
  });

  async function onSubmit(data: UpdateFinanceSettingsInput) {
    setMessage(null);
    startTransition(async () => {
      const res = await updateFinanceSettingsAction(data);
      setMessage({ success: res.success, text: res.message });
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">
          Finance & Donation Accounts
        </h2>
        <p className="text-sm text-slate-500">
          Configure your accounting currency, fiscal year, and receiving
          mobile/bank accounts.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.success
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.success ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* General Accounting Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Currency Code
          </label>
          <input
            {...register("currency")}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fiscal Year Start Month
          </label>
          <select
            {...register("fiscalYearStart")}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="January">January</option>
            <option value="July">July (Standard Bangladesh)</option>
            <option value="April">April</option>
          </select>
        </div>
      </div>

      {/* Mobile Banking Accounts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Smartphone size={16} className="text-emerald-600" />
            <span>Mobile Financial Services (bKash / Nagad / Rocket)</span>
          </div>
          <button
            type="button"
            onClick={() => append({ provider: "Nagad", number: "" })}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <Plus size={14} /> Add Account
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <select
                {...register(
                  `donationAccounts.mobileBanking.${index}.provider`,
                )}
                className="w-36 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Upay">Upay</option>
              </select>
              <input
                {...register(`donationAccounts.mobileBanking.${index}.number`)}
                placeholder="Merchant / Personal Number (e.g. 017XXXXXXXX)"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <Landmark size={16} className="text-emerald-600" />
          <span>Official Bank Account Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Bank Name
            </label>
            <input
              {...register("donationAccounts.bankDetails.bankName")}
              placeholder="e.g. Islami Bank Bangladesh PLC"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Account Title / Name
            </label>
            <input
              {...register("donationAccounts.bankDetails.accountName")}
              placeholder="e.g. Central Jamia Mosque Fund"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Account Number
            </label>
            <input
              {...register("donationAccounts.bankDetails.accountNumber")}
              placeholder="e.g. 2050XXXXXXXXX"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Routing Number
            </label>
            <input
              {...register("donationAccounts.bankDetails.routing")}
              placeholder="e.g. 1252637"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-xs flex items-center gap-2"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          <span>
            {isPending ? "Saving Finance Settings..." : "Save Finance Settings"}
          </span>
        </Button>
      </div>
    </form>
  );
}
