// Sui blockchain interaction service

declare global {
  interface Window {
    suiWallet?: {
      requestPermissions: () => Promise<any>
      getAccounts: () => Promise<string[]>
      signAndExecuteTransactionBlock: (params: any) => Promise<any>
      disconnect?: () => Promise<void>
    }
  }
}

// Import from the correct modules in the latest Sui SDK
import { SuiClient } from "@mysten/sui.js/client"
import { TransactionBlock } from "@mysten/sui.js/transactions"

// Configuration
const SUI_NETWORK = "https://fullnode.devnet.sui.io" // Change as needed
const PACKAGE_ID = "" // Update with your deployed package ID
const PLATFORM_ID = "" // Update with your platform object ID

// Initialize client
const suiClient = new SuiClient({ url: SUI_NETWORK })

// Wallet connection
// Update the connectToWallet function to handle the case when the wallet extension is not available
export async function connectToWallet() {
  if (typeof window === "undefined") {
    throw new Error("Cannot connect to wallet on server side")
  }

  // Check for different wallet providers - Sui wallet might be available under different properties
  const walletProvider = window.suiWallet || (window as any).sui || (window as any).suiWallet || (window as any).wallet

  if (!walletProvider) {
    console.error("No Sui wallet provider found in window object:", window)
    throw new Error("Sui Wallet extension not found. Please install the Sui Wallet extension and refresh the page.")
  }

  try {
    // Try different methods of connecting based on wallet provider implementation
    let response
    if (walletProvider.requestPermissions) {
      response = await walletProvider.requestPermissions()
    } else if (walletProvider.connect) {
      response = await walletProvider.connect()
    } else {
      throw new Error("Wallet provider does not support connection methods")
    }

    // Get accounts using available method
    let accounts
    if (walletProvider.getAccounts) {
      accounts = await walletProvider.getAccounts()
    } else if (walletProvider.getAddress) {
      const address = await walletProvider.getAddress()
      accounts = address ? [address] : []
    } else {
      throw new Error("Cannot retrieve wallet accounts")
    }

    if (accounts && accounts.length > 0) {
      return {
        address: accounts[0],
        connected: true,
      }
    }
    throw new Error("No accounts found")
  } catch (error) {
    console.error("Error connecting to wallet:", error)
    throw error
  }
}

// Also update the getConnectedWallet function for consistency
export async function getConnectedWallet() {
  if (typeof window === "undefined") {
    return null
  }

  // Check for different wallet providers
  const walletProvider = window.suiWallet || (window as any).sui || (window as any).suiWallet || (window as any).wallet

  if (!walletProvider) {
    return null
  }

  try {
    // Get accounts using available method
    let accounts
    if (walletProvider.getAccounts) {
      accounts = await walletProvider.getAccounts()
    } else if (walletProvider.getAddress) {
      const address = await walletProvider.getAddress()
      accounts = address ? [address] : []
    } else {
      return null
    }

    if (accounts && accounts.length > 0) {
      return {
        address: accounts[0],
        connected: true,
      }
    }
    return null
  } catch (error) {
    console.error("Error getting connected wallet:", error)
    return null
  }
}

// Update the disconnectWallet function as well
export async function disconnectWallet() {
  if (typeof window !== "undefined") {
    // Check for different wallet providers
    const walletProvider =
      window.suiWallet || (window as any).sui || (window as any).suiWallet || (window as any).wallet

    if (walletProvider) {
      // Try different disconnect methods
      if (walletProvider.disconnect) {
        await walletProvider.disconnect()
      } else if (walletProvider.signOut) {
        await walletProvider.signOut()
      }
      return true
    }
  }
  return false
}

// Contract Interactions
export async function registerUser(riskProfile: number) {
  if (typeof window === "undefined" || !window.suiWallet) {
    throw new Error("Wallet not connected")
  }

  const txb = new TransactionBlock()
  txb.moveCall({
    target: `${PACKAGE_ID}::core::register_user`,
    arguments: [txb.pure(riskProfile)],
  })

  return executeTransaction(txb)
}

export async function investInAsset(assetId: string, amount: number) {
  if (typeof window === "undefined" || !window.suiWallet) {
    throw new Error("Wallet not connected")
  }

  const txb = new TransactionBlock()
  // You'll need to get the asset and platform objects
  const asset = txb.object(assetId)
  const platform = txb.object(PLATFORM_ID)

  // Create a coin with the specified amount
  const coin = txb.splitCoins(txb.gas, [txb.pure(amount)])

  txb.moveCall({
    target: `${PACKAGE_ID}::core::invest_in_asset`,
    arguments: [asset, coin, platform],
  })

  return executeTransaction(txb)
}

export async function contributeToPool(poolId: string, amount: number) {
  if (typeof window === "undefined" || !window.suiWallet) {
    throw new Error("Wallet not connected")
  }

  const txb = new TransactionBlock()
  const pool = txb.object(poolId)
  const coin = txb.splitCoins(txb.gas, [txb.pure(amount)])

  txb.moveCall({
    target: `${PACKAGE_ID}::core::contribute_to_pool`,
    arguments: [pool, coin],
  })

  return executeTransaction(txb)
}

// Helper to execute transactions
async function executeTransaction(txb: any) {
  try {
    const result = await window.suiWallet.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showEvents: true,
      },
    })

    return {
      success: true,
      digest: result.digest,
      status: result.effects?.status?.status,
      events: result.events || [],
    }
  } catch (error) {
    console.error("Transaction execution error:", error)
    throw error
  }
}

// Query functions - In a real app, these would query the blockchain
// For now, we'll use mock data

export async function getAssetClasses() {
  // Mock data for development
  return [
    {
      id: "0x123",
      name: "Real Estate Fund",
      description: "Diversified real estate investments across commercial properties",
      riskLevel: 2,
      totalSupply: 100000,
      availableSupply: 75000,
      pricePerUnit: 1000000, // 1 SUI = 1,000,000,000 MIST
      minInvestment: 1000000,
      creatorFee: 100, // 1%
      isActive: true,
    },
    {
      id: "0x456",
      name: "Tech Stocks",
      description: "Curated portfolio of high-growth technology companies",
      riskLevel: 3,
      totalSupply: 50000,
      availableSupply: 30000,
      pricePerUnit: 500000,
      minInvestment: 500000,
      creatorFee: 150, // 1.5%
      isActive: true,
    },
    {
      id: "0x789",
      name: "Conservative Bond Fund",
      description: "Low-risk bonds and fixed income securities",
      riskLevel: 1,
      totalSupply: 200000,
      availableSupply: 180000,
      pricePerUnit: 250000,
      minInvestment: 250000,
      creatorFee: 50, // 0.5%
      isActive: true,
    },
  ]
}

export async function getInvestmentPools() {
  // Mock data for development
  return [
    {
      id: "0xabc",
      name: "Startup Accelerator Pool",
      description: "Collective investment in early-stage startups",
      riskLevel: 3,
      targetSize: 10000000000,
      currentSize: 2500000000,
      minContribution: 100000000,
      returnsPercentage: 2000, // 20%
      isActive: true,
    },
    {
      id: "0xdef",
      name: "Green Energy Fund",
      description: "Investments in sustainable energy projects",
      riskLevel: 2,
      targetSize: 5000000000,
      currentSize: 1000000000,
      minContribution: 50000000,
      returnsPercentage: 1200, // 12%
      isActive: true,
    },
  ]
}

export async function getUserProfile(address: string) {
  // Mock data for development
  return {
    user: address,
    riskProfile: 2,
    creditScore: 750,
    totalInvested: 1500000000,
  }
}

export async function getUserInvestments(address: string) {
  // Mock data for development
  return [
    {
      id: "0x111",
      assetId: "0x123",
      assetName: "Real Estate Fund",
      shares: 10,
      amount: 1000000000,
      timestamp: Date.now() - 86400000 * 30, // 30 days ago
    },
    {
      id: "0x222",
      assetId: "0x456",
      assetName: "Tech Stocks",
      shares: 5,
      amount: 500000000,
      timestamp: Date.now() - 86400000 * 15, // 15 days ago
    },
  ]
}

