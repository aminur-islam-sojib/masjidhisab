// app/(dashboard)/dashboard/members/[familyId]/page.tsx
import { auth } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { getFamilyById } from "@/features/family/queries";
import MemberDetailClient from "./member-detail-client";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.mosqueId) redirect("/dashboard");

  const { familyId } = await params;
  const family = await getFamilyById(session.user.mosqueId, familyId);
  if (!family) notFound();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-heading text-2xl text-ink mb-6">{family.headOfFamilyName}</h1>
      <MemberDetailClient family={JSON.parse(JSON.stringify(family))} />
    </div>
  );
}