"use client";

import { useState, useTransition } from "react";
import { updateMosqueSettingsAction } from "@/lib/actions/mosque";
 
import { IMosque } from "@/types/mosque";
import { uploadToImgBB } from "@/lib/actions/upload-image";

interface GeneralSettingsFormProps {
  initialData?: IMosque | null;
}

export default function GeneralSettingsForm({ initialData }: GeneralSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  // States to keep track of current URLs or newly uploaded image previews
  const [logoUrl, setLogoUrl] = useState<string>(initialData?.logoUrl || "");
  const [coverUrl, setCoverUrl] = useState<string>(initialData?.coverUrl || "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const logoFile = formData.get("logoFile") as File;
    const coverFile = formData.get("coverFile") as File;

    setIsUploading(true);

    try {
      let finalLogoUrl = logoUrl;
      let finalCoverUrl = coverUrl;

      // 1. Upload Logo if a new file is selected
      if (logoFile && logoFile.size > 0) {
        const uploadedLogo = await uploadToImgBB(logoFile);
        if (uploadedLogo) finalLogoUrl = uploadedLogo;
      }

      // 2. Upload Cover Image if a new file is selected
      if (coverFile && coverFile.size > 0) {
        const uploadedCover = await uploadToImgBB(coverFile);
        if (uploadedCover) finalCoverUrl = uploadedCover;
      }

      setIsUploading(false);

      // 3. Prepare payload with updated image URLs
      const payload = {
        name: formData.get("name") as string,
        logoUrl: finalLogoUrl,
        coverUrl: finalCoverUrl,
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
      // 4. Save to Database
      startTransition(async () => {
        const res = await updateMosqueSettingsAction(payload);
        if (res.success) {
          setLogoUrl(finalLogoUrl);
          setCoverUrl(finalCoverUrl);
        }
        setMessage({ success: res.success, text: res.message });
      });
    } catch (error) {
      setIsUploading(false);
      setMessage({ success: false, text: "Failed to upload images. Try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">
          Mosque Profile Information
        </h2>
        <p className="text-sm text-slate-500">
          Update your official mosque details and upload profile & cover photos.
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.success
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Image File Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile / Logo Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mosque Logo / Profile Image
          </label>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Mosque Logo"
              className="w-20 h-20 object-cover rounded-lg mb-2 border"
            />
          )}
          <input
            name="logoFile"
            type="file"
            accept="image/*"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cover Image
          </label>
          {coverUrl && (
            <img
              src={coverUrl}
              alt="Mosque Cover"
              className="w-full h-20 object-cover rounded-lg mb-2 border"
            />
          )}
          <input
            name="coverFile"
            type="file"
            accept="image/*"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>
      </div>

      {/* General Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mosque Name
          </label>
          <input
            name="name"
            required
            defaultValue={initialData?.name || ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Imam Name
          </label>
          <input
            name="imamName"
            defaultValue={initialData?.imamName || ""}
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
            defaultValue={initialData?.address?.city || ""}
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
            defaultValue={initialData?.address?.district || ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Area / Thana
          </label>
          <input
            name="area"
            defaultValue={initialData?.address?.area || ""}
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
            defaultValue={initialData?.capacity || ""}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isUploading
            ? "Uploading Images..."
            : isPending
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}