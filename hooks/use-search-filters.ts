"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { SavedSearch, SearchFilters } from "@/types/search"
import { filtersToUrlParams, parseSearchQuery } from "@/lib/search-utils"

const SAVED_SEARCHES_KEY = "hello-world-saved-searches"

function reviveSavedSearch(value: unknown): SavedSearch | null {
  if (!value || typeof value !== "object") return null
  const saved = value as SavedSearch
  if (!saved.id || !saved.name || !saved.filters) return null
  const range = saved.filters.dateRange
  return {
    ...saved,
    createdAt: new Date(String(saved.createdAt)),
    filters: {
      ...saved.filters,
      dateRange: range
        ? {
            from: range.from ? new Date(String(range.from)) : undefined,
            to: range.to ? new Date(String(range.to)) : undefined,
          }
        : undefined,
    },
  }
}

export function useSearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<SearchFilters>(() => parseSearchQuery(searchParams))
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  useEffect(() => setFilters(parseSearchQuery(searchParams)), [searchParams])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SAVED_SEARCHES_KEY) ?? "[]") as unknown[]
      setSavedSearches(stored.map(reviveSavedSearch).filter((item): item is SavedSearch => Boolean(item)))
    } catch {
      localStorage.removeItem(SAVED_SEARCHES_KEY)
    }
  }, [])

  const navigate = useCallback((next: SearchFilters) => {
    const query = filtersToUrlParams(next).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, router])

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...updates }
      navigate(next)
      return next
    })
  }, [navigate])

  const clearFilters = useCallback(() => {
    setFilters({})
    navigate({})
  }, [navigate])

  const persist = (items: SavedSearch[]) => {
    setSavedSearches(items)
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(items))
  }

  const saveSearch = (name: string) => persist([...savedSearches, {
    id: crypto.randomUUID(), name, filters, createdAt: new Date(),
  }])
  const deleteSavedSearch = (id: string) => persist(savedSearches.filter((item) => item.id !== id))
  const loadSavedSearch = (saved: SavedSearch) => {
    setFilters(saved.filters)
    navigate(saved.filters)
  }

  return { filters, updateFilters, clearFilters, savedSearches, saveSearch, deleteSavedSearch, loadSavedSearch }
}
