"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import { addMemberAction } from "@/lib/actions/members";
import { addMemberSchema, AddMemberInput } from "@/lib/validations/member";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";

interface AddMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddMemberForm({ onSuccess, onCancel }: AddMemberFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddMemberInput>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      role: UserRole.MEMBER,
      family: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "family",
  });

  const onSubmit = async (data: AddMemberInput) => {
    setServerError(null);
    setSuccessMsg(null);

    const res = await addMemberAction(data);

    if (!res.success) {
      setServerError(res.message);
      return;
    }

    setSuccessMsg(res.message);
    reset({ role: UserRole.MEMBER, family: [] });
    if (onSuccess) onSuccess();
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Add Member</h2>
          <p className="text-sm text-slate-500">
            Create a login account for the head of the family, then add family
            members under them.
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {serverError && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              placeholder="Head of family name"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-rose-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="member@example.com"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Temporary Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              placeholder="01XXXXXXXXX"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("phone")}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("role")}
            >
              <option value={UserRole.MEMBER}>Member</option>
              <option value={UserRole.COMMITTEE_MEMBER}>
                Committee Member
              </option>
            </select>
            {errors.role && (
              <p className="text-xs text-rose-600">{errors.role.message}</p>
            )}
          </div>
        </div>

        {/* Family members */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Total household members (including head)
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 5"
              className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("familyCount", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.familyCount && (
              <p className="text-xs text-rose-600">
                {errors.familyCount.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              Family Members
            </div>
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  relation: "",
                  phone: "",
                  ageOrDob: "",
                  gender: "Male",
                })
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              <Plus size={14} /> Add Family Member
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-slate-400">
              No family members added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <input
                    placeholder="Family member name"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    {...register(`family.${index}.name`)}
                  />
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    {...register(`family.${index}.relation`)}
                  >
                    <option value="">Select relation</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    placeholder="Phone"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    {...register(`family.${index}.phone`)}
                  />
                  <input
                    placeholder="Age / DOB"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    {...register(`family.${index}.ageOrDob`)}
                  />
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:col-span-2"
                    {...register(`family.${index}.gender`)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-slate-200 bg-white transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            <span>{isSubmitting ? "Adding Member..." : "Add Member"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
