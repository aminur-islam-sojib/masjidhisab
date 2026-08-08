// app/dashboard/settings/_components/general-settings-form.tsx
"use client";

import { useState, useTransition } from "react";
import { updateMosqueSettingsAction } from "@/lib/actions/mosque";

export default function GeneralSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      address: {
        city: formData.get("city") as string,
        district: formData.get("district") as string,
        area: formData.get("area") as string,
        postalCode: formData.get("postalCode") as string,
      },
      contact: {
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
      },
      establishedYear: Number(formData.get("establishedYear")) || undefined,
      imamName: formData.get("imamName") as string,
      capacity: Number(formData.get("capacity")) || undefined,
    };

    startTransition(async () => {
      const res = await updateMosqueSettingsAction(payload);
      setMessage({ success: res.success, text: res.message });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">
          Mosque Profile Information
        </h2>
        <p className="text-sm text-slate-500">
          Update your official mosque details and location.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${message.success ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mosque Name
          </label>
          <input
            name="name"
            required
            defaultValue="Central Jamia Mosque"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Imam Name
          </label>
          <input
            name="imamName"
            defaultValue="Maulana Ahmed"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            City
          </label>
          <input
            name="city"
            required
            defaultValue="Dhaka"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            District
          </label>
          <input
            name="district"
            required
            defaultValue="Dhaka"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Area / Thana
          </label>
          <input
            name="area"
            defaultValue="Bashundhara R/A"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Capacity (Musallis)
          </label>
          <input
            name="capacity"
            type="number"
            defaultValue="1200"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
