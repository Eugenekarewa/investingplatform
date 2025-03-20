"use client"

import { CheckCircle, AlertCircle, Info, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Update the interface to be more explicit about the type
interface NotificationItemProps {
  notification: {
    id: string
    title: string
    description: string
    date: Date
    read: boolean
    type: "success" | "alert" | "info" | "default"
  }
  onMarkAsRead: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
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

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
        !notification.read && "bg-muted/30",
      )}
    >
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.date, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{notification.description}</p>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto mt-1 text-xs px-2 py-1"
            onClick={() => onMarkAsRead(notification.id)}
          >
            Mark as read
          </Button>
        )}
      </div>
    </div>
  )
}

