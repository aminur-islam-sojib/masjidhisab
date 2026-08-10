// app/(dashboard)/dashboard/members/page.tsx
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getCommitteeForDashboard } from "@/features/committee/queries";
import CommitteeClient from "./committee-client";

export default async function MembersPage() {
// app/(dashboard)/dashboard/members/page.tsx
const session = await auth();
if (!session?.user?.mosqueId) redirect("/dashboard");
const committee = await getCommitteeForDashboard(session.user.mosqueId);
console.log(committee)
  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl text-ink mb-1">Committee</h1>
      <p className="text-ink-soft text-sm mb-6">
        Manage your mosque&apos;s committee members shown on your public page.
      </p>
      <CommitteeClient initialCommittee={JSON.parse(JSON.stringify(committee))} />
    </div>
  );
}