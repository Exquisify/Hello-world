"use client"

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsChartsProps {
  data: any[]
  type: "performance" | "engagement" | "audience" | "predictions"
}

export function AnalyticsCharts({ data, type }: AnalyticsChartsProps) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>
  }

  const colors = {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    muted: "#6b7280",
  }

  switch (type) {
    case "performance":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke={colors.primary} strokeWidth={2} name="Views" />
            <Line type="monotone" dataKey="votes" stroke={colors.secondary} strokeWidth={2} name="Votes" />
            <Line type="monotone" dataKey="comments" stroke={colors.accent} strokeWidth={2} name="Comments" />
          </LineChart>
        </ResponsiveContainer>
      )

    case "engagement":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="engagementRate"
              stackId="1"
              stroke={colors.primary}
              fill={colors.primary}
              fillOpacity={0.6}
              name="Engagement Rate"
            />
          </AreaChart>
        </ResponsiveContainer>
      )

    case "audience":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(colors)[index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={colors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )

    case "predictions":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accuracy" stroke={colors.secondary} strokeWidth={2} name="Accuracy %" />
            <Line
              type="monotone"
              dataKey="predictions"
              stroke={colors.primary}
              strokeWidth={2}
              name="Total Predictions"
            />
          </LineChart>
        </ResponsiveContainer>
      )

    default:
      return null
  }
}
