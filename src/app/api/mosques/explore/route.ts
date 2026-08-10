// app/api/mosques/explore/route.ts
import { NextRequest, NextResponse } from "next/server";
import { exploreMosquesQuerySchema } from "@/lib/validations/explore";
import { getExploreMosques } from "@/features/Mosque/queries";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = exploreMosquesQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  const { search, city, page, limit } = parsed.data;

  try {
    const result = await getExploreMosques(search, city, page, limit);

    return NextResponse.json(result, {
      headers: {
        // CDN/edge caching layer on top of the app-level cache — huge for public traffic
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Explore mosques error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
