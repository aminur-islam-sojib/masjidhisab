// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getMyMosque } from "@/features/Mosque/queries";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@/lib/auth/auth";
import { getPendingRequestsCount } from "@/features/family/queries";
import { getNavItemsForRole } from "@/lib/utils/dashboard-navigation";
import { UserRole } from "@/types/auth";

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
  const pendingRequestsCount = session?.user?.mosqueId
    ? await getPendingRequestsCount(session.user.mosqueId)
    : 0;
// app/(dashboard)/dashboard/layout.tsx — pass filtered items to AppSidebar
const items = getNavItemsForRole(session.user.role as UserRole) ;
  return (
    <DashboardShell
      mosqueName={mosque?.name || "My Mosque"}
      mosqueAddress={addressString}
      userName={session.user.name || "Admin"}
      userEmail={session.user.email || ""}
      pendingRequestsCount={pendingRequestsCount || 0}
      navigationItems={items}
    >
      {children}
    </DashboardShell>
  );
}
