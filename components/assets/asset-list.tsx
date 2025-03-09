"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/context/wallet-provider"
import { getAssetClasses } from "@/lib/sui"
import { AssetDetails } from "./asset-details"

export function AssetList() {
  const { wallet } = useWallet()
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)
      try {
        const assetClasses = await getAssetClasses()
        setAssets(assetClasses)
      } catch (err: any) {
        setError(err.message || "Failed to load assets")
        console.error("Error fetching assets:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset)
  }

  const handleCloseModal = () => {
    setSelectedAsset(null)
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
        <h1 className="text-3xl font-bold tracking-tight">Investment Assets</h1>
        <p className="text-muted-foreground">Browse and invest in available asset classes</p>
      </div>

      {!wallet && (
        <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-800" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Connect your wallet to invest in these assets</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <Card
            key={asset.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleAssetClick(asset)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{asset.name}</CardTitle>
                <Badge variant="outline" className={getRiskLevelColor(asset.riskLevel)}>
                  {getRiskLevelLabel(asset.riskLevel)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{asset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">{formatSui(asset.pricePerUnit)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Min Investment:</span>
                  <span className="font-medium">{formatSui(asset.minInvestment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium">
                    {asset.availableSupply.toLocaleString()} / {asset.totalSupply.toLocaleString()} units
                  </span>
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

      {selectedAsset && <AssetDetails asset={selectedAsset} onClose={handleCloseModal} />}
    </div>
  )
}

