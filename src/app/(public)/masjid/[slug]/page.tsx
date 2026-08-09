// app/(public)/masjid/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublicCommittee } from "@/features/committee/queries";
import {
  DESIGNATION_LABEL,
  DESIGNATION_ORDER,
} from "@/lib/constants/committee";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Users, Calendar } from "lucide-react";
import { getPublicMosqueBySlug } from "@/features/Mosque/queries";
import JoinMosqueButton from "./join-mosque-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mosque = await getPublicMosqueBySlug(slug);
  if (!mosque) return { title: "Mosque not found" };

  return {
    title: `${mosque.name} | MasjidHisab`,
    description: `${mosque.name} in ${mosque.address.city}. Prayer times, committee, and community.`,
    openGraph: {
      title: mosque.name,
      images: mosque.coverUrl ? [mosque.coverUrl] : undefined,
    },
  };
}

export const revalidate = 120;

export default async function MosquePublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mosque = await getPublicMosqueBySlug(slug);
  if (!mosque) notFound();

  const committee = await getPublicCommittee(mosque._id.toString());
  const sortedCommittee = [...committee].sort(
    (a, b) =>
      (DESIGNATION_ORDER[a.designation] ?? 99) -
      (DESIGNATION_ORDER[b.designation] ?? 99),
  );

  return (
    <main className="min-h-screen bg-sage-50">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 bg-sage-700">
        {mosque.coverUrl && (
          <Image
            src={mosque.coverUrl}
            alt={mosque.name}
            fill
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-sage-700/90 via-sage-700/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 pb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl text-white">
              {mosque.name}
            </h1>
            <div className="flex items-center gap-1.5 text-white/90 mt-2">
              <MapPin className="h-4 w-4" />
              <span>
                {mosque.address.area ? `${mosque.address.area}, ` : ""}
                {mosque.address.city}, {mosque.address.district}
              </span>
            </div>
          </div>
          <JoinMosqueButton mosqueSlug={mosque.slug} mosqueName={mosque.name} />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Prayer times */}
          {mosque.prayerSettings && (
            <section className="bg-white rounded-2xl border border-sage-200 p-6 shadow-[0_1px_2px_rgba(45,52,54,0.04),0_8px_24px_-8px_rgba(79,122,92,0.14)]">
              <h2 className="font-heading text-xl text-ink mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sage-500" /> Prayer Times
              </h2>
              {mosque.prayerSettings.jummahTime && (
                <div className="flex justify-between py-2 border-b border-sage-100">
                  <span className="text-ink-soft">Jummah</span>
                  <span className="text-ink font-medium">
                    {mosque.prayerSettings.jummahTime}
                  </span>
                </div>
              )}
              <p className="text-ink-faint text-sm mt-3">
                Calculation method: {mosque.prayerSettings.calculationMethod}
              </p>
            </section>
          )}

          {/* Committee */}
          {sortedCommittee.length > 0 && (
            <section>
              <h2 className="font-heading text-xl text-ink mb-4">Committee</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sortedCommittee.map((member) => (
                  <div
                    key={member._id.toString()}
                    className="bg-white rounded-xl border border-sage-200 p-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-sage-100 mx-auto mb-3 overflow-hidden relative">
                      {member.photoUrl && (
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <p className="text-ink font-medium text-sm">
                      {member.name}
                    </p>
                    <p className="text-ink-faint text-xs">
                      {DESIGNATION_LABEL[member.designation] ??
                        member.designation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-sage-200 p-6">
            <h3 className="font-heading text-lg text-ink mb-4">Contact</h3>
            {mosque.contact?.phone && (
              <div className="flex items-center gap-2 text-ink-soft text-sm mb-2">
                <Phone className="h-4 w-4 text-sage-500" />{" "}
                {mosque.contact.phone}
              </div>
            )}
            {mosque.imamName && (
              <div className="flex items-center gap-2 text-ink-soft text-sm mb-2">
                <Users className="h-4 w-4 text-sage-500" /> Imam:{" "}
                {mosque.imamName}
              </div>
            )}
            {mosque.capacity && (
              <div className="text-ink-faint text-xs mt-3">
                Capacity: {mosque.capacity} musallis
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
