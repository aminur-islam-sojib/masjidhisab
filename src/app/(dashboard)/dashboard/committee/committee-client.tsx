// app/(dashboard)/dashboard/members/committee-client.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { DESIGNATION_LABEL, DESIGNATION_ORDER } from "@/lib/constants/committee";
import CommitteeForm from "./committee-form";
import { deleteCommitteeMember } from "@/features/committee/actions";

interface CommitteeMember {
  _id: string;
  name: string;
  designation: string;
  photoUrl?: string;
  phone?: string;
  bio?: string;
  isPublic: boolean;
  displayOrder: number;
}

export default function CommitteeClient({
  initialCommittee,
}: {
  initialCommittee: CommitteeMember[];
}) {
  const [committee, setCommittee] = useState(initialCommittee);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sorted = [...committee].sort(
    (a, b) => (DESIGNATION_ORDER[a.designation] ?? 99) - (DESIGNATION_ORDER[b.designation] ?? 99)
  );

  function openAddDialog() {
    setEditingMember(null);
    setDialogOpen(true);
  }

  function openEditDialog(member: CommitteeMember) {
    setEditingMember(member);
    setDialogOpen(true);
  }

  function handleSaved(saved: CommitteeMember, isNew: boolean) {
    setCommittee((prev) =>
      isNew ? [...prev, saved] : prev.map((m) => (m._id === saved._id ? saved : m))
    );
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this committee member? This can't be undone.")) return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteCommitteeMember(id);
      if (result.success) {
        setCommittee((prev) => prev.filter((m) => m._id !== id));
      }
      setDeletingId(null);
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openAddDialog} className="bg-sage-400 hover:bg-sage-500 rounded-xl">
          <Plus className="h-4 w-4 mr-1.5" /> Add committee member
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-ink-faint bg-white rounded-2xl border border-sage-200">
          No committee members added yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-sage-200 divide-y divide-sage-100">
          {sorted.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="h-4 w-4 text-ink-faint shrink-0" />
                <div className="w-10 h-10 rounded-full bg-sage-100 overflow-hidden relative shrink-0">
                  {member.photoUrl && (
                    <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-ink font-medium text-sm truncate">{member.name}</p>
                  <p className="text-ink-faint text-xs">
                    {DESIGNATION_LABEL[member.designation] ?? member.designation}
                    {!member.isPublic && " · Hidden from public page"}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditDialog(member)}
                  className="text-ink-soft hover:bg-sage-100 rounded-lg"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isPending && deletingId === member._id}
                  onClick={() => handleDelete(member._id)}
                  className="text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-ink">
              {editingMember ? "Edit committee member" : "Add committee member"}
            </DialogTitle>
          </DialogHeader>
          <CommitteeForm
            existingMember={editingMember}
            onSaved={handleSaved}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}