"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AnalyticsCharts } from "./analytics-charts"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { EngagementTrends } from "@/components/engagement-trends"
import { useAnalytics } from "@/hooks/use-analytics"
import { GradientText } from "@/components/gradient-text"
import { Eye, MessageSquare, Heart, Users } from "lucide-react"

export function AnalyticsDashboard() {
  const { analytics, loading, error, refreshAnalytics } = useAnalytics()

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load analytics data</p>
          <button onClick={refreshAnalytics} className="mt-2 text-primary hover:underline">
            Try again
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          <GradientText>Analytics Dashboard</GradientText>
        </h1>
        <button onClick={refreshAnalytics} className="text-sm text-muted-foreground hover:text-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.viewsGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.votesGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalComments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.commentsGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalFollowers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.followersGrowth}% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics data={analytics?.performance} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementTrends data={analytics?.engagement} />
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Understanding your audience demographics and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts data={analytics?.audience} type="audience" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy</CardTitle>
              <CardDescription>Track the accuracy of your market predictions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts data={analytics?.predictions} type="predictions" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
