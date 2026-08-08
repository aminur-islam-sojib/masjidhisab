import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/types/auth";
 

export async function checkRole(requiredRoles: UserRole[]) {
  const session = await auth();
  if (!session?.user) return false;
  return requiredRoles.includes(session.user.role as UserRole);
}

export async function getTenantId() {
  const session = await auth();
  return session?.user?.mosqueId || null;
}