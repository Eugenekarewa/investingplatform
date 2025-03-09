"use client"

import { useState } from "react"
import { AlertCircle, Settings, Plus } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-provider"
import { CreateAssetForm } from "./create-asset-form"
import { CreatePoolForm } from "./create-pool-form"

export function AdminPanel() {
  const { wallet } = useWallet()
  const [isAdmin, setIsAdmin] = useState(false) // In a real app, this would be verified on-chain
  const [showCreateAsset, setShowCreateAsset] = useState(false)
  const [showCreatePool, setShowCreatePool] = useState(false)

  // For demo purposes, we'll assume the connected wallet is an admin
  // In a real app, this would check if the wallet has the AdminCap
  const checkAdminStatus = () => {
    if (wallet) {
      setIsAdmin(true)
    }
  }

  if (!wallet) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Wallet not connected</AlertTitle>
        <AlertDescription>Please connect your wallet to access the admin panel.</AlertDescription>
      </Alert>
    )
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Platform management for administrators</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You need admin privileges to access this section</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This section is restricted to platform administrators. If you are an admin, please verify your status.
            </p>
            <Button onClick={checkAdminStatus}>Verify Admin Status</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Platform management for administrators</p>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="pools">Pools</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Assets</h2>
            <Button onClick={() => setShowCreateAsset(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Asset
            </Button>
          </div>

          {showCreateAsset ? (
            <CreateAssetForm onCancel={() => setShowCreateAsset(false)} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Asset Management</CardTitle>
                <CardDescription>Create and manage investment assets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No assets have been created yet. Click "Create Asset" to add a new investment asset.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pools" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Pools</h2>
            <Button onClick={() => setShowCreatePool(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Pool
            </Button>
          </div>

          {showCreatePool ? (
            <CreatePoolForm onCancel={() => setShowCreatePool(false)} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pool Management</CardTitle>
                <CardDescription>Create and manage investment pools</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No pools have been created yet. Click "Create Pool" to add a new investment pool.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Platform Fee</h3>
                    <p className="text-sm text-muted-foreground">Current fee: 0.5%</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Update
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Admin Capabilities</h3>
                    <p className="text-sm text-muted-foreground">Manage admin access</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" /> Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

