"use client"

import { Wallet, TrendingUp, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Link your Sui wallet to access the platform and manage your investments securely.",
    },
    {
      icon: TrendingUp,
      title: "Choose Investments",
      description: "Browse through curated assets and pools that match your risk profile and investment goals.",
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      description: "Monitor your portfolio's performance with real-time analytics and detailed reports.",
    },
  ]

  return (
    <div className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your investment journey in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(100%-16px)] w-[calc(100%-64px)] h-[2px] bg-border">
                  <ArrowRight className="absolute top-[-8px] right-[-12px] h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="bg-background rounded-lg p-8 h-full border hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

