import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicNoticesBySlug } from "@/features/Notice/queries";
import { Pin, Megaphone, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicMosquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicNoticesBySlug(slug);

  if (!data) notFound();

  const { mosque, notices } = data;
  const address = mosque.address
    ? [mosque.address.area, mosque.address.city, mosque.address.district]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <main className="min-h-screen bg-sage-50/40 font-body">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-ink">
            {mosque.name}
          </h1>
          {address && <p className="text-ink-soft mt-1">{address}</p>}
        </div>

        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sage-200 p-10 text-center text-ink-faint">
              <Megaphone size={32} className="mx-auto mb-2 opacity-40" />
              <p>No public notices yet.</p>
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm ${
                  notice.pinned ? "border-gold-400/50" : "border-sage-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {notice.pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-100 text-gold-500 text-xs font-semibold">
                      <Pin size={12} />
                      Pinned
                    </span>
                  )}
                  <span className="text-xs text-ink-faint">
                    {notice.publishedAt}
                  </span>
                </div>
                <h2 className="font-heading text-lg font-semibold text-ink mt-2">
                  {notice.title}
                </h2>
                <p className="text-ink-soft text-sm mt-2 whitespace-pre-line">
                  {notice.message}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/mosques"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-700 hover:text-sage-800"
          >
            Browse all mosques
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
