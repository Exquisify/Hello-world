import type { SearchFilters } from "@/types/search"

export function buildSearchQuery(filters: SearchFilters): Record<string, any> {
  const query: Record<string, any> = {}

  if (filters.query) {
    query.q = filters.query
  }

  if (filters.dateRange?.from) {
    query.dateFrom = filters.dateRange.from.toISOString()
  }

  if (filters.dateRange?.to) {
    query.dateTo = filters.dateRange.to.toISOString()
  }

  if (filters.voteRange?.min !== undefined) {
    query.voteMin = filters.voteRange.min
  }

  if (filters.voteRange?.max !== undefined) {
    query.voteMax = filters.voteRange.max
  }

  if (filters.authors && filters.authors.length > 0) {
    query.authors = filters.authors.join(",")
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = filters.tags.join(",")
  }

  return query
}

export function parseSearchQuery(searchParams: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {}

  const query = searchParams.get("q")
  if (query) filters.query = query

  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")
  if (dateFrom || dateTo) {
    filters.dateRange = {
      from: dateFrom ? new Date(dateFrom) : new Date(0),
      to: dateTo ? new Date(dateTo) : new Date(),
    }
  }

  const voteMin = searchParams.get("voteMin")
  const voteMax = searchParams.get("voteMax")
  if (voteMin || voteMax) {
    filters.voteRange = {
      min: voteMin ? Number.parseInt(voteMin) : 0,
      max: voteMax ? Number.parseInt(voteMax) : 1000,
    }
  }

  const authors = searchParams.get("authors")
  if (authors) {
    filters.authors = authors.split(",")
  }

  const tags = searchParams.get("tags")
  if (tags) {
    filters.tags = tags.split(",")
  }

  return filters
}

export function filtersToUrlParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()
  const query = buildSearchQuery(filters)

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, value.toString())
    }
  })

  return params
}

export const QUICK_FILTERS = [
  {
    name: "Recent",
    filters: {
      dateRange: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
  },
  {
    name: "Popular",
    filters: {
      voteRange: { min: 50, max: 1000 },
    },
  },
  {
    name: "This Month",
    filters: {
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  },
  {
    name: "Highly Voted",
    filters: {
      voteRange: { min: 100, max: 1000 },
    },
  },
]
