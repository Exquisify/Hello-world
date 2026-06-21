import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { GradientText } from "@/components/gradient-text"
import { SocialIcons } from "@/components/social-icons"

export default function MarketPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="flex items-center gap-2 ml-2 md:ml-0">
              <Image src="/placeholder-logo.svg" alt="Hello-World Logo" width={32} height={32} className="rounded-sm" />
              <span className="font-bold">Hello-World</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/ideas" className="text-sm font-medium hover:underline underline-offset-4">
              Ideas
            </Link>
            <Link href="/market" className="text-sm font-medium underline underline-offset-4">
              Market Data
            </Link>
            <Link href="/premium" className="text-sm font-medium hover:underline underline-offset-4">
              Premium
            </Link>
            <Link href="/community" className="text-sm font-medium hover:underline underline-offset-4">
              Community
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8 lg:py-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            <GradientText>Crypto Market Data</GradientText>
          </h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-semibold mb-4">
                <GradientText>Market Overview</GradientText>
              </h2>
              <div className="h-[150px] sm:h-[200px] bg-muted/40 rounded-md flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-2 flex justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Current Price</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold">$42,000</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">24h Change</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-green-500">+2.4%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold">
                <GradientText>Top Gainers</GradientText>
              </h2>
              <div className="border rounded-lg p-4 bg-background">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">SOL</span>
                      </div>
                      <span className="text-sm md:text-base">Solana</span>
                    </div>
                    <div className="text-green-500 text-sm md:text-base">+8.4%</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">AVAX</span>
                      </div>
                      <span className="text-sm md:text-base">Avalanche</span>
                    </div>
                    <div className="text-green-500 text-sm md:text-base">+6.2%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold">
                <GradientText>Market Sentiment</GradientText>
              </h2>
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-6 md:border-8 border-green-500 flex items-center justify-center mb-4">
                    <span className="text-xl md:text-2xl font-bold">Bullish</span>
                  </div>
                  <p className="text-center text-xs md:text-sm text-muted-foreground">
                    Market sentiment is currently bullish with strong institutional buying signals
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
              <GradientText>Market News</GradientText>
            </h2>
            <div className="space-y-4 md:space-y-6">
              <div className="border rounded-lg p-4 md:p-6 bg-background">
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  <GradientText>Bitcoin ETF Inflows Reach New Heights</GradientText>
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Bitcoin ETFs have seen record inflows this week, with over $500 million in new investments.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm text-muted-foreground">3 hours ago</span>
                  <Link href="#" className="text-xs md:text-sm text-primary hover:underline">Read more</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image src="/placeholder-logo.svg" alt="Hello-World Logo" width={24} height={24} className="rounded-sm" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Hello-World. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SocialIcons />
            <div className="flex gap-4">
              <Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4">Terms</Link>
              <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}