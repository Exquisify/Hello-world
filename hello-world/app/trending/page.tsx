import Link from "next/link"
import Image from "next/image"
import { TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { SocialIcons } from "@/components/social-icons"
import { GradientText } from "@/components/gradient-text"

export default function TrendingPage() {
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
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            <GradientText>Trending Topics</GradientText>
          </h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingTopics.map((topic) => (
              <Card key={topic.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>
                      <GradientText>{topic.name}</GradientText>
                    </CardTitle>
                    <Badge variant={topic.change > 0 ? "outline" : "secondary"} className="flex items-center">
                      {topic.change > 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : null}
                      {topic.change > 0 ? +${topic.change}% : ${topic.change}%}
                    </Badge>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[120px] bg-muted/40 rounded-md flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.relatedTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{topic.posts} posts this week</span>
                    <Link href={/topics/${topic.id}}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">
              <GradientText>Trending Discussions</GradientText>
            </h2>

            <div className="space-y-4">
              {trendingDiscussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={/discussions/${discussion.id}}>
                          <h3 className="text-lg font-semibold mb-2 hover:underline">{discussion.title}</h3>
                        </Link>
                        <p className="text-muted-foreground mb-4">{discussion.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Hot
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{discussion.author}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{discussion.date}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{discussion.comments} comments</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

const trendingTopics = [
  {
    id: 1,
    name: "Bitcoin ETFs",
    description: "Discussion around Bitcoin ETF approvals and market impact",
    change: 128,
    posts: 342,
    relatedTags: ["Bitcoin", "ETF", "Institutional", "Regulation"],
  },
  {
    id: 2,
    name: "Layer 2 Scaling",
    description: "Ethereum scaling solutions and their ecosystem growth",
    change: 86,
    posts: 217,
    relatedTags: ["Ethereum", "Layer 2", "StarkNet", "Optimism", "Arbitrum"],
  },
  {
    id: 3,
    name: "AI & Crypto",
    description: "Intersection of artificial intelligence and blockchain technology",
    change: 64,
    posts: 189,
    relatedTags: ["AI", "Machine Learning", "Oracles", "Data"],
  },
  {
    id: 4,
    name: "DeFi Innovations",
    description: "New developments in decentralized finance protocols",
    change: 42,
    posts: 156,
    relatedTags: ["DeFi", "Yield", "Lending", "DEX"],
  },
  {
    id: 5,
    name: "Regulatory Developments",
    description: "Global regulatory changes affecting cryptocurrency markets",
    change: -12,
    posts: 203,
    relatedTags: ["Regulation", "Compliance", "Legal", "Policy"],
  },
  {
    id: 6,
    name: "NFT Renaissance",
    description: "New use cases and market recovery for non-fungible tokens",
    change: 37,
    posts: 124,
    relatedTags: ["NFT", "Digital Art", "Gaming", "Collectibles"],
  },
]

const trendingDiscussions = [
  {
    id: 1,
    title: "How will Bitcoin ETFs change institutional adoption patterns?",
    excerpt:
      "With multiple Bitcoin ETFs now approved, let's discuss how this might change the way institutions approach cryptocurrency investments and what it means for market dynamics.",
    author: "InstitutionalInvestor",
    date: "2 days ago",
    comments: 87,
    tags: ["Bitcoin", "ETF", "Institutional"],
  },
  {
    id: 2,
    title: "StarkNet vs. zkSync: Technical comparison and investment thesis",
    excerpt:
      "A deep dive into the technical differences between these two leading ZK rollup solutions, and why one might outperform the other in the long term.",
    author: "ZKResearcher",
    date: "3 days ago",
    comments: 64,
    tags: ["Layer 2", "StarkNet", "zkSync", "ZK Rollups"],
  },
  {
    id: 3,
    title: "The impact of AI on blockchain oracle solutions",
    excerpt:
      "How machine learning and AI technologies are being integrated with blockchain oracles to provide more accurate and reliable data feeds for smart contracts.",
    author: "OracleExpert",
    date: "1 week ago",
    comments: 42,
    tags: ["AI", "Oracles", "Chainlink", "Data"],
  },
]