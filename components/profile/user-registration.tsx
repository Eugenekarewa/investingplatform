"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/context/wallet-provider"
import { registerUser } from "@/lib/sui"

export function UserRegistration({ onSuccess }: { onSuccess: (profile: any) => void }) {
  const { wallet } = useWallet()
  const [riskProfile, setRiskProfile] = useState<number>(2) // Default to moderate
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet) {
      setError("Wallet not connected")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await registerUser(riskProfile)
      setSuccess(true)

      // Create a profile object to pass back
      const newProfile = {
        user: wallet.address,
        riskProfile,
        creditScore: 500, // Default starting value
        totalInvested: 0,
      }

      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess(newProfile)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to register user profile")
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
        <CardDescription>Set up your investment profile to start using the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Your profile has been created successfully.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Select your risk profile</h3>
              <RadioGroup
                value={riskProfile.toString()}
                onValueChange={(value) => setRiskProfile(Number.parseInt(value))}
                className="space-y-3"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="1" id="conservative" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="conservative" className="font-medium">
                      Conservative
                    </Label>
                    <p className="text-sm text-muted-foreground">Lower risk, stable returns (5-8% annually)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="2" id="moderate" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="moderate" className="font-medium">
                      Moderate
                    </Label>
                    <p className="text-sm text-muted-foreground">Balanced risk and return profile (8-15% annually)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="3" id="aggressive" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="aggressive" className="font-medium">
                      Aggressive
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Higher risk, potential for higher returns (15%+ annually)
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading || success} className="w-full">
          {loading ? "Creating Profile..." : "Create Profile"}
        </Button>
      </CardFooter>
    </Card>
  )
}

