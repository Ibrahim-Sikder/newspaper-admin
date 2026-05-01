"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Cell, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "framer-motion"

interface EngagementData {
  category: string
  comments: number
  shares: number
}

interface EngagementChartProps {
  data: EngagementData[]
}

export function EngagementChart({ data }: EngagementChartProps) {
  const [chartData, setChartData] = useState<EngagementData[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Animation effect for data loading
  useEffect(() => {
    // Start with zero values
    const initialData = data.map((item) => ({
      ...item,
      comments: 0,
      shares: 0,
    }))

    setChartData(initialData)

    // Animate to actual values
    const timer = setTimeout(() => {
      setChartData(data)
    }, 500)

    return () => clearTimeout(timer)
  }, [data])

  // Custom colors for bars
  const commentColors = ["#8884d8", "#9c88e3", "#b08cee", "#c490f9", "#d894ff"]
  const shareColors = ["#82ca9d", "#7ad1a5", "#72d8ad", "#6adfb5", "#62e6bd"]

  // Handle bar hover
  const handleMouseEnter = (index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ChartContainer
        config={{
          comments: {
            label: "Comments",
            color: "hsl(var(--chart-1))",
          },
          shares: {
            label: "Shares",
            color: "hsl(var(--chart-2))",
          },
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]"></div>
                <span className="text-sm font-medium">Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
                <span className="text-sm font-medium">Shares</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Total Engagement: {chartData.reduce((sum, item) => sum + item.comments + item.shares, 0)}
            </div>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
                barGap={8}
                barSize={32}
              >
                <defs>
                  <linearGradient id="commentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="shareGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                  </linearGradient>
                  <filter id="shadow" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.1" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--foreground)", fontSize: 12 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--foreground)", fontSize: 12 }} dx={-10} />
                <ChartTooltip cursor={{ fill: "var(--muted)", opacity: 0.1 }} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="comments"
                  fill="url(#commentGradient)"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(data, index) => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  animationDuration={1500}
                  filter="url(#shadow)"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`comments-${index}`}
                      fill={activeIndex === index ? commentColors[0] : `url(#commentGradient)`}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                    />
                  ))}
                  <LabelList
                    dataKey="comments"
                    position="top"
                    fill="var(--foreground)"
                    fontSize={11}
                    formatter={(value: number) => (value > 0 ? value : "")}
                  />
                </Bar>
                <Bar
                  dataKey="shares"
                  fill="url(#shareGradient)"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(data, index) => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  animationDuration={1500}
                  filter="url(#shadow)"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`shares-${index}`}
                      fill={activeIndex === index ? shareColors[0] : `url(#shareGradient)`}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                    />
                  ))}
                  <LabelList
                    dataKey="shares"
                    position="top"
                    fill="var(--foreground)"
                    fontSize={11}
                    formatter={(value: number) => (value > 0 ? value : "")}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {chartData.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`p-3 rounded-lg border ${activeIndex === index ? "bg-muted border-primary" : "bg-card border-border"}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="text-sm font-medium mb-1">{item.category}</div>
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--chart-1))]"></div>
                    <span>{item.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--chart-2))]"></div>
                    <span>{item.shares}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ChartContainer>
    </motion.div>
  )
}

