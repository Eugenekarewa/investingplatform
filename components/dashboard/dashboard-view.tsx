"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, Users, ArrowRight, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/context/wallet-provider"
import { getUserProfile, getUserInvestments } from "@/lib/sui"
import { UserRegistration } from "@/components/profile/user-registration"
import { InvestmentChart } from "@/components/dashboard/investment-chart"
import { AssetAllocation } from "@/components/dashboard/asset-allocation"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { LandingPage } from "@/components/landing/landing-page"

export function DashboardView() {
  const { wallet } = useWallet()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const fetchData = async () => {
      if (wallet?.address) {
        setLoading(true)
        try {
          const profile = await getUserProfile(wallet.address)
          setUserProfile(profile)

          const userInvestments = await getUserInvestments(wallet.address)
          setInvestments(userInvestments)
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    if (mounted && wallet) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [wallet, mounted])

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!wallet) {
    return <LandingPage />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userProfile) {
    return <UserRegistration onSuccess={setUserProfile} />
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalAssets = new Set(investments.map((inv) => inv.assetId)).size

  // Format SUI amount (1 SUI = 1,000,000,000 MIST)
  const formatSui = (amount: number) => {
    return (amount / 1000000000).toFixed(2) + " SUI"
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your investments and portfolio performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSui(totalInvested)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Owned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Profile</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile.riskProfile === 1
                ? "Conservative"
                : userProfile.riskProfile === 2
                  ? "Moderate"
                  : "Aggressive"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Investments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Investments</CardTitle>
                <CardDescription>Your current investment portfolio</CardDescription>
              </div>
              <Link href="/assets" passHref>
                <Button variant="ghost" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {investments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Asset</th>
                        <th className="text-left py-3 px-2">Shares</th>
                        <th className="text-left py-3 px-2">Value</th>
                        <th className="text-left py-3 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map((inv) => (
                        <tr key={inv.id} className="border-b">
                          <td className="py-3 px-2">{inv.assetName}</td>
                          <td className="py-3 px-2">{inv.shares}</td>
                          <td className="py-3 px-2">{formatSui(inv.amount)}</td>
                          <td className="py-3 px-2">{new Date(inv.timestamp).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No investments yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Start your investment journey by exploring available assets.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/assets">Explore Assets</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Asset Allocation */}
          {investments.length > 0 && <AssetAllocation />}

          {/* Recommended Investments */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>
                Based on your risk profile (
                {userProfile.riskProfile === 1
                  ? "Conservative"
                  : userProfile.riskProfile === 2
                    ? "Moderate"
                    : "Aggressive"}
                )
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Real Estate Fund</CardTitle>
                    <CardDescription>Low risk, 8-10% annual returns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Diversified portfolio of commercial and residential properties with stable income.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      Conservative
                    </Badge>
                    <Button variant="outline" asChild>
                      <Link href="/assets">View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tech Startup Pool</CardTitle>
                    <CardDescription>High risk, 15-25% potential returns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Collective investment in early-stage technology startups with high growth potential.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                      Aggressive
                    </Badge>
                    <Button variant="outline" asChild>
                      <Link href="/pools">View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <InvestmentChart />
          <AssetAllocation />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

