// app/(dashboard)/dashboard/members/committee-form.tsx
"use client";
// app/(dashboard)/dashboard/members/committee-form.tsx
import { committeeMemberSchema, CommitteeMemberInput, DESIGNATIONS } from "@/lib/validations/committee";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
 
import { DESIGNATION_LABEL } from "@/lib/constants/committee";
import { createCommitteeMember, updateCommitteeMember } from "@/features/committee/actions";
 

interface ExistingMember extends CommitteeMemberInput {
  _id: string;
}

export default function CommitteeForm({
  existingMember,
  onSaved,
}: {
  existingMember: ExistingMember | null;
  onSaved: (member: any, isNew: boolean) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommitteeMemberInput>({
    resolver: zodResolver(committeeMemberSchema),
    defaultValues: existingMember ?? {
      designation: "MEMBER",
      isPublic: true,
      displayOrder: 0,
    },
  });

  const isPublic = watch("isPublic");
  const designation = watch("designation");

  async function onSubmit(data: CommitteeMemberInput) {
    setServerError(null);

    const result = existingMember
      ? await updateCommitteeMember(existingMember._id, data)
      : await createCommitteeMember(data);

    if (!result.success) {
      setServerError(result.error ?? "Something went wrong");
      return;
    }

    onSaved(result.data, !existingMember);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-ink-soft text-sm">Name</Label>
        <Input
          id="name"
          {...register("name")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          placeholder="Full name"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-ink-soft text-sm">Designation</Label>
        <Select value={designation} onValueChange={(val) => setValue("designation", val as any)}>
          <SelectTrigger className="border-sage-200 focus:ring-sage-400 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DESIGNATIONS.map((d) => (
              <SelectItem key={d} value={d}>
                {DESIGNATION_LABEL[d]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-ink-soft text-sm">Phone (optional)</Label>
        <Input
          id="phone"
          {...register("phone")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="photoUrl" className="text-ink-soft text-sm">Photo URL (optional)</Label>
        <Input
          id="photoUrl"
          {...register("photoUrl")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          placeholder="https://..."
        />
        {errors.photoUrl && <p className="text-red-500 text-xs">{errors.photoUrl.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-ink-soft text-sm">Short bio (optional)</Label>
        <Textarea
          id="bio"
          {...register("bio")}
          className="border-sage-200 focus-visible:ring-sage-400 rounded-xl resize-none"
          rows={3}
          maxLength={500}
        />
        {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
      </div>

      <div className="flex items-center justify-between py-1">
        <div>
          <Label htmlFor="isPublic" className="text-ink-soft text-sm">Show on public page</Label>
          <p className="text-ink-faint text-xs">Visible to visitors on your mosque profile</p>
        </div>
        <Switch
          id="isPublic"
          checked={isPublic}
          onCheckedChange={(val) => setValue("isPublic", val)}
        />
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sage-400 hover:bg-sage-500 rounded-xl mt-2"
      >
        {isSubmitting ? "Saving..." : existingMember ? "Save changes" : "Add member"}
      </Button>
    </form>
  );
}