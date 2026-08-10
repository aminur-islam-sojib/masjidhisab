// app/(dashboard)/dashboard/members/[familyId]/member-detail-client.tsx
"use client";

import MemberEditForm from "../member-edit-form"; // reuse the existing edit form

export default function MemberDetailClient({ family }: { family: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-sage-200 p-6">
        <h2 className="font-heading text-lg text-ink mb-4">Member Details</h2>
        <MemberEditForm family={family} onSaved={() => {}} />
      </div>

      {/* Placeholder for future donation/dues history — this is the natural
          home for that once the Donation model exists */}
      <div className="bg-white rounded-2xl border border-sage-200 p-6">
        <h2 className="font-heading text-lg text-ink mb-2">Donations & Dues</h2>
        <p className="text-ink-faint text-sm">Coming soon — will show donation history and dues here.</p>
      </div>
    </div>
  );
}