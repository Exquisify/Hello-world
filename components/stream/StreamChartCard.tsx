"use client"

import React from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

const sampleData = [
  { time: "00:00", value: 10 },
  { time: "04:00", value: 25 },
  { time: "08:00", value: 40 },
  { time: "12:00", value: 30 },
  { time: "16:00", value: 65 },
  { time: "20:00", value: 80 },
]

export default function StreamChartCard() {
  return (
    <div className="h-64 w-full rounded-lg border bg-card p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData}>
          <XAxis dataKey="time" stroke="#888888" fontSize={12} />
          <YAxis stroke="#888888" fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
