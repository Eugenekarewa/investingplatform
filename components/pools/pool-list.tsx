"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/context/wallet-provider"
import { getInvestmentPools } from "@/lib/sui"
import { PoolDetails } from "./pool-details"

export function PoolList() {
  const { wallet } = useWallet()
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPool, setSelectedPool] = useState<any>(null)

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true)
      try {
        const investmentPools = await getInvestmentPools()
        setPools(investmentPools)
      } catch (err: any) {
        setError(err.message || "Failed to load investment pools")
        console.error("Error fetching pools:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPools()
  }, [])

  const handlePoolClick = (pool: any) => {
    setSelectedPool(pool)
  }

  const handleCloseModal = () => {
    setSelectedPool(null)
  }

  // Format SUI amount (1 SUI = 1,000,000,000 MIST)
  const formatSui = (amount: number) => {
    return (amount / 1000000000).toFixed(2) + " SUI"
  }

  const getRiskLevelLabel = (level: number) => {
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

  const getRiskLevelColor = (level: number) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Pools</h1>
        <p className="text-muted-foreground">Join collective investment pools with other investors</p>
      </div>

      {!wallet && (
        <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-800" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Connect your wallet to contribute to these pools</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pools.map((pool) => (
          <Card
            key={pool.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handlePoolClick(pool)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{pool.name}</CardTitle>
                <Badge variant="outline" className={getRiskLevelColor(pool.riskLevel)}>
                  {getRiskLevelLabel(pool.riskLevel)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{pool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Size:</span>
                    <span className="font-medium">{formatSui(pool.targetSize)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Size:</span>
                    <span className="font-medium">{formatSui(pool.currentSize)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Min Contribution:</span>
                    <span className="font-medium">{formatSui(pool.minContribution)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected Returns:</span>
                    <span className="font-medium">{(pool.returnsPercentage / 100).toFixed(2)}% annually</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Funding Progress:</span>
                    <span className="font-medium">{Math.round((pool.currentSize / pool.targetSize) * 100)}%</span>
                  </div>
                  <Progress value={(pool.currentSize / pool.targetSize) * 100} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!wallet}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPool && <PoolDetails pool={selectedPool} onClose={handleCloseModal} />}
    </div>
  )
}

