"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Users } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { AdvancedSearch, HighlightText } from "@/components/advanced-search"
import { IdeasFilter } from "@/components/idea-filter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { GradientText } from "@/components/gradient-text"
import { NotificationsPanel } from "@/components/notifications-panel"

function IdeasExplorer() {
  const searchParams = useSearchParams()
  const [ideas, setIdeas] = useState([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState("")
  const query = searchParams.get("q") ?? ""

  useEffect(() => {
    const controller = new AbortController()
    const loadIdeas = async () => {
      setIsPending(true)
      setError("")
      try {
        const response = await fetch(`/api/ideas/search?${searchParams.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Search is temporarily unavailable.")
        const payload = await response.json()
        setIdeas(payload.results)
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setIsPending(false)
      }
    }
    loadIdeas()
    return () => controller.abort()
  }, [searchParams])

  return (
    <>
      <AdvancedSearch isPending={isPending} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <IdeasFilter />
        <section aria-live="polite" aria-busy={isPending}>
          <p className="mb-4 text-sm text-muted-foreground">
            {isPending ? "Searching ideas…" : `${ideas.length} idea${ideas.length === 1 ? "" : "s"} found`}
          </p>
          {error && <Card className="border-destructive"><CardContent className="pt-6 text-destructive">{error}</CardContent></Card>}
          {!error && !isPending && ideas.length === 0 && (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No ideas match all selected filters.</CardContent></Card>
          )}
          <div className="space-y-4">
            {ideas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle><Link href={`/ideas/${idea.id}`} className="hover:underline"><HighlightText text={idea.title} highlight={query} /></Link></CardTitle>
                    {idea.premium && <Badge variant="secondary">Premium</Badge>}
                  </div>
                  <CardDescription><HighlightText text={idea.excerpt} highlight={query} /></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge>{idea.category}</Badge>
                    {idea.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" />{idea.votes} votes</span>
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{idea.author}</span>
                      <span>{new Date(idea.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Button asChild variant="ghost" size="sm"><Link href={`/ideas/${idea.id}`}>Read More</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default function IdeasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center"><MobileNav /><Link href="/" className="ml-2 flex items-center gap-2 md:ml-0"><Image src="/logo.jpg" alt="Hello-World Logo" width={32} height={32} className="rounded-sm" /><span className="font-bold">Hello-World</span></Link></div>
          <nav className="hidden gap-6 md:flex"><Link href="/ideas" className="text-sm font-medium underline underline-offset-4">Ideas</Link><Link href="/market" className="text-sm font-medium hover:underline">Market Data</Link><Link href="/premium" className="text-sm font-medium hover:underline">Premium</Link></nav>
          <div className="flex items-center gap-2"><NotificationsPanel /><WalletConnect /><ThemeToggle /></div>
        </div>
      </header>
      <main className="flex-1"><div className="container px-4 py-8 md:px-6"><div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-bold"><GradientText>Community Ideas</GradientText></h1><Button asChild><Link href="/ideas/new">Share Your Idea</Link></Button></div><Suspense fallback={<p>Loading search…</p>}><IdeasExplorer /></Suspense></div></main>
      <footer className="mt-auto border-t py-6"><div className="container px-4 text-sm text-muted-foreground md:px-6">© {new Date().getFullYear()} Hello-World.</div></footer>
    </div>
  )
}
