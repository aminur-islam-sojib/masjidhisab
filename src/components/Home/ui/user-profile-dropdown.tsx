// src/components/UserProfileDropdown.tsx
"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertTriangle, HelpCircle, Loader2, LogOut, Settings, User } from "lucide-react";

import { useUser } from "@/hooks/use-user";
import { UserRole } from "@/types/auth";

/* -------------------------------------------------------------------------- */
/*  Dropdown primitives                                                       */
/* -------------------------------------------------------------------------- */

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLabel: string;
}

const DropdownMenu = ({ children, trigger, open, onOpenChange, triggerLabel }: DropdownMenuProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on outside click / Escape, restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  // Focus the first item when the menu opens; support arrow-key navigation.
  useEffect(() => {
    if (!open || !menuRef.current) return;

    const items = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);

    items()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusable = items();
      if (focusable.length === 0) return;
      const currentIndex = focusable.indexOf(document.activeElement as HTMLButtonElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusable[(currentIndex + 1) % focusable.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        focusable[(currentIndex - 1 + focusable.length) % focusable.length]?.focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        focusable[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        focusable[focusable.length - 1]?.focus();
      }
    };

    const node = menuRef.current;
    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenChange(true);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={triggerLabel}
        className="w-full text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={menuId}
          ref={menuRef}
          // Opens UPWARD (bottom-full) and left-aligned — correct for a sidebar footer trigger.
          className="absolute bottom-full left-0 mb-2 w-72 rounded-xl shadow-xl bg-white dark:bg-zinc-900 ring-1 ring-sage-200 ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 p-2"
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

const DropdownMenuItem = ({ children, onClick, disabled, destructive }: DropdownMenuItemProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left group flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 ${
      destructive
        ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    }`}
    role="menuitem"
  >
    {children}
  </button>
);

const DropdownMenuSeparator = () => <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />;

/* -------------------------------------------------------------------------- */
/*  Avatar                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name?: string | null, email?: string | null) {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/);
    const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
    if (initials) return initials.toUpperCase();
  }
  return email?.trim()?.[0]?.toUpperCase() ?? "?";
}

function Avatar({
  image,
  name,
  email,
  size = "w-8 h-8 text-sm",
}: {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  size?: string;
}) {
  // If the remote avatar 404s or the host blocks hotlinking, fall back to initials
  // instead of leaving a broken-image icon in the UI.
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={`${size} rounded-full object-cover shrink-0`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`${size} bg-sage-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {getInitials(name, email)}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Accessible confirmation dialog                                           */
/* -------------------------------------------------------------------------- */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  warning?: string;
  confirmLabel: string;
  pendingLabel: string;
  cancelLabel: string;
  loading: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  title,
  description,
  warning,
  confirmLabel,
  pendingLabel,
  cancelLabel,
  loading,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Avoid SSR/portal hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Lock background scroll, remember + restore focus, and focus a safe default
  // (Cancel, not the destructive action) when the dialog opens.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(focusTimer);
      previouslyFocused.current?.focus();
    };
  }, [open]);

  // Escape to close + a simple focus trap while open.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (loading) return; // don't let the user dismiss mid-request

      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in-0 duration-150"
        onClick={() => !loading && onCancel()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-black/5 p-5 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150"
      >
        <div className="flex items-start space-x-3">
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
            <AlertTriangle className="h-5 w-5 text-orange-500" aria-hidden="true" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 id={titleId} className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <p id={descriptionId} className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
        </div>

        {warning && (
          <div className="mt-4 rounded-md border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-3">
            <p className="text-sm text-orange-700 dark:text-orange-300">{warning}</p>
          </div>
        )}

        {error && (
          <div role="alert" className="mt-4 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="mt-5 flex justify-end space-x-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-2 text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function UserProfileDropdown() {
  const { user, isLoading, isAuthenticated } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const router = useRouter();

  const closeMenuThen = (fn: () => void) => {
    setMenuOpen(false);
    fn();
  };

  const requestSignOut = () => {
    setSignOutError(null);
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const cancelSignOut = useCallback(() => {
    if (signingOut) return; // ignore dismiss attempts mid-request
    setConfirmOpen(false);
    setSignOutError(null);
  }, [signingOut]);

  const confirmSignOut = useCallback(async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      // redirect: true (default) sends the browser to /login after the session is cleared.
      await signOut({ callbackUrl: "/login" });
      // On success the browser navigates away; no further state updates needed.
    } catch {
      setSigningOut(false);
      setSignOutError("We couldn't sign you out. Check your connection and try again.");
    }
  }, []);

  // --- Loading state: skeleton, same footprint as the real trigger ---
  if (isLoading) {
    return (
      <div className="w-full flex items-center space-x-3 p-2 rounded-lg animate-pulse" aria-hidden="true">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2.5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  // --- Not signed in: shouldn't normally render inside an authenticated sidebar,
  // but guard anyway rather than crash on `user` being null.
  if (!isAuthenticated || !user) {
    return null;
  }

  const displayName = user.name ?? "Unnamed User";
  const canManageMosque = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MOSQUE_ADMIN;

  return (
    <>
      <DropdownMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        triggerLabel={`Account menu for ${displayName}`}
        trigger={
          <div className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <Avatar image={user.image} name={user.name} email={user.email} />
            <div className="text-left min-w-0 flex-1">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{displayName}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</div>
            </div>
          </div>
        }
      >
        <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center space-x-3">
            <Avatar image={user.image} name={user.name} email={user.email} size="w-10 h-10 text-base" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{displayName}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{user.role}</div>
            </div>
          </div>
        </div>

        <div className="py-1">
          <DropdownMenuItem onClick={() => closeMenuThen(() => router.push("/profile"))}>
            <User className="mr-3 h-4 w-4 text-zinc-500" aria-hidden="true" />
            Your Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => closeMenuThen(() => router.push("/settings"))}>
            <Settings className="mr-3 h-4 w-4 text-zinc-500" aria-hidden="true" />
            Settings
          </DropdownMenuItem>
          {canManageMosque && (
            <DropdownMenuItem onClick={() => closeMenuThen(() => router.push("/mosque/settings"))}>
              <Settings className="mr-3 h-4 w-4 text-zinc-500" aria-hidden="true" />
              Mosque Settings
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="py-1">
          <DropdownMenuItem onClick={() => closeMenuThen(() => router.push("/help"))}>
            <HelpCircle className="mr-3 h-4 w-4 text-zinc-500" aria-hidden="true" />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={requestSignOut} destructive>
            <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
            Sign Out
          </DropdownMenuItem>
        </div>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out of your account?"
        description="You'll need to sign in again to access your account."
        warning="Any unsaved changes will be lost. Make sure to save your work before signing out."
        confirmLabel="Sign out"
        pendingLabel="Signing out…"
        cancelLabel="Stay signed in"
        loading={signingOut}
        error={signOutError}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
      />
    </>
  );
}