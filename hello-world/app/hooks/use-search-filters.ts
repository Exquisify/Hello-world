"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { SearchFilters, SavedSearch } from "@/types/search"
import { parseSearchQuery, filtersToUrlParams } from "@/lib/search-utils"

const SAVED_SEARCHES_KEY = "saved-searches"

export function useSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<SearchFilters>({})
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = parseSearchQuery(searchParams)
    setFilters(urlFilters)
  }, [searchParams])

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_SEARCHES_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSavedSearches(
          parsed.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            filters: {
              ...s.filters,
              dateRange: s.filters.dateRange
                ? {
                    from: new Date(s.filters.dateRange.from),
                    to: new Date(s.filters.dateRange.to),
                  }
                : undefined,
            },
          })),
        )
      } catch (error) {
        console.error("Failed to parse saved searches:", error)
      }
    }
  }, [])

  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters }
      setFilters(updatedFilters)

      // Update URL
      const params = filtersToUrlParams(updatedFilters)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [filters, router],
  )

  const clearFilters = useCallback(() => {
    setFilters({})
    router.push("/", { scroll: false })
  }, [router])

  const saveSearch = useCallback(
    (name: string) => {
      const newSavedSearch: SavedSearch = {
        id: Date.now().toString(),
        name,
        filters: { ...filters },
        createdAt: new Date(),
      }

      const updated = [...savedSearches, newSavedSearch]
      setSavedSearches(updated)
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    },
    [filters, savedSearches],
  )

  const deleteSavedSearch = useCallback(
    (id: string) => {
      const updated = savedSearches.filter((s) => s.id !== id)
      setSavedSearches(updated)
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    },
    [savedSearches],
  )

  const loadSavedSearch = useCallback(
    (savedSearch: SavedSearch) => {
      setFilters(savedSearch.filters)
      const params = filtersToUrlParams(savedSearch.filters)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router],
  )

  return {
    filters,
    updateFilters,
    clearFilters,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,
    isLoading,
    setIsLoading,
  }
}
