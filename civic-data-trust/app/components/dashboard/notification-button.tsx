"use client"

import { Bell, Gear, DotsThree, Check, Trash, Flag } from "phosphor-react"
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
    <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg">
      <Image
        src={notification.avatar || "/placeholder.svg"}
        alt={notification.user}
        width={40}
        height={40}
        className="rounded-full "
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          <span className="font-medium">{notification.user}</span> {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            <DotsThree className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 border border-border rounded-xl shadow-figma">
          <button
            onClick={() => markAsRead(notification.id)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded"
          >
            <Check className="h-4 w-4" />
            Mark as Read
          </button>
          <button
            onClick={() => deleteNotification(notification.id)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded"
          >
            <Trash className="h-4 w-4" />
            Delete
          </button>
          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-foreground hover:bg-accent rounded">
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
      <DropdownMenuContent align="end" className="w-96 p-0 border border-border rounded-2xl shadow-figma-card bg-popover text-popover-foreground">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Gear className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">
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
                <p className="text-sm text-muted-foreground">No archived notifications</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}