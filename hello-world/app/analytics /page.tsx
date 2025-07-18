"use client"

import Link from "next/link"
import Image from "next/image"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { StreakDisplay } from "@/components/streak-display"
import { AchievementSystem } from "@/components/achievement-system"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { SocialIcons } from "@/components/social-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 ml-2 md:ml-0">
              <Image src="/logo.jpg" alt="Hello-World Logo" width={32} height={32} className="rounded-sm" />
              <span className="font-bold">Hello-World</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/ideas" className="text-sm font-medium hover:underline underline-offset-4">
              Ideas
            </Link>
            <Link href="/market" className="text-sm font-medium hover:underline underline-offset-4">
              Market Data
            </Link>
            <Link href="/premium" className="text-sm font-medium hover:underline underline-offset-4">
              Premium
            </Link>
            <Link href="/community" className="text-sm font-medium hover:underline underline-offset-4">
              Community
            </Link>
            <Link href="/analytics" className="text-sm font-medium underline underline-offset-4">
              Analytics
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 md:px-6 md:py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="streaks">
            <StreakDisplay />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystem />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Hello-World Logo" width={24} height={24} className="rounded-sm" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Hello-World. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SocialIcons />
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
