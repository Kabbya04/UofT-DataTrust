"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Activity, Search, RefreshCw, User, Eye, Edit, Download } from "lucide-react"

const currentUserLogs = [
  {
    id: 1,
    action: "You viewed Dataset X",
    date: "Jan 3, 2025",
    time: "2:30 PM",
    type: "View",
    severity: "Info",
  },
  {
    id: 2,
    action: "You created new visualization",
    date: "Dec 31, 2024",
    time: "3:45 PM",
    type: "Create",
    severity: "Info",
  },
  {
    id: 3,
    action: "You downloaded ClimateData.csv",
    date: "Dec 30, 2024",
    time: "1:20 PM",
    type: "Download",
    severity: "Info",
  },
  {
    id: 4,
    action: "You updated profile settings",
    date: "Dec 29, 2024",
    time: "4:15 PM",
    type: "Update",
    severity: "Info",
  },
  {
    id: 5,
    action: "You logged into the system",
    date: "Dec 29, 2024",
    time: "9:00 AM",
    type: "Login",
    severity: "Success",
  },
]


const BasicLogViewing = () => {
   const getActionIcon = (type: string) => {
    switch (type) {
      case "View":
        return <Eye className="h-4 w-4" />
      case "Update":
      case "Create":
        return <Edit className="h-4 w-4" />
      case "Download":
        return <Download className="h-4 w-4" />
      case "Login":
        return <User className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }
  return (
     <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Basic Log Viewing</h1>
          <p className="text-gray-400 dark:text-gray-400 mt-2">View your personal activity history and actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current User Activity
          </CardTitle>
          <CardDescription>Showing activity logs for the currently logged-in user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium ">Current User</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Logged in since Dec 29, 2024</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export My Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Your Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Search your activity logs..." className="w-full" />
        </CardContent>
      </Card>

      {/* Personal Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Activity History</CardTitle>
          <CardDescription>Personal log of your actions and interactions with the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentUserLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                    {getActionIcon(log.type)}
                  </div>
                  <div>
                    <p className="font-medium ">{log.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.date} at {log.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={log.severity === "Success" ? "default" : "outline"}>{log.severity}</Badge>
                  <Badge variant="secondary">{log.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold ">5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your Total Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Data Interactions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Login Sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Overview of your recent system interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-400 rounded-lg">
              <span className="text-sm font-medium">Most Recent Activity</span>
              <span className="text-sm">Viewed Dataset X (Jan 3, 2025)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-400 rounded-lg">
              <span className="text-sm font-medium">Most Common Action</span>
              <span className="text-sm">Data Viewing</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-400 rounded-lg">
              <span className="text-sm font-medium">Last Login</span>
              <span className="text-sm">Dec 29, 2024 at 9:00 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BasicLogViewing