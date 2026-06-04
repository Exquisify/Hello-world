"use client"

import Link from "next/link"
import Image from "next/image"
import { TrendingUp, ArrowUpRight, BarChart3, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { SocialIcons } from "@/components/social-icons"
import { GradientText } from "@/components/gradient-text"

export default function IdeasPage() {
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
            <Link href="/ideas" className="text-sm font-medium underline underline-offset-4">
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
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              <GradientText>Community Ideas</GradientText>
            </h1>
            <Link href="/ideas/new">
              <Button>Share Your Idea</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {ideas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      <Link href={`/ideas/${idea.id}`} className="hover:underline">
                        <GradientText>{idea.title}</GradientText>
                      </Link>
                    </CardTitle>
                    {idea.premium && <Badge variant="secondary">Premium</Badge>}
                  </div>
                  <CardDescription>{idea.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{idea.votes} votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{idea.author}</span>
                      </div>
                      <span>{idea.date}</span>
                    </div>
                    <Link href={`/ideas/${idea.id}`}>
                      <Button variant="ghost" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

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

const ideas = [
  {
    id: 1,
    title: "Bitcoin likely to break $50k resistance by Q2 2024",
    excerpt: "Based on current market trends and institutional adoption, I believe Bitcoin will break through the $50,000 resistance level by Q2 2024.",
    author: "CryptoAnalyst",
    date: "2 hours ago",
    votes: 24,
    tags: ["Bitcoin", "Technical Analysis", "Price Prediction"],
    premium: true,
  },
  {
    id: 2,
    title: "Ethereum's shift to PoS will drive 30% price increase",
    excerpt: "Ethereum's successful transition to Proof of Stake has significantly reduced its energy consumption. This creates a strong case for price appreciation.",
    author: "ETHDeveloper",
    date: "5 hours ago",
    votes: 18,
    tags: ["Ethereum", "PoS", "Sustainability"],
    premium: false,
  },
  {
    id: 3,
    title: "Stellar DeFi ecosystem growth on Soroban",
    excerpt: "Stellar's Soroban smart contracts are gaining traction for DeFi applications with low fees and fast finality on the network.",
    author: "StellarBuilder",
    date: "1 day ago",
    votes: 42,
    tags: ["Stellar", "DeFi", "Soroban"],
    premium: false,
  },
]