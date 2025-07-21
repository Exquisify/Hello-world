"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bitcoin, EclipseIcon as Ethereum } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { GradientText } from "@/components/gradient-text"

//mock data for demonstration purposes
const bitcoinData = [
  { name: "Apr", price: 29341 },
  { name: "May", price: 27688 },
  { name: "Jun", price: 30460 },
  { name: "Jul", price: 29800 },
  { name: "Aug", price: 28100 },
  { name: "Sep", price: 26900 },
  { name: "Oct", price: 34500 },
  { name: "Nov", price: 37800 },
  { name: "Dec", price: 42000 },
]

const ethereumData = [
  { name: "Apr", price: 1950 },
  { name: "May", price: 1850 },
  { name: "Jun", price: 1920 },
  { name: "Jul", price: 1880 },
  { name: "Aug", price: 1650 },
  { name: "Sep", price: 1620 },
  { name: "Oct", price: 1780 },
  { name: "Nov", price: 2050 },
  { name: "Dec", price: 2250 },
]

export function MarketOverview() {
  const [activeTab, setActiveTab] = useState("bitcoin")
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg md:text-xl">
          <GradientText>Market Overview</GradientText>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest price movements for top cryptocurrencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bitcoin" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bitcoin" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Bitcoin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Bitcoin</span>
            </TabsTrigger>
            <TabsTrigger value="ethereum" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Ethereum className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Ethereum</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bitcoin" className="pt-2 sm:pt-4">
            <div className="h-[150px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={bitcoinData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: isMobile ? 0 : 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 30 : 40} />
                  <Tooltip contentStyle={{ fontSize: isMobile ? "12px" : "14px" }} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#f7931a"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: isMobile ? 4 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 sm:mt-4 flex justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Current Price</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">$42,000</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">24h Change</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-500">+2.4%</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="ethereum" className="pt-2 sm:pt-4">
            <div className="h-[150px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ethereumData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: isMobile ? 0 : 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 30 : 40} />
                  <Tooltip contentStyle={{ fontSize: isMobile ? "12px" : "14px" }} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#627eea"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: isMobile ? 4 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 sm:mt-4 flex justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Current Price</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">$2,250</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">24h Change</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-500">+3.1%</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
