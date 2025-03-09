"use client"

import { useState, useEffect } from "react"
import { ArrowRight, TrendingUp, Shield, Coins, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-provider"

export function HeroSection() {
  const { connect, connecting } = useWallet()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="h-full w-full bg-[radial-gradient(#3182ce_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Invest in your future,
                <span className="block text-primary">one micro step at a time</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Access fractional investments in premium assets on the Sui blockchain. Start building wealth with as
                little as 0.01 SUI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={connect} disabled={connecting || !mounted} className="gap-2">
                {connecting ? "Connecting..." : "Connect Wallet"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Secure & Transparent</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <span className="text-sm">Low Minimum Investment</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm">Diversified Portfolio</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto lg:mx-0 w-full max-w-md">
            <div className="relative z-10 rounded-2xl bg-background/80 backdrop-blur-sm border shadow-xl overflow-hidden">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Portfolio Value</h3>
                    <p className="text-3xl font-bold">2,450.75 SUI</p>
                    <p className="text-sm text-green-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> +12.4% this month
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="h-[200px] w-full bg-gradient-to-b from-primary/5 to-primary/10 relative">
                {/* Simplified chart visualization */}
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <path
                    d="M0,150 C50,120 100,170 150,100 C200,30 250,80 300,50 C350,20 400,50 400,50 L400,200 L0,200 Z"
                    fill="url(#gradient)"
                    opacity="0.3"
                  />
                  <path
                    d="M0,150 C50,120 100,170 150,100 C200,30 250,80 300,50 C350,20 400,50 400,50"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Dots on the chart line */}
                <div className="absolute top-[100px] left-[150px] h-3 w-3 rounded-full bg-primary"></div>
                <div className="absolute top-[50px] left-[300px] h-3 w-3 rounded-full bg-primary"></div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

