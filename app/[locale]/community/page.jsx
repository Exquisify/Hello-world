import Link from "next/link"
import Image from "next/image"
import { Users, MessageSquare, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { GradientText } from "@/components/gradient-text"
import { SocialIcons } from "@/components/social-icons"

export default function CommunityPage() {
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
            <Link href="/ideas" className="text-sm font-medium hover:underline underline-offset-4">Ideas</Link>
            <Link href="/market" className="text-sm font-medium hover:underline underline-offset-4">Market Data</Link>
            <Link href="/premium" className="text-sm font-medium hover:underline underline-offset-4">Premium</Link>
            <Link href="/community" className="text-sm font-medium underline underline-offset-4">Community</Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-primary">Community Hub</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                <GradientText>Join the Hello-World Community</GradientText>
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with crypto enthusiasts, share ideas, and participate in community events
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button>Join Discord</Button>
                <Button variant="outline">Follow on Twitter</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">
              <GradientText>Recent Discussions</GradientText>
            </h2>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="CryptoExpert" />
                    <AvatarFallback>CE</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      <GradientText>The future of DeFi in a regulated environment</GradientText>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">CryptoExpert</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  With increasing regulatory scrutiny, how will DeFi protocols adapt while maintaining their
                  decentralized nature? Let's discuss potential approaches and solutions.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>24 replies</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm">Join Discussion</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
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