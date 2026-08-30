"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  Edit3,
  ExternalLink,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  User,
  Vote,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GradientText } from "@/components/gradient-text"
import { getUserProfile } from "@/lib/user-profile"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params?.userId || "me"
  const locale = params?.locale || "en"

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        let loggedUser = null
        const authRes = await fetch("/api/auth/me")
        if (authRes.ok) {
          const authData = await authRes.json()
          loggedUser = authData.user
          setCurrentUser(authData.user)
        }

        // Try API endpoint first, fallback to direct resolver
        const res = await fetch(`/api/users/${userId}`)
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile)
        } else {
          setProfile(getUserProfile(userId, loggedUser))
        }
      } catch (err) {
        console.error("Error loading user profile:", err)
        setProfile(getUserProfile(userId, null))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-muted-foreground text-sm">Loading user profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested user profile does not exist.</p>
        <Link href={`/${locale}/ideas`}>
          <Button variant="outline">Back to Ideas</Button>
        </Link>
      </div>
    )
  }

  const isOwnProfile =
    userId === "me" ||
    (currentUser && (currentUser.id === profile.id || currentUser.email === profile.email))

  const totalSupport = (profile.ideas || []).reduce((sum, item) => sum + (item.votes || 0), 0)

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Top Breadcrumb & Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        {isOwnProfile && (
          <Link href={`/${locale}/settings`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Profile Header Card */}
      <Card className="mb-8 overflow-hidden border-border/60 shadow-md">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-primary/20 via-primary/10 to-background p-6" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-4">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg rounded-2xl">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">
                  {profile.name
                    ? profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    <GradientText>{profile.name}</GradientText>
                  </h1>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {profile.subscription?.tier || "Free"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono mt-0.5">
                  {profile.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link href={`/${locale}/ideas/new`}>
                <Button className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Share New Idea
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2 text-sm text-muted-foreground border-t">
            {profile.bio && (
              <p className="sm:col-span-2 text-foreground/90 text-sm leading-relaxed">
                {profile.bio}
              </p>
            )}
            <div className="flex items-center gap-2 sm:justify-end text-xs">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>{profile.joined || "Member"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ideas">
            Ideas <span className="ml-1 text-xs opacity-75">({(profile.ideas || []).length})</span>
          </TabsTrigger>
          <TabsTrigger value="votes">
            Votes <span className="ml-1 text-xs opacity-75">({(profile.votes || []).length})</span>
          </TabsTrigger>
          <TabsTrigger value="subscription">Plan</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Stat 1: Shared Ideas */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ideas Shared
                </CardTitle>
                <Lightbulb className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(profile.ideas || []).length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Published community proposals
                </p>
              </CardContent>
            </Card>

            {/* Stat 2: Total Votes */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Votes Cast
                </CardTitle>
                <Vote className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(profile.votes || []).length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Community participation history
                </p>
              </CardContent>
            </Card>

            {/* Stat 3: Total Support */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Upvote Support
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalSupport}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upvotes across created ideas
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest ideas created and community votes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(profile.ideas || []).length === 0 && (profile.votes || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No recent activity found.</p>
                ) : (
                  <>
                    {(profile.ideas || []).slice(0, 2).map((idea) => (
                      <div
                        key={`idea-${idea.id}`}
                        className="flex items-start justify-between p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              Created Idea
                            </Badge>
                            <span className="text-xs text-muted-foreground">{idea.createdAt}</span>
                          </div>
                          <p className="text-sm font-medium">{idea.title}</p>
                        </div>
                        <Link href={`/${locale}/ideas/${idea.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {(profile.votes || []).slice(0, 2).map((vote) => (
                      <div
                        key={`vote-${vote.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={vote.direction === "Upvoted" ? "default" : "outline"}
                              className="text-[10px]"
                            >
                              {vote.direction}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{vote.createdAt}</span>
                          </div>
                          <p className="text-sm font-medium line-clamp-1">{vote.idea}</p>
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          +{vote.weight} pt
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Subscription Summary Card */}
            <Card className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Subscription Status
                  </CardTitle>
                  <CardDescription>Current tier and plan status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <span className="text-sm text-muted-foreground">Current Plan</span>
                    <Badge variant="default" className="font-semibold px-3 py-1">
                      {profile.subscription?.tier || "Free"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-muted-foreground">Account Status</span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {profile.subscription?.status || "Active"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-muted-foreground">Expiration Date</span>
                    <span className="text-sm font-medium">
                      {profile.subscription?.expiresAt || "Never"}
                    </span>
                  </div>
                </CardContent>
              </div>
              <CardFooter className="pt-4 border-t">
                <Link href={`/${locale}/premium`} className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Manage Subscription
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* CREATED IDEAS TAB */}
        <TabsContent value="ideas" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Created Ideas</h3>
            <span className="text-xs text-muted-foreground">
              Showing {(profile.ideas || []).length} ideas
            </span>
          </div>

          {(profile.ideas || []).length === 0 ? (
            <Card className="p-8 text-center">
              <Lightbulb className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h4 className="text-base font-semibold mb-1">No ideas created yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Share your first idea with the community to get feedback and votes.
              </p>
              <Link href={`/${locale}/ideas/new`}>
                <Button size="sm">Create an Idea</Button>
              </Link>
            </Card>
          ) : (
            (profile.ideas || []).map((idea) => (
              <Card key={idea.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <CardTitle className="text-lg font-bold">
                          <Link
                            href={`/${locale}/ideas/${idea.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {idea.title}
                          </Link>
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm">
                        {idea.excerpt}
                      </CardDescription>
                    </div>
                    {idea.status && (
                      <Badge variant="secondary" className="self-start sm:self-auto">
                        {idea.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[11px] font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Vote className="h-3.5 w-3.5 text-primary" />
                        {idea.votes} upvotes
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {idea.createdAt}
                      </span>
                    </div>
                    <Link href={`/${locale}/ideas/${idea.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        View Details
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* VOTING HISTORY TAB */}
        <TabsContent value="votes" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Voting History</h3>
            <span className="text-xs text-muted-foreground">
              Total {(profile.votes || []).length} votes cast
            </span>
          </div>

          {(profile.votes || []).length === 0 ? (
            <Card className="p-8 text-center">
              <Vote className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h4 className="text-base font-semibold mb-1">No votes cast yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Explore trending ideas and cast your votes to see your history here.
              </p>
              <Link href={`/${locale}/ideas`}>
                <Button size="sm">Browse Ideas</Button>
              </Link>
            </Card>
          ) : (
            (profile.votes || []).map((vote) => (
              <Card key={vote.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6">
                  <div className="space-y-1">
                    <Link
                      href={`/${locale}/ideas/${vote.ideaId || 1}`}
                      className="font-medium hover:text-primary transition-colors text-sm sm:text-base"
                    >
                      {vote.idea}
                    </Link>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Voted on {vote.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={vote.direction === "Upvoted" ? "default" : "secondary"}
                      className="flex items-center gap-1.5 px-3 py-1"
                    >
                      {vote.direction === "Upvoted" ? (
                        <ThumbsUp className="h-3.5 w-3.5 text-primary-foreground" />
                      ) : (
                        <ThumbsDown className="h-3.5 w-3.5" />
                      )}
                      {vote.direction}
                    </Badge>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-muted">
                      {vote.weight} {vote.weight === 1 ? "point" : "points"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* SUBSCRIPTION TAB */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Subscription Plan & Status
                  </CardTitle>
                  <CardDescription className="mt-1">
                    View active membership tier and expiration details.
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-sm px-4 py-1.5 self-start sm:self-auto font-semibold">
                  {profile.subscription?.tier || "Free"} Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-xl border bg-muted/30">
                  <span className="text-xs text-muted-foreground font-medium block mb-1">
                    Membership Tier
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {profile.subscription?.tier || "Free"}
                  </span>
                </div>
                <div className="p-4 rounded-xl border bg-muted/30">
                  <span className="text-xs text-muted-foreground font-medium block mb-1">
                    Subscription Status
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {profile.subscription?.status || "Active"}
                  </span>
                </div>
                <div className="p-4 rounded-xl border bg-muted/30">
                  <span className="text-xs text-muted-foreground font-medium block mb-1">
                    Expiration / Renewal
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {profile.subscription?.expiresAt || "August 24, 2026"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Included Plan Benefits
                </h4>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {(
                    profile.subscription?.features || [
                      "Unlimited Idea Publishing",
                      "Community Voting & Discussions",
                      "Market Sentiment Summaries",
                      "Exclusive Analytics Feed",
                    ]
                  ).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 bg-muted/10">
              <p className="text-xs text-muted-foreground">
                Automatic renewal is currently{" "}
                <span className="font-semibold text-foreground">
                  {profile.subscription?.renewsAutomatically !== false ? "Enabled" : "Disabled"}
                </span>
                .
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href={`/${locale}/premium`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto">Upgrade Plan</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
