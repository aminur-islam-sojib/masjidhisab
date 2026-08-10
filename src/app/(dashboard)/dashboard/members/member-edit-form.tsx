// app/(dashboard)/dashboard/members/member-edit-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinMosqueSchema, JoinMosqueInput } from "@/lib/validations/family";
import { updateFamily } from "@/features/family/actions";

interface FamilyMember extends JoinMosqueInput {
  _id: string;
}

export default function MemberEditForm({
  family,
  onSaved,
}: {
  family: FamilyMember;
  onSaved: (updated: any) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinMosqueInput>({
    resolver: zodResolver(joinMosqueSchema),
    defaultValues: {
      headOfFamilyName: family.headOfFamilyName,
      phone: family.phone,
      address: family.address,
      memberCount: family.memberCount,
    },
  });

  async function onSubmit(data: JoinMosqueInput) {
    setServerError(null);
    const result = await updateFamily(family._id, data);

    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }

    onSaved(result.data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label htmlFor="headOfFamilyName" className="text-ink-soft text-sm">
          Head of family name
        </Label>
        <Input
          id="headOfFamilyName"
          {...register("headOfFamilyName")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
        />
        {errors.headOfFamilyName && (
          <p className="text-red-500 text-xs">{errors.headOfFamilyName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-ink-soft text-sm">Phone</Label>
        <Input
          id="phone"
          {...register("phone")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
        />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-ink-soft text-sm">Address</Label>
        <Input
          id="address"
          {...register("address")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
        />
        {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="memberCount" className="text-ink-soft text-sm">
          Number of family members
        </Label>
        <Input
          id="memberCount"
          type="number"
          min={1}
          {...register("memberCount")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
        />
        {errors.memberCount && (
          <p className="text-red-500 text-xs">{errors.memberCount.message}</p>
        )}
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sage-400 hover:bg-sage-500 rounded-xl mt-2"
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}