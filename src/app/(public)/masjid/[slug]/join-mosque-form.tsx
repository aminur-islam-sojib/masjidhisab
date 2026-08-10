// app/(public)/masjid/[slug]/join-mosque-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { JoinMosqueInput, joinMosqueSchema } from "@/lib/validations/family";
import { requestToJoinAction } from "@/features/family/actions";

export default function JoinMosqueForm({
  mosqueSlug,
  onSuccess,
}: {
  mosqueSlug: string;
  onSuccess: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinMosqueInput>({
    resolver: zodResolver(joinMosqueSchema),
  });

  async function onSubmit(data: JoinMosqueInput) {
    setServerError(null);
    const result = await requestToJoinAction(mosqueSlug, data);

    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }

    setSubmitted(true);
    setTimeout(onSuccess, 1800);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-3">
        <CheckCircle2 className="h-12 w-12 text-sage-500" />
        <p className="font-heading text-lg text-ink">Request sent</p>
        <p className="text-ink-soft text-sm">
          The mosque admin will review your request. You&apos;ll get access once
          approved.
        </p>
      </div>
    );
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
          placeholder="e.g. Abdul Karim"
        />
        {errors.headOfFamilyName && (
          <p className="text-red-500 text-xs">
            {errors.headOfFamilyName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-ink-soft text-sm">
          Phone number
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          placeholder="01XXXXXXXXX"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-ink-soft text-sm">
          Address
        </Label>
        <Input
          id="address"
          {...register("address")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          placeholder="House, road, area"
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address.message}</p>
        )}
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
        {isSubmitting ? "Submitting..." : "Request to join"}
      </Button>
    </form>
  );
}
