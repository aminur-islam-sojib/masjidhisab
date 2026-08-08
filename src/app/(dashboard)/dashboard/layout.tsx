// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getMyMosque } from "@/features/Mosque/queries";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@/lib/auth/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.mosqueId) {
    redirect("/create-mosque");
  }

  const mosque = await getMyMosque();
  const addressString = mosque?.address
    ? `${mosque.address.city}, ${mosque.address.district}`
    : undefined;

  return (
    <DashboardShell
      mosqueName={mosque?.name || "My Mosque"}
      mosqueAddress={addressString}
      userName={session.user.name || "Admin"}
      userEmail={session.user.email || ""}
    >
      {children}
    </DashboardShell>
  );
}
