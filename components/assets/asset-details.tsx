"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/context/wallet-provider"
import { investInAsset } from "@/lib/sui"

interface AssetDetailsProps {
  asset: any
  onClose: () => void
}

export function AssetDetails({ asset, onClose }: AssetDetailsProps) {
  const { wallet } = useWallet()
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleInvest = async () => {
    if (!wallet) {
      setError("Wallet not connected")
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Convert to MIST (1 SUI = 1,000,000,000 MIST)
    const amountInMist = Math.floor(amountValue * 1000000000)

    if (amountInMist < asset.minInvestment) {
      setError(`Minimum investment is ${formatSui(asset.minInvestment)}`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await investInAsset(asset.id, amountInMist)
      setSuccess(true)

      // Close the modal after a delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to complete investment")
      console.error("Investment error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{asset.name}</span>
            <Badge variant="outline" className={getRiskLevelColor(asset.riskLevel)}>
              {getRiskLevelLabel(asset.riskLevel)}
            </Badge>
          </DialogTitle>
          <DialogDescription>{asset.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Your investment was successful.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price per Unit</p>
              <p className="font-medium">{formatSui(asset.pricePerUnit)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Min Investment</p>
              <p className="font-medium">{formatSui(asset.minInvestment)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Supply</p>
              <p className="font-medium">{asset.availableSupply.toLocaleString()} units</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Creator Fee</p>
              <p className="font-medium">{(asset.creatorFee / 100).toFixed(2)}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (SUI)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in SUI"
              value={amount}
              onChange={handleAmountChange}
              disabled={loading || success || !wallet}
              min={asset.minInvestment / 1000000000}
              step={0.01}
            />
            <p className="text-xs text-muted-foreground">
              Platform fee: 0.5% + Creator fee: {(asset.creatorFee / 100).toFixed(2)}%
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleInvest} disabled={loading || success || !wallet || !amount}>
            {loading ? "Processing..." : "Invest Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

