"use client"

import { useState } from "react"
import { ArrowDownUp, ArrowUpRight, ArrowDownRight, Search } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for transactions
const transactions = [
  {
    id: "tx1",
    type: "investment",
    asset: "Real Estate Fund",
    amount: 1000000000, // 1 SUI
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    id: "tx2",
    type: "contribution",
    asset: "Startup Accelerator Pool",
    amount: 500000000, // 0.5 SUI
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
  {
    id: "tx3",
    type: "investment",
    asset: "Tech Stocks",
    amount: 750000000, // 0.75 SUI
    date: new Date(Date.now() - 86400000 * 10), // 10 days ago
  },
  {
    id: "tx4",
    type: "withdrawal",
    asset: "Conservative Bond Fund",
    amount: 250000000, // 0.25 SUI
    date: new Date(Date.now() - 86400000 * 15), // 15 days ago
  },
  {
    id: "tx5",
    type: "investment",
    asset: "Conservative Bond Fund",
    amount: 1250000000, // 1.25 SUI
    date: new Date(Date.now() - 86400000 * 20), // 20 days ago
  },
]

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Format SUI amount (1 SUI = 1,000,000,000 MIST)
  const formatSui = (amount: number) => {
    return (amount / 1000000000).toFixed(2) + " SUI"
  }

  // Filter transactions based on search term and filter
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.asset.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || tx.type === filter
    return matchesSearch && matchesFilter
  })

  // Get icon based on transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case "contribution":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />
      default:
        return <ArrowDownUp className="h-4 w-4" />
    }
  }

  // Get badge based on transaction type
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "investment":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Investment
          </Badge>
        )
      case "withdrawal":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Withdrawal
          </Badge>
        )
      case "contribution":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Contribution
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent investment activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="investment">Investments</SelectItem>
              <SelectItem value="contribution">Contributions</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full p-2 bg-muted">{getTransactionIcon(tx.type)}</div>
                  <div>
                    <div className="font-medium">{tx.asset}</div>
                    <div className="text-sm text-muted-foreground">
                      {tx.date.toLocaleDateString()} •{" "}
                      {tx.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-medium">{formatSui(tx.amount)}</div>
                  {getTransactionBadge(tx.type)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">No transactions found</div>
          )}

          {filteredTransactions.length > 0 && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm">
                View All Transactions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

