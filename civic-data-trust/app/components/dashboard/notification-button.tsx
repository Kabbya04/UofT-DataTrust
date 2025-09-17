"use client"

import { Bell, Settings, MoreHorizontal, Check, Trash2, Flag } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import Image from "next/image"
import { useState } from "react"

const notifications = [
  {
    id: 1,
    type: "follow",
    user: "Jane Doe",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
    message: "followed you.",
    time: "10 min ago",
    isRead: false,
  },
  {
    id: 2,
    type: "follow",
    user: "Jane Doe",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
    message: "followed you.",
    time: "10 min ago",
    isRead: false,
  },
  {
    id: 3,
    type: "follow",
    user: "Jane Doe",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
    message: "followed you.",
    time: "10 min ago",
    isRead: false,
  },
  {
    id: 4,
    type: "follow",
    user: "Jane Doe",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
    message: "followed you.",
    time: "10 min ago",
    isRead: true,
  },
]

export function NotificationButton() {
  const [notificationList, setNotificationList] = useState(notifications)
  const unreadCount = notificationList.filter((n) => !n.isRead).length

  const markAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id))
  }

  const NotificationItem = ({ notification }: { notification: (typeof notifications)[0] }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg">
      <Image
        src={notification.avatar || "/placeholder.svg"}
        alt={notification.user}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm ">
          <span className="font-medium">{notification.user}</span> {notification.message}
        </p>
        <p className="text-xs mt-1">{notification.time}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <button
            onClick={() => markAsRead(notification.id)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <Check className="h-4 w-4" />
            Mark as Read
          </button>
          <button
            onClick={() => deleteNotification(notification.id)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <Flag className="h-4 w-4" />
            Report Issue 
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 p-3 bg-card border border-border hover:border-border rounded-3xl shadow-sm hover:shadow-figma transition-all duration-200">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 border border-border rounded-2xl shadow-figma-card" style={{ backgroundColor: '#F1F1F1', color: 'black' }}>
        <div className="p-4 border-b border-border" style={{ backgroundColor: '#F1F1F1', color: 'black' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'black' }}>Notifications</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Settings className="h-4 w-4" style={{ color: 'black' }} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2" style={{ backgroundColor: '#F1F1F1' }}>
            <TabsTrigger value="all" className="text-xs" style={{ color: 'black' }}>
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs" style={{ color: 'black' }}>
              Unread
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs" style={{ color: 'black' }}>
              Archived
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="max-h-96 overflow-y-auto p-2">
              {notificationList.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <div className="max-h-96 overflow-y-auto p-2">
              {notificationList
                .filter((n) => !n.isRead)
                .map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="mt-0">
            <div className="max-h-96 overflow-y-auto p-2">
              <div className="text-center py-8 ">
                <p className="text-sm">No archived notifications</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}