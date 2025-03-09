"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle, Users } from "lucide-react"

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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/context/wallet-provider"
import { contributeToPool } from "@/lib/sui"

interface PoolDetailsProps {
  pool: any
  onClose: () => void
}

export function PoolDetails({ pool, onClose }: PoolDetailsProps) {
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

  const handleContribute = async () => {
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

    if (amountInMist < pool.minContribution) {
      setError(`Minimum contribution is ${formatSui(pool.minContribution)}`)
      return
    }

    const availableCapacity = pool.targetSize - pool.currentSize
    if (amountInMist > availableCapacity) {
      setError(`Maximum contribution is ${formatSui(availableCapacity)}`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await contributeToPool(pool.id, amountInMist)
      setSuccess(true)

      // Close the modal after a delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to complete contribution")
      console.error("Contribution error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{pool.name}</span>
            <Badge variant="outline" className={getRiskLevelColor(pool.riskLevel)}>
              {getRiskLevelLabel(pool.riskLevel)}
            </Badge>
          </DialogTitle>
          <DialogDescription>{pool.description}</DialogDescription>
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
              <AlertDescription>Your contribution was successful.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Funding Progress:</span>
              <span className="font-medium">{Math.round((pool.currentSize / pool.targetSize) * 100)}%</span>
            </div>
            <Progress value={(pool.currentSize / pool.targetSize) * 100} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatSui(pool.currentSize)}</span>
              <span>{formatSui(pool.targetSize)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Min Contribution</p>
              <p className="font-medium">{formatSui(pool.minContribution)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expected Returns</p>
              <p className="font-medium">{(pool.returnsPercentage / 100).toFixed(2)}% annually</p>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Multiple investors pool funds for collective investment</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount (SUI)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in SUI"
              value={amount}
              onChange={handleAmountChange}
              disabled={loading || success || !wallet}
              min={pool.minContribution / 1000000000}
              step={0.01}
            />
            <p className="text-xs text-muted-foreground">
              Available capacity: {formatSui(pool.targetSize - pool.currentSize)}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleContribute} disabled={loading || success || !wallet || !amount}>
            {loading ? "Processing..." : "Contribute Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

