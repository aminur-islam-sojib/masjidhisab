"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth";

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  mosqueId: string | null;
}

interface UseUserResult {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** true once we know the user is logged in but hasn't been assigned a mosque yet */
  needsMosque: boolean;
}

export function useUser(): UseUserResult {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return { user: null, isLoading: true, isAuthenticated: false, needsMosque: false };
  }

  if (status === "unauthenticated" || !session?.user) {
    return { user: null, isLoading: false, isAuthenticated: false, needsMosque: false };
  }

  const user: AuthUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as UserRole,
    mosqueId: session.user.mosqueId ?? null,
  };

  return {
    user,
    isLoading: false,
    isAuthenticated: true,
    needsMosque: !user.mosqueId && user.role !== UserRole.SUPER_ADMIN,
  };
}