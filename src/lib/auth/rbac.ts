// lib/auth/rbac.ts

import { UserRole } from "@/types/auth"; // Your exact enum file
import { auth } from "./auth";

export interface AuthContext {
  userId: string;
  mosqueId: string;
  role: UserRole;
  userEmail: string;
}

// Permission map tailored to your new roles
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ["manage_everything"], // Platform owner
  [UserRole.MOSQUE_ADMIN]: [
    "manage_settings",
    "manage_members",
    "manage_finance",
    "manage_prayers",
    "manage_notices",
  ], // Full access to their mosque
  [UserRole.STAFF]: ["manage_finance", "manage_prayers", "manage_notices"], // Daily operations (Treasurer / Imam role tasks)
  [UserRole.MEMBER]: ["view_reports"], // View-only access
};

/**
 * Secures a Server Action. Checks session, tenant, and role permissions.
 * @param requiredPermission The specific action permission needed (optional)
 * @returns AuthContext containing userId and mosqueId
 */
export async function requireAuth(
  requiredPermission?: string,
): Promise<AuthContext> {
  const session = await auth();

  // 1. Check if user is logged in
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED: Please log in.");
  }

  // 2. Check if user is attached to a Mosque (unless Super Admin)
  const role = session.user.role as UserRole;

  if (!session.user.mosqueId && role !== UserRole.SUPER_ADMIN) {
    throw new Error("UNAUTHORIZED: No active mosque workspace found.");
  }

  // 3. Check role permissions (if a specific permission is requested)
  if (requiredPermission && role !== UserRole.SUPER_ADMIN) {
    const allowedPermissions = ROLE_PERMISSIONS[role] || [];

    if (!allowedPermissions.includes(requiredPermission)) {
      throw new Error(
        `FORBIDDEN: Your role (${role}) does not have permission to ${requiredPermission}.`,
      );
    }
  }

  return {
    userId: session.user.id,
    mosqueId: session.user.mosqueId || "",
    role,
    userEmail: session.user.email || "",
  };
}
