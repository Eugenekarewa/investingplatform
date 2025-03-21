"use client"

import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { connectToWallet, disconnectWallet, getConnectedWallet } from "@/lib/sui"

interface Wallet {
  address: string
  connected: boolean
}

interface WalletContextType {
  wallet: Wallet | null
  connecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const connectedWallet = await getConnectedWallet()
        if (connectedWallet) {
          setWallet(connectedWallet)
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err)
      }
    }

    if (mounted) {
      checkConnection()
    }
  }, [mounted])

  const connect = async () => {
    if (!mounted) return

    setConnecting(true)
    setError(null)

    try {
      const connectedWallet = await connectToWallet()
      setWallet(connectedWallet)

      // For development mode - store connection state in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("devWalletConnected", "true")
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to connect wallet"
      setError(errorMessage)
      console.error("Wallet connection error:", err)

      // Show a more user-friendly message if the wallet extension is not found
      if (errorMessage.includes("not found")) {
        console.warn(
          "Sui Wallet extension not found. In a production environment, you would need to install the Sui Wallet extension.",
        )
      }
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    if (!mounted) return

    try {
      await disconnectWallet()
      setWallet(null)

      // For development mode - store connection state in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("devWalletConnected", "false")
      }
    } catch (err) {
      console.error("Failed to disconnect wallet:", err)
    }
  }

  const value = {
    wallet,
    connecting,
    error,
    connect,
    disconnect,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

