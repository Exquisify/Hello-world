"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Lightbulb, Sparkles, TrendingUp, Vote } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/gradient-text"

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    const loadProfileData = () => {
      setProfileData({
        name: "Alex Morgan",
        username: "@alexm",
        joined: "Member since January 2024",
        subscription: {
          tier: "Premium",
          expiresAt: "August 24, 2026",
          status: "Active",
        },
        ideas: [
          {
            id: 1,
            title: "AI-powered market sentiment summaries",
            excerpt: "A compact tool that turns community activity into straightforward buy and sell signals.",
            createdAt: "March 12, 2026",
            votes: 24,
            status: "Trending",
          },
          {
            id: 2,
            title: "Community-curated launch calendar",
            excerpt: "A shared calendar that highlights upcoming token launches and milestones.",
            createdAt: "February 8, 2026",
            votes: 16,
            status: "Reviewing",
          },
        ],
        votes: [
          {
            id: 1,
            idea: "Solana staking rewards explorer",
            createdAt: "April 2, 2026",
            direction: "Upvoted",
            weight: 3,
          },
          {
            id: 2,
            idea: "Cross-chain wallet activity tracker",
            createdAt: "March 19, 2026",
            direction: "Upvoted",
            weight: 2,
          },
          {
            id: 3,
            idea: "Creator-led premium analytics",
            createdAt: "March 5, 2026",
            direction: "Downvoted",
            weight: 1,
          },
        ],
      })
    }

    loadProfileData()
  }, [])

  if (!profileData) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Your profile</p>
          <h1 className="text-3xl font-bold">
            <GradientText>{profileData.name}</GradientText>
          </h1>
          <p className="mt-2 text-muted-foreground">
            {profileData.username} • {profileData.joined}
          </p>
        </div>
        <Link href="/ideas/new">
          <Button>Share New Idea</Button>
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ideas">Created Ideas</TabsTrigger>
          <TabsTrigger value="votes">Voting History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Activity snapshot</CardTitle>
                <CardDescription>Your latest ideas and voting activity.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Ideas shared
                  </div>
                  <p className="text-2xl font-bold">{profileData.ideas.length}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Vote className="h-4 w-4 text-primary" />
                    Votes cast
                  </div>
                  <p className="text-2xl font-bold">{profileData.votes.length}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Total support
                  </div>
                  <p className="text-2xl font-bold">{profileData.ideas.reduce((sum, idea) => sum + idea.votes, 0)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Subscription</CardTitle>
                <CardDescription>Current plan and renewal date.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current tier</span>
                  <Badge variant="secondary">{profileData.subscription.tier}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="font-medium">{profileData.subscription.status}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Renews on {profileData.subscription.expiresAt}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-4">
          {profileData.ideas.map((idea) => (
            <Card key={idea.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription>{idea.excerpt}</CardDescription>
                  </div>
                  <Badge variant="secondary">{idea.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    <Lightbulb className="h-4 w-4" />
                    {idea.votes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {idea.createdAt}
                  </span>
                </div>
                <Link href={`/ideas/${idea.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="votes" className="space-y-4">
          {profileData.votes.map((vote) => (
            <Card key={vote.id}>
              <CardContent className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{vote.idea}</p>
                  <p className="text-sm text-muted-foreground">{vote.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={vote.direction === "Upvoted" ? "default" : "outline"}>{vote.direction}</Badge>
                  <span className="text-sm text-muted-foreground">{vote.weight} point</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage