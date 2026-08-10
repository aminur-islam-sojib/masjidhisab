// app/(dashboard)/dashboard/members/members-client.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Phone, MapPin, Users, Plus } from "lucide-react";
import { toggleFamilyActive } from "@/features/family/actions";
import MemberEditForm from "./member-edit-form";
import AdminCreateMemberForm from "./admin-create-member-form";
import Link from "next/link";

interface FamilyMember {
  _id: string;
  headOfFamilyName: string;
  phone: string;
  address: string;
  memberCount: number;
  isActive: boolean;
  userId: { name: string; email: string } | null;
}

export default function MembersClient({
  initialFamilies,
}: {
  initialFamilies: FamilyMember[];
}) {
  const [families, setFamilies] = useState(initialFamilies);
  const [editingFamily, setEditingFamily] = useState<FamilyMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function handleSaved(updated: FamilyMember) {
    setFamilies((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
    setDialogOpen(false);
  }

  function handleToggleActive(familyId: string, currentValue: boolean) {
    setTogglingId(familyId);
    startTransition(async () => {
      const result = await toggleFamilyActive(familyId, !currentValue);
      if (result.success) {
        setFamilies((prev) =>
          prev.map((f) => (f._id === familyId ? { ...f, isActive: !currentValue } : f))
        );
      }
      setTogglingId(null);
    });
  }

  if (families.length === 0) {
    return (
      <div className="text-center py-16 text-ink-faint bg-white rounded-2xl border border-sage-200">
        No approved members yet.
      </div>
    );
  }

 

// inside the component, add:
const [addDialogOpen, setAddDialogOpen] = useState(false);

function handleCreated(newFamily: FamilyMember) {
  setFamilies((prev) => [...prev, newFamily]);
  setAddDialogOpen(false);
}


  return (
    <div>
        <div className="flex justify-end mb-4">
  <Button onClick={() => setAddDialogOpen(true)} className="bg-sage-400 hover:bg-sage-500 rounded-xl">
    <Plus className="h-4 w-4 mr-1.5" /> Add member
  </Button>
</div>

<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
  <DialogContent className="bg-white rounded-2xl sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="font-heading text-ink">Add member</DialogTitle>
    </DialogHeader>
    <AdminCreateMemberForm onSaved={handleCreated} />
  </DialogContent>
</Dialog>
      <div className="bg-white rounded-2xl border border-sage-200 divide-y divide-sage-100">
        {families.map((family) => (
       <Link href={`/dashboard/members/${family._id}`} className="min-w-0 flex-1"> 
   <div key={family._id} className="flex items-center justify-between p-4 gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-ink font-medium text-sm">{family.headOfFamilyName}</p>
              <div className="flex items-center gap-3 text-ink-soft text-xs mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {family.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {family.address}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {family.memberCount} members
                </span>
              </div>
              {family.userId?.email && (
                <p className="text-ink-faint text-xs mt-0.5">{family.userId.email}</p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-faint">
                  {family.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={family.isActive}
                  disabled={isPending && togglingId === family._id}
                  onCheckedChange={() => handleToggleActive(family._id, family.isActive)}
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingFamily(family);
                  setDialogOpen(true);
                }}
                className="text-ink-soft hover:bg-sage-100 rounded-lg"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>


 </Link>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-ink">Edit member</DialogTitle>
          </DialogHeader>
          {editingFamily && (
            <MemberEditForm family={editingFamily} onSaved={handleSaved} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}