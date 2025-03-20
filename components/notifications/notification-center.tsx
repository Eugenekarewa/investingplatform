"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationItem } from "@/components/notifications/notification-item"

// Mock notifications data
const notifications = [
  {
    id: "n1",
    title: "Investment Successful",
    description: "Your investment in Real Estate Fund was successful.",
    date: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    read: false,
    type: "success" as const, // Add type assertion
  },
  {
    id: "n2",
    title: "Pool Contribution",
    description: "Your contribution to Startup Accelerator Pool was processed.",
    date: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
    type: "info" as const, // Add type assertion
  },
  {
    id: "n3",
    title: "Price Alert",
    description: "Tech Stocks price has increased by 5% in the last 24 hours.",
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    read: false,
    type: "alert" as const, // Add type assertion
  },
  {
    id: "n4",
    title: "New Asset Available",
    description: "A new Green Energy Fund is now available for investment.",
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    read: true,
    type: "info" as const, // Add type assertion
  },
]

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [notificationState, setNotificationState] = useState(notifications)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const unreadCount = notificationState.filter((n) => !n.read).length

  const filteredNotifications = notificationState.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return true
  })

  const markAllAsRead = () => {
    setNotificationState((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotificationState((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Notifications</span>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto text-xs px-2 py-1" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="max-h-[300px] overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="unread" className="max-h-[300px] overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No unread notifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
            <a href="/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

