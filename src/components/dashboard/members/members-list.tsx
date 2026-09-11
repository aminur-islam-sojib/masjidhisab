"use client";

import * as React from "react";
import { Users, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { getMembersAction } from "@/lib/actions/members";
import { UserRole } from "@/types/auth";
import { FamilyMember, Member } from "@/types/member";
import { EditMemberForm } from "./edit-member-form";
import { Modal } from "@/components/ui/modal";

interface MembersListProps {
  refreshKey?: number;
}

const roleBadgeClass = (role: string) => {
  switch (role) {
    case UserRole.MOSQUE_ADMIN:
      return "bg-purple-50 text-purple-700";
    case UserRole.COMMITTEE_MEMBER:
      return "bg-amber-50 text-amber-700";
    case UserRole.STAFF:
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${roleBadgeClass(role)}`}
    >
      {role}
    </span>
  );
}

function FamilyDetails({ family }: { family: FamilyMember[] }) {
  if (!family?.length) {
    return (
      <p className="text-sm text-slate-400">
        No family members recorded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {family.map((f, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-900">{f.name}</span>
            <span className="text-xs text-slate-500">{f.relation}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {f.phone && <span>{f.phone}</span>}
            {f.ageOrDob && <span>{f.ageOrDob}</span>}
            {f.gender && <span>{f.gender}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MembersList({ refreshKey = 0 }: MembersListProps) {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [editingMember, setEditingMember] = React.useState<Member | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    let active = true;

    startTransition(async () => {
      const res = await getMembersAction();
      if (!active) return;

      if (res.success) {
        setMembers(res.data ?? []);
      } else {
        setError(res.message || "Failed to load members.");
      }
    });

    return () => {
      active = false;
    };
  }, [refreshKey, reloadKey]);

  if (isPending && members.length === 0) {
    return <div className="text-sm text-slate-500">Loading members…</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400">
        <Users size={32} className="mx-auto mb-2 opacity-40" />
        <p>No members added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Modal open={!!editingMember} onClose={() => setEditingMember(null)}>
        {editingMember && (
          <EditMemberForm
            member={editingMember}
            onCancel={() => setEditingMember(null)}
            onSuccess={() => {
              setEditingMember(null);
              setReloadKey((k) => k + 1);
            }}
          />
        )}
      </Modal>

      {/* Mobile / tablet card list */}
      <div className="space-y-3 md:hidden">
        {members.map((member) => {
          const isExpanded = expandedId === member.id;
          const household =
            member.familyCount ?? (member.family?.length ?? 0) + 1;

          return (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {member.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>
                <RoleBadge role={member.role} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-slate-600">{member.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Household</p>
                  <p className="text-slate-600">{household}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : member.id)
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  {isExpanded ? (
                    <>
                      Hide family <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      View family <ChevronDown size={14} />
                    </>
                  )}
                </button>
                {(member.role === UserRole.MEMBER ||
                  member.role === UserRole.COMMITTEE_MEMBER) && (
                  <button
                    onClick={() => setEditingMember(member)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Family Members
                  </p>
                  <FamilyDetails family={member.family} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Household</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {members.map((member) => {
                const isExpanded = expandedId === member.id;
                const household =
                  member.familyCount ?? (member.family?.length ?? 0) + 1;

                return (
                  <React.Fragment key={member.id}>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {member.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <RoleBadge role={member.role} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {member.phone || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {household}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : member.id)
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            {isExpanded ? (
                              <>
                                Hide <ChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                View <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                          {(member.role === UserRole.MEMBER ||
                            member.role === UserRole.COMMITTEE_MEMBER) && (
                            <button
                              onClick={() => setEditingMember(member)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={5} className="py-4 px-4">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Family Members
                            </p>
                            <FamilyDetails family={member.family} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
