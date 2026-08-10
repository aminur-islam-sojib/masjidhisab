// lib/auth/guards.ts
import { auth } from "@/lib/auth/auth";
import { UserRole } from "@/types/auth";
import { Mosque, IMosque } from "@/lib/db/Model/Mosque";
import connectDB from "@/lib/mongoose";
import type { Session } from "next-auth";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// For actions that need role checking but not the mosque document itself
export function requireRole<Args extends unknown[], T>(
  allowedRoles: UserRole[],
  action: (session: Session, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }
    if (!allowedRoles.includes(session.user.role as UserRole)) {
      return { success: false, error: "Not authorized" };
    }

    try {
      const data = await action(session, ...args);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  };
}

// For actions that need role checking AND the mosque document (tenant-scoped)
export function requireTenant<Args extends unknown[], T>(
  allowedRoles: UserRole[],
  action: (ctx: { session: Session; mosque: IMosque }, ...args: Args) => Promise<T>
) {
  return async (...args: Args): Promise<ActionResult<T>> => {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }
    if (!allowedRoles.includes(session.user.role as UserRole)) {
      return { success: false, error: "Not authorized" };
    }
    if (!session.user.mosqueId) {
      return { success: false, error: "No mosque associated with this account" };
    }

    await connectDB();
    const mosque = await Mosque.findById(session.user.mosqueId);
    if (!mosque) {
      return { success: false, error: "Mosque not found" };
    }

    try {
      const data = await action({ session, mosque }, ...args);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  };
}