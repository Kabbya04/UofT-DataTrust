"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { FileText, Search, Filter, Download, RefreshCw, User, Database, Eye, Edit } from "lucide-react"

const auditLogs = [
  {
    id: 1,
    action: "User A viewed Dataset X",
    date: "Jan 3, 2025",
    time: "2:30 PM",
    user: "User A",
    type: "View",
    severity: "Info",
  },
  {
    id: 2,
    action: "Dataset Y was updated",
    date: "Jan 2, 2025",
    time: "11:45 AM",
    user: "Admin",
    type: "Update",
    severity: "Warning",
  },
  {
    id: 3,
    action: "User B downloaded ClimateData.csv",
    date: "Jan 2, 2025",
    time: "9:15 AM",
    user: "User B",
    type: "Download",
    severity: "Info",
  },
  {
    id: 4,
    action: "New dataset SalesReport.xlsx uploaded",
    date: "Jan 1, 2025",
    time: "4:20 PM",
    user: "User C",
    type: "Upload",
    severity: "Success",
  },
  {
    id: 5,
    action: "Failed login attempt detected",
    date: "Jan 1, 2025",
    time: "1:10 PM",
    user: "Unknown",
    type: "Security",
    severity: "Error",
  },
  {
    id: 6,
    action: "User A created new visualization",
    date: "Dec 31, 2024",
    time: "3:45 PM",
    user: "User A",
    type: "Create",
    severity: "Info",
  },
]


const AuditLogViewer = () => {
    const getActionIcon = (type: string) => {
    switch (type) {
      case "View":
        return <Eye className="h-4 w-4" />
      case "Update":
      case "Create":
        return <Edit className="h-4 w-4" />
      case "Download":
      case "Upload":
        return <Database className="h-4 w-4" />
      case "Security":
        return <User className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Success":
        return "default"
      case "Warning":
        return "secondary"
      case "Error":
        return "destructive"
      default:
        return "outline"
    }
  }
  return (
     <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold  dark:text-white">Audit Log Viewer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor all system activities and user actions</p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input placeholder="Search logs..." className="w-full" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-users">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-users">All Users</SelectItem>
                <SelectItem value="user-a">User A</SelectItem>
                <SelectItem value="user-b">User B</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Complete audit trail of all system activities and user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => ( 
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-800 dark:hover:bg-gray-400 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full  dark:bg-gray-800">
                    {getActionIcon(log.type)}
                  </div>
                  <div>
                    <p className="font-medium  dark:text-white">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {log.date} at {log.time}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {log.user}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(log.severity)}>{log.severity}</Badge>
                  <Badge variant="secondary">{log.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold  dark:text-white">6</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">4</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Info/Success</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">1</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AuditLogViewer