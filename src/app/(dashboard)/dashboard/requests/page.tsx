// app/(dashboard)/dashboard/requests/page.tsx
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getPendingJoinRequests } from "@/features/family/queries";
import RequestsClient from "./requests-client";

export default async function RequestsPage() {
  const session = await auth();
  if (!session?.user?.mosqueId) redirect("/dashboard");

  const requests = await getPendingJoinRequests(session.user.mosqueId);

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl text-ink mb-6">Pending Join Requests</h1>
      <RequestsClient requests={JSON.parse(JSON.stringify(requests))} />
    </div>
  );
}