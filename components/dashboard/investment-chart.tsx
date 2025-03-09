"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the chart
const generateChartData = (days: number, trend: "up" | "down" | "volatile") => {
  const data = []
  let value = 1000

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    // Generate random change based on trend
    let change = 0
    if (trend === "up") {
      change = Math.random() * 50 - 10 // Mostly positive
    } else if (trend === "down") {
      change = Math.random() * 50 - 40 // Mostly negative
    } else {
      change = Math.random() * 80 - 40 // Volatile
    }

    value = Math.max(value + change, 100) // Ensure value doesn't go below 100

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value),
    })
  }

  return data
}

export function InvestmentChart() {
  const [period, setPeriod] = useState("1m")

  // Generate different data based on selected period
  const chartData = {
    "7d": generateChartData(7, "up"),
    "1m": generateChartData(30, "volatile"),
    "3m": generateChartData(90, "up"),
    "1y": generateChartData(365, "up"),
  }

  const selectedData = chartData[period as keyof typeof chartData]

  // Calculate percentage change
  const firstValue = selectedData[0].value
  const lastValue = selectedData[selectedData.length - 1].value
  const percentChange = ((lastValue - firstValue) / firstValue) * 100

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Track your investment growth over time</CardDescription>
        </div>
        <Tabs defaultValue="1m" value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="1m">1m</TabsTrigger>
            <TabsTrigger value="3m">3m</TabsTrigger>
            <TabsTrigger value="1y">1y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">{lastValue.toLocaleString()} SUI</div>
            <div className={`text-sm ${percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentChange >= 0 ? "+" : ""}
              {percentChange.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedData}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    if (period === "7d") {
                      return date.toLocaleDateString(undefined, { weekday: "short" })
                    } else if (period === "1m") {
                      return date.getDate().toString()
                    } else {
                      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                    }
                  }}
                  minTickGap={10}
                />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} width={40} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

