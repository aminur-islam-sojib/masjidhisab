// app/(public)/explore/explore-client.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Users } from "lucide-react";

interface MosqueCard {
  slug: string;
  name: string;
  logoUrl?: string;
  coverUrl?: string;
  address: { city: string; district: string; area?: string };
  imamName?: string;
  capacity?: number;
}

interface ExploreResponse {
  mosques: MosqueCard[];
  pagination: { page: number; totalPages: number; total: number };
}

export default function ExploreClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [data, setData] = useState<ExploreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const page = Number(searchParams.get("page") ?? 1);
  const activeSearch = searchParams.get("search") ?? "";

  const fetchMosques = useCallback(
    async (search: string, currentPage: number) => {
      // cancel any in-flight request before starting a new one
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("page", String(currentPage));
        params.set("limit", "12");

        const res = await fetch(`/api/mosques/explore?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();

        if (!res.ok || !Array.isArray(json.mosques)) {
          setError(json.error ?? "Something went wrong");
          setData(null);
          return;
        }

        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return; // expected, ignore
        setError("Something went wrong");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch whenever the URL's search/page params change (not on every keystroke)
  useEffect(() => {
    fetchMosques(activeSearch, page);
  }, [activeSearch, page, fetchMosques]);

  // Debounce: update the URL 400ms after the user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput === activeSearch) return; // nothing changed, skip

      const params = new URLSearchParams(searchParams);
      if (searchInput) params.set("search", searchInput);
      else params.delete("search");
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput, activeSearch, pathname, router, searchParams]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault(); // debounce effect already handles it; this just avoids page reload on Enter
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by mosque name or city..."
            className="pl-10 border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          />
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-sage-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : data && data.mosques.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.mosques.map((mosque) => (
              <MosqueCard key={mosque.slug} mosque={mosque} />
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="border-sage-200 rounded-xl"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-ink-soft text-sm">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= data.pagination.totalPages}
                onClick={() => goToPage(page + 1)}
                className="border-sage-200 rounded-xl"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-ink-faint">
          No mosques found. Try a different search.
        </div>
      )}
    </div>
  );
}

function MosqueCard({ mosque }: { mosque: MosqueCard }) {
  return (
    <Link
      href={`/masjid/${mosque.slug}`}
      className="group block rounded-2xl bg-white border border-sage-200 overflow-hidden shadow-card hover:shadow-soft transition-shadow"
    >
      <div className="h-28 bg-sage-100 relative">
        {mosque.coverUrl && (
          <Image
            src={mosque.coverUrl}
            alt={mosque.name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg text-ink group-hover:text-sage-600 transition-colors">
          {mosque.name}
        </h3>
        <div className="flex items-center gap-1.5 text-ink-soft text-sm mt-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {mosque.address.area ? `${mosque.address.area}, ` : ""}
            {mosque.address.city}
          </span>
        </div>
        {mosque.capacity && (
          <div className="flex items-center gap-1.5 text-ink-faint text-xs mt-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Capacity: {mosque.capacity}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
