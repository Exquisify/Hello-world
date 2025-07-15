"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function IdeasFilter() {
  const [openCategories, setOpenCategories] = useState(true)
  const [openTags, setOpenTags] = useState(true)

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Collapsible open={openCategories} onOpenChange={setOpenCategories}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
              Categories
              <ChevronDown className={`h-4 w-4 transition-transform ${openCategories ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="bitcoin" />
              <Label htmlFor="bitcoin">Bitcoin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ethereum" />
              <Label htmlFor="ethereum">Ethereum</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="altcoins" />
              <Label htmlFor="altcoins">Altcoins</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="defi" />
              <Label htmlFor="defi">DeFi</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="nft" />
              <Label htmlFor="nft">NFTs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="layer2" />
              <Label htmlFor="layer2">Layer 2</Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible open={openTags} onOpenChange={setOpenTags}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
              Tags
              <ChevronDown className={`h-4 w-4 transition-transform ${openTags ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="technical-analysis" />
              <Label htmlFor="technical-analysis">Technical Analysis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="fundamental-analysis" />
              <Label htmlFor="fundamental-analysis">Fundamental Analysis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="trading" />
              <Label htmlFor="trading">Trading</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="investment" />
              <Label htmlFor="investment">Investment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="news" />
              <Label htmlFor="news">News</Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">Content Type</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="all-content" />
            <Label htmlFor="all-content">All Content</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="premium-only" />
            <Label htmlFor="premium-only">Premium Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="free-only" />
            <Label htmlFor="free-only">Free Only</Label>
          </div>
        </div>

        <Separator />

        <div className="pt-2">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}
