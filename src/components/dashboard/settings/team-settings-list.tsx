// app/dashboard/settings/_components/team-settings-list.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getMosqueTeamAction,
  updateMemberRoleAction,
} from "@/lib/actions/settings-team";
import { UserRole } from "@/types/auth";
import { Users, Shield, CheckCircle2, AlertCircle } from "lucide-react";

export default function TeamSettingsList() {
  const [isPending, startTransition] = useTransition();
  const [members, setMembers] = useState<any[]>([]);
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const fetchTeam = () => {
    startTransition(async () => {
      const res = await getMosqueTeamAction();
      if (res.success && res.data) {
        setMembers(res.data);
      } else {
        setMessage({
          success: false,
          text: res.message || "Failed to load team.",
        });
      }
    });
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updateMemberRoleAction(userId, newRole);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        fetchTeam();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-slate-900">
            Committee & Team Management
          </h2>
          <p className="text-sm text-slate-500">
            Manage administrative roles and permissions for your mosque staff.
          </p>
        </div>
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

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isPending && members.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  Loading team members...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <Users size={32} className="mx-auto mb-2 opacity-40" />
                  <p>No team members found in this workspace.</p>
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {member.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span>{member.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {member.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        member.role === UserRole.MOSQUE_ADMIN
                          ? "bg-purple-50 text-purple-700"
                          : member.role === UserRole.STAFF
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Shield size={12} />
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      disabled={isPending}
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value as UserRole)
                      }
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={UserRole.MOSQUE_ADMIN}>
                        Mosque Admin
                      </option>
                      <option value={UserRole.STAFF}>Staff</option>
                      <option value={UserRole.MEMBER}>Member</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
