"use client"

import { Building, Users, TrendingUp, Shield, Coins, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Building,
      title: "Real Estate",
      description: "Invest in premium properties without the high capital requirements of traditional real estate.",
    },
    {
      icon: TrendingUp,
      title: "Growth Stocks",
      description: "Access high-growth technology companies and emerging market opportunities.",
    },
    {
      icon: Shield,
      title: "Conservative Bonds",
      description: "Stable, low-risk investments with predictable returns for capital preservation.",
    },
    {
      icon: Users,
      title: "Investment Pools",
      description: "Join forces with other investors to access opportunities with higher minimum investments.",
    },
    {
      icon: Coins,
      title: "Micro Investments",
      description: "Start with as little as 0.01 SUI and gradually build your portfolio over time.",
    },
    {
      icon: BarChart3,
      title: "Portfolio Analytics",
      description: "Track performance with detailed analytics and visualizations of your investments.",
    },
  ]

  return (
    <div className="py-20 bg-background" id="how-it-works">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Diversify Your Portfolio</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform offers a wide range of investment opportunities across different asset classes, risk profiles,
            and minimum investment requirements.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-background hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

