import { getPublicMosques } from "@/features/Mosque/queries";
import { MosqueDirectory } from "@/components/mosque/mosque-directory";

export const dynamic = "force-dynamic";

export default async function MosquesPage() {
  const mosques = await getPublicMosques();

  return (
    <main className="min-h-screen bg-sage-50/40 font-body">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-ink">Mosques</h1>
          <p className="text-ink-soft mt-1">
            Browse registered mosques and view their public profiles.
          </p>
        </div>

        <MosqueDirectory mosques={mosques} />
      </div>
    </main>
  );
}
