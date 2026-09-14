"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { MembersList } from "@/app/(dashboard)/dashboard/members/members-list";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AddMemberForm } from "./add-member-form";

export default function MembersPage() {
  const [showAdd, setShowAdd] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Committee & Members
          </h1>
          <p className="text-sm text-slate-500">
            Manage mosque members and their family registers.
          </p>
        </div>

        <Button
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
        >
          <Users size={16} />
          Add Member
        </Button>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <AddMemberForm
          onSuccess={() => {
            setShowAdd(false);
            setRefreshKey((k) => k + 1);
          }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      <MembersList refreshKey={refreshKey} />
    </div>
  );
}
