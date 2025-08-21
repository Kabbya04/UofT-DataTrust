
"use client"
import React from 'react'
import { useState } from "react"
import { Bell, Search, Filter, Check, X, Clock, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Card, CardContent, CardHeader } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  category: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "System Update Complete",
    message: "Your dashboard has been updated to version 2.1.0 with new features and improvements.",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    category: "system",
  },
  {
    id: "2",
    title: "New Community Member",
    message: "Sarah Johnson has joined the Sustainable Living community.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    category: "community",
  },
  {
    id: "3",
    title: "Data Export Ready",
    message: "Your requested data export for Q4 analytics is ready for download.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true,
    category: "data",
  },
  {
    id: "4",
    title: "Storage Limit Warning",
    message: "You're approaching 85% of your storage limit. Consider upgrading your plan.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
    category: "system",
  },
  {
    id: "5",
    title: "Payment Processed",
    message: "Your monthly subscription payment of $29.99 has been processed successfully.",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    category: "billing",
  },
  {
    id: "6",
    title: "Failed Login Attempt",
    message: "Someone attempted to access your account from an unrecognized device.",
    type: "error",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
    category: "security",
  },
]
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "unread" | "read">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const groupNotificationsByTime = (notifications: Notification[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups = {
      today: [] as Notification[],
      yesterday: [] as Notification[],
      thisWeek: [] as Notification[],
      older: [] as Notification[],
    }

    notifications.forEach((notification) => {
      if (notification.timestamp >= today) {
        groups.today.push(notification)
      } else if (notification.timestamp >= yesterday) {
        groups.yesterday.push(notification)
      } else if (notification.timestamp >= thisWeek) {
        groups.thisWeek.push(notification)
      } else {
        groups.older.push(notification)
      }
    })

    return groups
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "read" && notification.read) ||
      (filterType === "unread" && !notification.read)
    return matchesSearch && matchesFilter
  })

  const groupedNotifications = groupNotificationsByTime(filteredNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null

    return (
      <div key={title} className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground px-1">{title}</h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md cursor-pointer ${!notification.read ? "border-l-4 border-l-primary bg-blue-300 " : ""
                }`}
            >
              <CardContent className={`p-4 ${!notification.read ? " text-black " : ""} `}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium ${!notification.read ? "text-foreground " : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {notification.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ">
                        {!notification.read && (

                          <Check onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }} className=" w-8 h-8 text-green-700" />
                          // <Button
                          //   size="lg"
                          //   variant="ghost"
                          //   onClick={(e) => {
                          //     e.stopPropagation()
                          //     markAsRead(notification.id)
                          //   }}
                          //   className="h-10 w-10 p-0 cursor-pointer border"
                          // >
                          //   <Check className=" w-8 h-8 border text-green-700" />
                          // </Button>



                        )}

                        
                          <X onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }} className="w-8 h-8" />
                        {/* <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notification Center</h1>
              <p className="text-muted-foreground">Stay updated with your latest activities and system updates</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      {filterType === "all" ? "All" : filterType === "read" ? "Read" : "Unread"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterType("all")}>All Notifications</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("unread")}>Unread Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("read")}>Read Only</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} size="sm">
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Notifications */}
        <div className="space-y-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "You're all caught up!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {renderNotificationGroup("Today", groupedNotifications.today)}
              {renderNotificationGroup("Yesterday", groupedNotifications.yesterday)}
              {renderNotificationGroup("This Week", groupedNotifications.thisWeek)}
              {renderNotificationGroup("Older", groupedNotifications.older)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter