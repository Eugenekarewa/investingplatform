"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Info, Bell, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock notifications data
const notifications = [
  {
    id: "n1",
    title: "Investment Successful",
    description: "Your investment in Real Estate Fund was successful.",
    date: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    read: false,
    type: "success",
  },
  {
    id: "n2",
    title: "Pool Contribution",
    description: "Your contribution to Startup Accelerator Pool was processed.",
    date: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
    type: "info",
  },
  {
    id: "n3",
    title: "Price Alert",
    description: "Tech Stocks price has increased by 5% in the last 24 hours.",
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    read: false,
    type: "alert",
  },
  {
    id: "n4",
    title: "New Asset Available",
    description: "A new Green Energy Fund is now available for investment.",
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    read: true,
    type: "info",
  },
  {
    id: "n5",
    title: "Investment Opportunity",
    description: "New investment opportunity matching your risk profile is available.",
    date: new Date(Date.now() - 86400000 * 4), // 4 days ago
    read: true,
    type: "info",
  },
  {
    id: "n6",
    title: "Withdrawal Processed",
    description: "Your withdrawal request has been processed successfully.",
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    read: true,
    type: "success",
  },
  {
    id: "n7",
    title: "Pool Funding Complete",
    description: "The Startup Accelerator Pool has reached its funding goal.",
    date: new Date(Date.now() - 86400000 * 6), // 6 days ago
    read: true,
    type: "success",
  },
  {
    id: "n8",
    title: "Risk Profile Update",
    description: "Your risk profile has been updated to Moderate.",
    date: new Date(Date.now() - 86400000 * 7), // 7 days ago
    read: true,
    type: "info",
  },
]

export function NotificationsView() {
  const [notificationState, setNotificationState] = useState(notifications)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const markAllAsRead = () => {
    setNotificationState((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotificationState((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const filteredNotifications = notificationState.filter((notification) => {
    // Filter by tab
    if (activeTab === "unread" && notification.read) return false

    // Filter by search term
    if (
      searchTerm &&
      !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false

    return true
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Success
          </Badge>
        )
      case "alert":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Alert
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Info
          </Badge>
        )
      default:
        return <Badge variant="outline">Default</Badge>
    }
  }

  const unreadCount = notificationState.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with your investment activities</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>
                You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg ${!notification.read ? "bg-muted/30" : ""}`}
                  >
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(notification.type)}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.date, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto text-xs px-2 py-1"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm || typeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "You don't have any notifications yet"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(notification.type)}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.date, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto text-xs px-2 py-1"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">You don't have any unread notifications</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

