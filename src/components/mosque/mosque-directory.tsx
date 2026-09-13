"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  MapPin,
  Users,
  ArrowRight,
} from "lucide-react";
import { PublicMosque } from "@/types/mosque";

interface MosqueDirectoryProps {
  mosques: PublicMosque[];
}

export function MosqueDirectory({ mosques }: MosqueDirectoryProps) {
  const [query, setQuery] = React.useState("");
  const [district, setDistrict] = React.useState("ALL");

  const districts = [
    ...new Set(mosques.map((m) => m.district).filter(Boolean)),
  ].sort();

  const filtered = mosques.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [m.name, m.city, m.district, m.area].some((value) =>
        value?.toLowerCase().includes(q),
      );
    const matchesDistrict = district === "ALL" || m.district === district;
    return matchesQuery && matchesDistrict;
  });

  return (
    <div className="space-y-5">
      {/* Search + district filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-3 text-ink-faint"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, area, city, or district..."
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-sage-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/30"
          />
        </div>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="px-3 py-2.5 text-sm border border-sage-200 rounded-xl bg-white text-ink focus:outline-none focus:ring-2 focus:ring-sage-400/30"
        >
          <option value="ALL">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-sage-200 bg-white p-12 text-center text-ink-faint">
          <Building2 size={32} className="mx-auto mb-2 opacity-40" />
          <p>
            {mosques.length === 0
              ? "No mosques listed yet."
              : "No mosques match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mosque) => {
            const location = [mosque.area, mosque.city, mosque.district]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={mosque.slug}
                className="bg-white rounded-2xl border border-sage-200 p-5 shadow-xs flex flex-col"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-ink truncate">
                      {mosque.name}
                    </h3>
                    {location && (
                      <p className="text-xs text-ink-soft mt-0.5 flex items-center gap-1">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs text-ink-soft">
                  {mosque.capacity != null && (
                    <span className="inline-flex items-center gap-1">
                      <Users size={13} />
                      {mosque.capacity.toLocaleString()} capacity
                    </span>
                  )}
                  {mosque.imamName && (
                    <span className="truncate">Imam: {mosque.imamName}</span>
                  )}
                </div>

                <Link
                  href={`/m/${mosque.slug}`}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
                >
                  View details
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
