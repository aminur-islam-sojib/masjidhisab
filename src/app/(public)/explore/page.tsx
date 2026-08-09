// app/(public)/explore/page.tsx
import { Suspense } from "react";
import ExploreClient from "./explore-client";

export const metadata = {
  title: "Explore Mosques | MasjidHisab",
  description: "Find and connect with mosques near you.",
};

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-sage-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-heading text-3xl text-ink mb-2">Explore Mosques</h1>
        <p className="text-ink-soft mb-8">
          Search by name or city to find a mosque and join.
        </p>

        <Suspense fallback={<ExploreSkeleton />}>
          <ExploreClient />
        </Suspense>
      </div>
    </main>
  );
}

function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 rounded-2xl bg-sage-100 animate-pulse" />
      ))}
    </div>
  );
}
