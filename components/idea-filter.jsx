"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSearchFilters } from "@/hooks/use-search-filters"

const CATEGORIES = ["Bitcoin", "Stellar", "Ethereum", "Altcoins", "DeFi", "NFTs", "Layer 2"]
const TAGS = ["Technical Analysis", "Fundamental Analysis", "Trading", "Investment", "News", "Soroban"]
const CONTENT_TYPES = [{ value: "all", label: "All Content" }, { value: "premium", label: "Premium Only" }, { value: "free", label: "Free Only" }]

function FilterSection({ title, open, onOpenChange, children }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
          {title}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pb-4 pt-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export function IdeasFilter() {
  const [openCategories, setOpenCategories] = useState(true)
  const [openTags, setOpenTags] = useState(true)
  const { filters, updateFilters, clearFilters } = useSearchFilters()

  const toggleTag = (tag) => {
    const current = filters.tags ?? []
    updateFilters({ tags: current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag] })
  }

  return (
    <Card className="sticky top-6">
      <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <FilterSection title="Categories" open={openCategories} onOpenChange={setOpenCategories}>
          {CATEGORIES.map((category) => (
            <div className="flex items-center space-x-2" key={category}>
              <Checkbox id={`category-${category}`} checked={filters.category === category}
                onCheckedChange={(checked) => updateFilters({ category: checked ? category : undefined })} />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </FilterSection>
        <Separator />
        <FilterSection title="Tags" open={openTags} onOpenChange={setOpenTags}>
          {TAGS.map((tag) => (
            <div className="flex items-center space-x-2" key={tag}>
              <Checkbox id={`tag-${tag}`} checked={filters.tags?.includes(tag) ?? false}
                onCheckedChange={() => toggleTag(tag)} />
              <Label htmlFor={`tag-${tag}`}>{tag}</Label>
            </div>
          ))}
        </FilterSection>
        <Separator />
        <div className="space-y-2">
          <h3 className="font-semibold">Content Type</h3>
          {CONTENT_TYPES.map((type) => (
            <div className="flex items-center space-x-2" key={type.value}>
              <Checkbox id={`content-${type.value}`} checked={(filters.contentType ?? "all") === type.value}
                onCheckedChange={(checked) => checked && updateFilters({ contentType: type.value })} />
              <Label htmlFor={`content-${type.value}`}>{type.label}</Label>
            </div>
          ))}
        </div>
        <Separator />
        <Button variant="outline" className="w-full" onClick={clearFilters}>Clear filters</Button>
      </CardContent>
    </Card>
  )
}
