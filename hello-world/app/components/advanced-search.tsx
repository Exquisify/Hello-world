"use client"

import * as React from "react"
import { Search, Filter, Save, Bookmark, X, RotateCcw } from "lucide-react"

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
import { useSearchFilters } from "@/hooks/use-search-filters"
import { QUICK_FILTERS } from "@/lib/search-utils"
import type { User } from "@/types/search"

interface AdvancedSearchProps {
  onSearch?: () => void
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const { filters, updateFilters, clearFilters, savedSearches, saveSearch, deleteSavedSearch, loadSavedSearch } =
    useSearchFilters()

  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
  const [searchName, setSearchName] = React.useState("")

  const handleQuickFilter = (quickFilter: (typeof QUICK_FILTERS)[0]) => {
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
    const value = filters[key as keyof typeof filters]
    if (key === "query") return value && value.length > 0
    if (key === "authors") return value && value.length > 0
    if (key === "tags") return value && value.length > 0
    return value !== undefined
  })

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={filters.query || ""}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch?.()
              }
            }}
          />
        </div>
        <Button onClick={onSearch}>
          <Search className="h-4 w-4" />
        </Button>
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <Button key={filter.name} variant="outline" size="sm" onClick={() => handleQuickFilter(filter)}>
            {filter.name}
          </Button>
        ))}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="text-muted-foreground bg-transparent">
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
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
                        <DialogTitle>Save Search</DialogTitle>
                        <DialogDescription>Give your search a name to save it for later use.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="search-name">Search Name</Label>
                          <Input
                            id="search-name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Enter search name..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
                          Save Search
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {savedSearches.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4 mr-2" />
                          Saved ({savedSearches.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Saved Searches</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {savedSearches.map((saved) => (
                          <DropdownMenuItem key={saved.id} className="flex items-center justify-between">
                            <span className="flex-1 cursor-pointer" onClick={() => loadSavedSearch(saved)}>
                              {saved.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-muted-foreground hover:text-destructive"
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
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <DateRangePicker
                  value={filters.dateRange}
                  onChange={(range) => updateFilters({ dateRange: range })}
                  placeholder="Select date range"
                />
              </div>

              {/* Vote Count Range */}
              <div className="space-y-2">
                <Label>Vote Count Range</Label>
                <RangeSlider
                  value={filters.voteRange ? [filters.voteRange.min, filters.voteRange.max] : [0, 1000]}
                  onValueChange={([min, max]) => updateFilters({ voteRange: { min, max } })}
                  min={0}
                  max={1000}
                  step={1}
                  label="Votes"
                />
              </div>

              {/* Author Filter */}
              <div className="space-y-2">
                <Label>Authors</Label>
                <UserAutocomplete
                  selectedUsers={filters.authors?.map((id) => ({ id, name: id, email: "" })) || []}
                  onUsersChange={(users: User[]) => updateFilters({ authors: users.map((u) => u.id) })}
                  placeholder="Search and select authors..."
                />
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
