export interface AppSidebarProps {
  mosqueName?: string;
  userName?: string;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
}
// types/dashboard.ts (extend existing)
export interface AppSidebarProps {
  mosqueName?: string;
  userName?: string;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  pendingRequestsCount?: number; // add this
}