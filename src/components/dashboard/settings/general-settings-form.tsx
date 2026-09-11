// app/dashboard/settings/_components/general-settings-form.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getMosqueSettingsAction,
  updateMosqueSettingsAction,
} from "@/lib/actions/mosque";

export default function GeneralSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [version, setVersion] = useState(0);

  const loadProfile = async () => {
    const res = await getMosqueSettingsAction();
    if (res.success) {
      setProfile(res.data);
    } else {
      setMessage({
        success: false,
        text: res.message || "Failed to load mosque profile.",
      });
    }
    setVersion((v) => v + 1);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Empty form fields come through as null from FormData, but the Zod schema
    // expects optional strings to be `undefined` (or "" for email), not `null`.
    const optionalString = (value: FormDataEntryValue | null) =>
      value === null || value === "" ? undefined : String(value);

    const payload = {
      name: (formData.get("name") as string) ?? "",
      address: {
        city: (formData.get("city") as string) ?? "",
        district: (formData.get("district") as string) ?? "",
        area: optionalString(formData.get("area")),
        postalCode: optionalString(formData.get("postalCode")),
      },
      contact: {
        phone: optionalString(formData.get("phone")),
        email: optionalString(formData.get("email")),
      },
      establishedYear: Number(formData.get("establishedYear")) || undefined,
      imamName: optionalString(formData.get("imamName")),
      capacity: Number(formData.get("capacity")) || undefined,
    };

    startTransition(async () => {
      const res = await updateMosqueSettingsAction(payload);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        await loadProfile();
      }
    });
  }

  if (!profile) {
    return (
      <div className="text-sm text-slate-500">Loading mosque profile…</div>
    );
  }

  return (
    <form key={version} onSubmit={handleSubmit} className="space-y-6">
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
            defaultValue={profile.name ?? ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Imam Name
          </label>
          <input
            name="imamName"
            defaultValue={profile.imamName ?? ""}
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
            defaultValue={profile.address?.city ?? ""}
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
            defaultValue={profile.address?.district ?? ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Area / Thana
          </label>
          <input
            name="area"
            defaultValue={profile.address?.area ?? ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Postal Code
          </label>
          <input
            name="postalCode"
            defaultValue={profile.address?.postalCode ?? ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            name="phone"
            defaultValue={profile.contact?.phone ?? ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={profile.contact?.email ?? ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Established Year
          </label>
          <input
            name="establishedYear"
            type="number"
            defaultValue={profile.establishedYear ?? ""}
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
            defaultValue={profile.capacity ?? ""}
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
