"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-8">
          <Link href="/" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/ideas" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
            Ideas
          </Link>
          <Link href="/market" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
            Market Data
          </Link>
          <Link href="/premium" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
            Premium
          </Link>
          <Link href="/community" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
            Community
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}