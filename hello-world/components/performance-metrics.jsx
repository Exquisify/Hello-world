"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function PerformanceMetrics({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No performance data available
        </CardContent>
      </Card>
    )
  }

  const getTrend = (index) => {
    if (index === 0) return "neutral"
    const current = data[index]?.views || 0
    const previous = data[index - 1]?.views || 0
    if (current > previous) return "up"
    if (current < previous) return "down"
    return "neutral"
  }

  const getTrendPercentage = (index) => {
    if (index === 0) return 0
    const current = data[index]?.views || 0
    const previous = data[index - 1]?.views || 1
    return ((current - previous) / previous * 100).toFixed(1)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
          <CardDescription>Monthly view count for your ideas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => {
              const trend = getTrend(index)
              const percentage = getTrendPercentage(index)
              const maxViews = Math.max(...data.map(d => d.views || 0))
              const barWidth = maxViews > 0 ? ((item.views || 0) / maxViews * 100) : 0
              
              return (
                <div key={item.month || index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-muted-foreground">{item.month}</div>
                  <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden relative">
                    <div 
                      className="h-full bg-primary transition-all duration-300" 
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-medium">{item.views?.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-16 flex items-center justify-end gap-1">
                    {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {trend === "neutral" && <Minus className="h-4 w-4 text-muted-foreground" />}
                    <span className={`text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                      {index > 0 ? `${percentage}%` : "-"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
