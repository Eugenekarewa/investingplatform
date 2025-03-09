"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CreateAssetFormProps {
  onCancel: () => void
}

export function CreateAssetForm({ onCancel }: CreateAssetFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "2",
    totalSupply: "",
    pricePerUnit: "",
    minInvestment: "",
    creatorFee: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRiskLevelChange = (value: string) => {
    setFormData((prev) => ({ ...prev, riskLevel: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call a function to create the asset on-chain
      console.log("Creating asset:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)

      // Reset form after success
      setTimeout(() => {
        onCancel()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to create asset")
      console.error("Asset creation error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Asset</CardTitle>
        <CardDescription>Add a new investment asset to the platform</CardDescription>
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
            <AlertDescription>Asset has been created successfully.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Risk Level</Label>
            <RadioGroup value={formData.riskLevel} onValueChange={handleRiskLevelChange} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="conservative" />
                <Label htmlFor="conservative">Conservative</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="moderate" />
                <Label htmlFor="moderate">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="aggressive" />
                <Label htmlFor="aggressive">Aggressive</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalSupply">Total Supply</Label>
              <Input
                id="totalSupply"
                name="totalSupply"
                type="number"
                value={formData.totalSupply}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerUnit">Price Per Unit (SUI)</Label>
              <Input
                id="pricePerUnit"
                name="pricePerUnit"
                type="number"
                step="0.000000001"
                value={formData.pricePerUnit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minInvestment">Min Investment (SUI)</Label>
              <Input
                id="minInvestment"
                name="minInvestment"
                type="number"
                step="0.000000001"
                value={formData.minInvestment}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creatorFee">Creator Fee (%)</Label>
              <Input
                id="creatorFee"
                name="creatorFee"
                type="number"
                step="0.01"
                max="10"
                value={formData.creatorFee}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">Max 10%</p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading || success}>
          {loading ? "Creating..." : "Create Asset"}
        </Button>
      </CardFooter>
    </Card>
  )
}

