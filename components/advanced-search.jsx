'use client'

import * as React from "react"
import { Search, Filter, Save, Bookmark, X, RotateCcw, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DateRangePicker } from "@/components/ui/date-range-picker"
import { RangeSlider } from "@/components/ui/range-slider"
import { UserAutocomplete } from "@/components/ui/user-autocomplete"
import { useSearchFilters } from "@/hooks/use-search-filters.jsx"
import { QUICK_FILTERS } from "@/lib/search-utils"

export function AdvancedSearch({ onSearch, isPending = false }) {
  const { 
    filters, 
    updateFilters, 
    clearFilters, 
    savedSearches, 
    saveSearch, 
    deleteSavedSearch, 
    loadSavedSearch 
  } = useSearchFilters()

  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
  const [searchName, setSearchName] = React.useState("")
  
  // 1. Performance Tuning: Synchronize local input to avoid full component rerender stuttering
  const [localQuery, setLocalQuery] = React.useState(filters.query || "")

  // Sync internal state when external actions fire (e.g. "Clear All" or "Load Saved Search")
  React.useEffect(() => {
    setLocalQuery(filters.query || "")
  }, [filters.query])

  // 2. Performance Tuning: 300ms Debounce listener pipeline for full-text queries
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      if ((localQuery || "") !== (filters.query || "")) {
        updateFilters({ query: localQuery })
        onSearch?.()
      }
    }, 300) // AC Check: 300ms delay window bounds

    return () => clearTimeout(timerId)
  }, [localQuery, updateFilters, onSearch, filters.query])

  const handleQuickFilter = (quickFilter) => {
    updateFilters(quickFilter.filters)
    onSearch?.()
  }

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      saveSearch(searchName.trim())
      setSearchName("")
      setSaveDialogOpen(false)
    }
  }

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key]
    if (key === "query") return value && value.length > 0
    if (key === "authors") return value && value.length > 0
    if (key === "tags") return value && value.length > 0
    return value !== undefined
  })

  return (
    <div className="space-y-4">
      {/* Main Search Bar Wrapper */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          {isPending ? (
            <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            placeholder="Search ideas..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="pl-10 pr-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters({ query: localQuery })
                onSearch?.()
              }
            }}
          />
          {localQuery && (
            <button
              onClick={() => {
                setLocalQuery("")
                updateFilters({ query: "" })
                onSearch?.()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:bg-slate-100 transition"
              aria-label="Clear text input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button onClick={() => {
          updateFilters({ query: localQuery })
          onSearch?.()
        }}>
          <Search className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={isAdvancedOpen ? "secondary" : "outline"}
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2 h-5 bg-indigo-600 hover:bg-indigo-600 rounded-full px-1.5 text-[10px] text-white font-bold">
              Active
            </Badge>
          )}
        </Button>
      </div>

      {/* Quick Filter Bar Actions */}
      <div className="flex flex-wrap gap-2 items-center">
        {QUICK_FILTERS.map((filter) => (
          <Button key={filter.name} variant="outline" size="sm" onClick={() => handleQuickFilter(filter)}>
            {filter.name}
          </Button>
        ))}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive hover:bg-destructive/5 transition">
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Extended Sub-Filter Area */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Advanced Parameters</CardTitle>
                <div className="flex gap-2">
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={!hasActiveFilters}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Search
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Search Query</DialogTitle>
                        <DialogDescription>Give your filter matrix parameters a name to reuse later.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="search-name">Query Blueprint Name</Label>
                          <Input
                            id="search-name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="e.g., Starred DeFi Invoices"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
                          Confirm Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {savedSearches.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4 mr-2" />
                          Saved Templates ({savedSearches.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Saved Search Matrices</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {savedSearches.map((saved) => (
                          <DropdownMenuItem key={saved.id} className="flex items-center justify-between group">
                            <span className="flex-1 font-medium truncate cursor-pointer" onClick={() => loadSavedSearch(saved)}>
                              {saved.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-60 group-hover:opacity-100 hover:text-destructive transition"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSavedSearch(saved.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Date Filtering Range Component */}
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">Date Threshold Window</Label>
                <DateRangePicker
                  value={filters.dateRange}
                  onChange={(range) => {
                    updateFilters({ dateRange: range })
                    onSearch?.()
                  }}
                  placeholder="Select target dates"
                />
              </div>

              {/* Vote Range Counter Slider Tier */}
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">Vote Parameter Matrix</Label>
                <RangeSlider
                  value={filters.voteRange ? [filters.voteRange.min, filters.voteRange.max] : [0, 1000]}
                  onValueChange={([min, max]) => {
                    updateFilters({ voteRange: { min, max } })
                    onSearch?.()
                  }}
                  min={0}
                  max={1000}
                  step={1}
                  label="Votes"
                />
              </div>

              {/* Autocomplete User Filter Block */}
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700">Author Registry Filter</Label>
                <UserAutocomplete
                  selectedUsers={filters.authors?.map((id) => ({ id, name: id, email: "" })) || []}
                  onUsersChange={(users) => {
                    updateFilters({ authors: users.map((u) => u.id) })
                    onSearch?.()
                  }}
                  placeholder="Search and attach author filters..."
                />
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

/**
 * High-performance search string match highlighter module
 */
export function HighlightText({ text = "", highlight = "" }) {
  if (!highlight || !highlight.trim()) return <span>{text}</span>
  
  const escapedHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(`(${escapedHighlight})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, idx) => 
        regex.test(part) ? (
          <mark key={idx} className="bg-yellow-100 text-yellow-800 font-semibold px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}