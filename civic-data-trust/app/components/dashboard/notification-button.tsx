"use client"

import { Bell, Settings, Truck } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    type: "shipment",
    title: "New Dataset 'Housing Data 2024' has been uploaded by Alex Ryder.",
    time: "Just now",
    timeGroup: "recent",
  },
  {
    id: 2,
    type: "shipment",
    title: "Access request for 'Economic Surveys' was approved for Jane Doe.",
    time: "30 minutes ago",
    timeGroup: "recent",
  },
  {
    id: 3,
    type: "shipment",
    title: "Plugin 'Advanced Geo-Spatial Analyzer' is pending your review.",
    time: "1 hour ago",
    timeGroup: "recent",
  },
  {
    id: 4,
    type: "shipment",
    title: "Terms & Conditions v2.2 has been published by Admin.",
    time: "1 day ago",
    timeGroup: "earlier",
  },
  {
    id: 5,
    type: "shipment",
    title: "Your profile information was successfully updated.",
    time: "1 day ago",
    timeGroup: "earlier",
  },
]

export function NotificationButton() {
  const recentNotifications = notifications.filter((n) => n.timeGroup === "recent")
  const earlierNotifications = notifications.filter((n) => n.timeGroup === "earlier")
  const unreadCount = notifications.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 p-1.5 sm:p-2 hover:bg-gray-100/10 dark:hover:bg-white/10 rounded-full cursor-pointer transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] sm:w-96 border-border/50 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-mono-caps text-foreground">Notifications</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {recentNotifications.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground font-mono mb-3">Last 24 hours</h4>
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary/10 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed font-mono">{notification.title}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {earlierNotifications.length > 0 && (
            <div className="p-4 border-t border-border/30">
              <h4 className="text-sm font-medium text-muted-foreground font-mono mb-3">Earlier</h4>
              <div className="space-y-3">
                {earlierNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary/10 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed font-mono">{notification.title}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-border/30 text-center">
          <button className="text-sm text-primary hover:underline font-medium font-mono">
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}