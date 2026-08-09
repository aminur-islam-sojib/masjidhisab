import { requireAuth } from "@/lib/auth/rbac";
import SettingsPage from "@/components/dashboard/settings/SettingsPage";
import { getMosqueDetails } from "@/lib/queries/mosque";

export default async function page() {
const { mosqueId } = await requireAuth();
 
const mosqueData = await getMosqueDetails(mosqueId);
 
  return (
    <div>
      <SettingsPage mosqueData={mosqueData}  />
    </div>
  )
}
