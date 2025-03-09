"use client"

import { useState, useEffect } from "react"
import { User, CreditCard, TrendingUp, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/context/wallet-provider"
import { getUserProfile, getUserInvestments } from "@/lib/sui"
import { UserRegistration } from "./user-registration"

export function UserProfile() {
  const { wallet } = useWallet()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    fetchData()
  }, [wallet])

  if (!wallet) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Wallet not connected</AlertTitle>
        <AlertDescription>Please connect your wallet to view your profile.</AlertDescription>
      </Alert>
    )
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

  // Format SUI amount (1 SUI = 1,000,000,000 MIST)
  const formatSui = (amount: number) => {
    return (amount / 1000000000).toFixed(2) + " SUI"
  }

  const getRiskProfileLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Conservative"
      case 2:
        return "Moderate"
      case 3:
        return "Aggressive"
      default:
        return "Unknown"
    }
  }

  const getRiskProfileColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-50 text-green-700 hover:bg-green-50"
      case 2:
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
      case 3:
        return "bg-red-50 text-red-700 hover:bg-red-50"
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your investment profile and view your portfolio</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs truncate">{wallet.address}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Profile</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{getRiskProfileLabel(userProfile.riskProfile)}</div>
                <Badge variant="outline" className={getRiskProfileColor(userProfile.riskProfile)}>
                  Level {userProfile.riskProfile}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProfile.creditScore}</div>
                <p className="text-xs text-muted-foreground">Out of 1000</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
              <CardDescription>Overview of your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invested:</span>
                  <span className="font-medium">{formatSui(userProfile.totalInvested)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Assets:</span>
                  <span className="font-medium">{investments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Created:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()} {/* This would come from blockchain data */}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Investments</CardTitle>
              <CardDescription>All assets in your portfolio</CardDescription>
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
                    <a href="/assets">Explore Assets</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your investment preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Risk Profile</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getRiskProfileColor(userProfile.riskProfile)}>
                      {getRiskProfileLabel(userProfile.riskProfile)}
                    </Badge>
                    <Button variant="outline" size="sm" disabled>
                      Change (Coming Soon)
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Changing your risk profile requires on-chain transaction
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Notification Settings</h3>
                  <p className="text-muted-foreground">
                    Notification preferences will be available in a future update.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

