// app/dashboard/settings/_components/general-settings-form.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getMosqueSettingsAction,
  updateMosqueSettingsAction,
} from "@/lib/actions/mosque";
import { uploadImageToImgbbAction } from "@/lib/actions/upload";
import {
  ImagePlus,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface MosqueProfile {
  name?: string;
  imamName?: string;
  capacity?: number;
  establishedYear?: number;
  profileImageUrl?: string;
  coverImageUrl?: string;
  address?: {
    city?: string;
    district?: string;
    area?: string;
    postalCode?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
}

export default function GeneralSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState<MosqueProfile | null>(null);
  const [version, setVersion] = useState(0);

  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"profile" | "cover" | null>(null);

  const loadProfile = () => {
    startTransition(async () => {
      const res = await getMosqueSettingsAction();
      if (res.success) {
        setProfile(res.data);
        setProfileImageUrl(res.data.profileImageUrl || "");
        setCoverImageUrl(res.data.coverImageUrl || "");
        setProfilePreview(res.data.profileImageUrl || null);
        setCoverPreview(res.data.coverImageUrl || null);
      } else {
        setMessage({
          success: false,
          text: res.message || "Failed to load mosque profile.",
        });
      }
      setVersion((v) => v + 1);
    });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ success: false, text: "Please choose an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ success: false, text: "Image must be under 5 MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      if (type === "profile") setProfilePreview(base64);
      else setCoverPreview(base64);

      setUploading(type);
      const res = await uploadImageToImgbbAction(base64);
      setUploading(null);

      if (res.success) {
        if (type === "profile") setProfileImageUrl(res.url || "");
        else setCoverImageUrl(res.url || "");
      } else {
        setMessage({ success: false, text: res.message });
        if (type === "profile") setProfilePreview(profileImageUrl || null);
        else setCoverPreview(coverImageUrl || null);
      }
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

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
      profileImageUrl: profileImageUrl || undefined,
      coverImageUrl: coverImageUrl || undefined,
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
    return <div className="text-sm text-slate-500">Loading mosque profile…</div>;
  }

  return (
    <form key={version} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">
          Mosque Profile Information
        </h2>
        <p className="text-sm text-slate-500">
          Update your official mosque details, branding, and location.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.success
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.success ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Images */}
      <div className="grid grid-cols-1 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Cover Image</p>
          <div className="relative h-40 rounded-xl overflow-hidden bg-white border border-slate-200">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImagePlus size={24} className="mb-1 opacity-50" />
                <span className="text-xs">No cover image yet</span>
              </div>
            )}
            {uploading === "cover" && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 size={22} className="animate-spin text-emerald-600" />
              </div>
            )}
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg cursor-pointer">
            <ImagePlus size={16} />
            Upload cover image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImage(e, "cover")}
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 size={28} className="opacity-50" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              Profile Image
            </p>
            <p className="text-xs text-slate-500 mb-2">
              A square logo or photo of the mosque.
            </p>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg cursor-pointer">
              {uploading === "profile" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ImagePlus size={16} />
              )}
              Upload profile image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e, "profile")}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Profile fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mosque Name
          </label>
          <input
            name="name"
            required
            defaultValue={profile.name ?? ""}
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Imam Name
          </label>
          <input
            name="imamName"
            defaultValue={profile.imamName ?? ""}
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Area / Thana
          </label>
          <input
            name="area"
            defaultValue={profile.address?.area ?? ""}
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Postal Code
          </label>
          <input
            name="postalCode"
            defaultValue={profile.address?.postalCode ?? ""}
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            name="phone"
            defaultValue={profile.contact?.phone ?? ""}
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="w-full h-11 px-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={isPending || uploading !== null}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
