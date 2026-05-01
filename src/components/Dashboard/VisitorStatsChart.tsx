"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface VisitorStatsData {
  name: string
  visitors: number
  pageViews: number
}

interface VisitorStatsChartProps {
  data: VisitorStatsData[]
}

export function VisitorStatsChart({ data }: VisitorStatsChartProps) {
  return (
    <ChartContainer
      config={{
        visitors: {
          label: "Visitors",
          color: "hsl(var(--chart-1))",
        },
        pageViews: {
          label: "Page Views",
          color: "hsl(var(--chart-2))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="visitors"
            stackId="1"
            stroke="var(--color-visitors)"
            fill="var(--color-visitors)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            stackId="2"
            stroke="var(--color-pageViews)"
            fill="var(--color-pageViews)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

