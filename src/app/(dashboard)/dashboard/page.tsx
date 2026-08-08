// app/dashboard/page.tsx
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Grab the session directly from Auth.js v5
  const session = await auth();

  // 1. Kick them to login if they aren't authenticated at all
  if (!session) {
    redirect("/login");
  }

  // 2. Kick them to create-mosque if they don't have a mosqueId
  if (!session.user.mosqueId) {
    redirect("/create-mosque");
  }

  // 3. If they pass both checks, load the dashboard!
  return (
    <div>
      <div>Dashboard Welcome back, {session.user.name}</div>
      <div>Your Mosque ID is: {session.user.mosqueId}</div>
    </div>
  );
}
