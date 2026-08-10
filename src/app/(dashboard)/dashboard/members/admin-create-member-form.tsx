// app/(dashboard)/dashboard/members/admin-create-member-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCreateMemberSchema, AdminCreateMemberInput } from "@/lib/validations/family";
import { adminCreateMember } from "@/lib/actions/finance";

export default function AdminCreateMemberForm({ onSaved }: { onSaved: (family: any) => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminCreateMemberInput>({ resolver: zodResolver(adminCreateMemberSchema) });

  async function onSubmit(data: AdminCreateMemberInput) {
    setServerError(null);
    const result = await adminCreateMember(data);
    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }
    onSaved(result.data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-ink-soft text-sm">Account name</Label>
          <Input id="name" {...register("name")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-ink-soft text-sm">Email</Label>
          <Input id="email" type="email" {...register("email")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-ink-soft text-sm">Temporary password</Label>
        <Input id="password" type="text" {...register("password")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        <p className="text-ink-faint text-xs">Share this with the member so they can log in.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="headOfFamilyName" className="text-ink-soft text-sm">Head of family name</Label>
        <Input id="headOfFamilyName" {...register("headOfFamilyName")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
        {errors.headOfFamilyName && <p className="text-red-500 text-xs">{errors.headOfFamilyName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-ink-soft text-sm">Phone</Label>
          <Input id="phone" {...register("phone")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="memberCount" className="text-ink-soft text-sm">Family members</Label>
          <Input id="memberCount" type="number" min={1} {...register("memberCount")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
          {errors.memberCount && <p className="text-red-500 text-xs">{errors.memberCount.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-ink-soft text-sm">Address</Label>
        <Input id="address" {...register("address")} className="border-sage-200 focus-visible:ring-sage-400 rounded-xl" />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-sage-400 hover:bg-sage-500 rounded-xl mt-2">
        {isSubmitting ? "Creating..." : "Create member"}
      </Button>
    </form>
  );
}