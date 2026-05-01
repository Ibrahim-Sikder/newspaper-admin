"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ContentCategoryData {
  name: string
  value: number
}

interface ContentCategoriesChartProps {
  data: ContentCategoryData[]
}

interface ChartConfig {
  [key: string]: { label: string; color: string }
}

export function ContentCategoriesChart({ data }: ContentCategoriesChartProps) {
  // Define the chartConfig object with a proper type
  const chartConfig: ChartConfig = data.reduce<ChartConfig>((config, category, index) => {
    config[category.name.toLowerCase()] = {
      label: category.name,
      color: `hsl(${index * 40}, 70%, 50%)`,
    }
    return config
  }, {} as ChartConfig) // <-- Explicitly specify the type of initial value

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 50%)`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
