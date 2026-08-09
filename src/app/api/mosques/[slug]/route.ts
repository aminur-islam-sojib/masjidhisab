// app/api/mosques/[slug]/route.ts
import { getPublicMosqueBySlug } from "@/features/Mosque/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const mosque = await getPublicMosqueBySlug(slug);

  if (!mosque) {
    return NextResponse.json({ error: "Mosque not found" }, { status: 404 });
  }

  return NextResponse.json(mosque, {
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
    },
  });
}
