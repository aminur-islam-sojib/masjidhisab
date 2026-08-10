// app/(dashboard)/dashboard/members/page.tsx
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getApprovedFamilies } from "@/features/family/queries";
import MembersClient from "./members-client";

export default async function MembersPage() {
  const session = await auth();
  if (!session?.user?.mosqueId) redirect("/dashboard");

  const families = await getApprovedFamilies(session.user.mosqueId);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl text-ink mb-1">Members</h1>
      <p className="text-ink-soft text-sm mb-6">
        Manage families registered under your mosque.
      </p>
      <MembersClient initialFamilies={JSON.parse(JSON.stringify(families))} />
    </div>
  );
}