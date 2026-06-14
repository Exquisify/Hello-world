"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { MessageCircle, Share2 } from "lucide-react"

export function EngagementTrends({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No engagement data available
        </CardContent>
      </Card>
    )
  }

  const maxComments = Math.max(...data.map(d => d.comments || 0))
  const maxShares = Math.max(...data.map(d => d.shares || 0))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Engagement</CardTitle>
          <CardDescription>Comments and shares by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Comments Chart */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Comments</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {data.map((item, index) => (
                  <div key={item.day || index} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t-md transition-all duration-300"
                      style={{ 
                        height: maxComments > 0 ? `${(item.comments || 0) / maxComments * 100}%` : '0%'
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{item.day}</span>
                    <span className="text-xs font-medium">{item.comments || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shares Chart */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="h-4 w-4" />
                <span className="text-sm font-medium">Shares</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {data.map((item, index) => (
                  <div key={item.day || index} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-green-500 rounded-t-md transition-all duration-300"
                      style={{ 
                        height: maxShares > 0 ? `${(item.shares || 0) / maxShares * 100}%` : '0%'
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{item.day}</span>
                    <span className="text-xs font-medium">{item.shares || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.reduce((sum, item) => sum + (item.comments || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.reduce((sum, item) => sum + (item.shares || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
