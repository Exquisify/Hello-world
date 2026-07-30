import { NextResponse } from "next/server"
import { ideas, searchIdeas } from "@/lib/ideas"

export function GET(request) {
  const params = request.nextUrl.searchParams
  const results = searchIdeas(ideas, {
    query: params.get("q") ?? "",
    category: params.get("category") ?? undefined,
    tags: params.get("tags")?.split(",").filter(Boolean) ?? [],
    contentType: params.get("contentType") ?? "all",
    authors: params.get("authors")?.split(",").filter(Boolean) ?? [],
    voteMin: params.has("voteMin") ? Number(params.get("voteMin")) : undefined,
    voteMax: params.has("voteMax") ? Number(params.get("voteMax")) : undefined,
    dateFrom: params.get("dateFrom") ?? undefined,
    dateTo: params.get("dateTo") ?? undefined,
  })

  return NextResponse.json({ results, total: results.length })
}
