"use client"

import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Search, Database, Calendar, HardDrive } from "lucide-react"

const mockDatasets = [
  {
    id: 1,
    name: "ClimateData.csv",
    uploadDate: "Jan 1, 2025",
    fileSize: "1.2 MB",
    status: "Active",
  },
  {
    id: 2,
    name: "UserBehavior.json",
    uploadDate: "Dec 28, 2024",
    fileSize: "3.4 MB",
    status: "Processing",
  },
  {
    id: 3,
    name: "SalesReport.xlsx",
    uploadDate: "Dec 25, 2024",
    fileSize: "856 KB",
    status: "Active",
  },
  {
    id: 4,
    name: "CustomerFeedback.csv",
    uploadDate: "Dec 22, 2024",
    fileSize: "2.1 MB",
    status: "Active",
  },
  {
    id: 5,
    name: "InventoryData.json",
    uploadDate: "Dec 20, 2024",
    fileSize: "4.7 MB",
    status: "Error",
  },
]

const CommunityDataViewer = () => {
  return (
        <div className="container mx-auto  p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">Community Data Viewer</h1>
          <p className="text-gray-500 font-medium">View and manage community datasets and files</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border border-primary ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Datasets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input placeholder="Search by dataset name..." className="w-full bg-primary/20 border border-primary" />
            </div>
            <Button variant="outline" className=" bg-primary hover:border-primary hover:text-primary">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className=" border border-primary">
        <CardHeader>
          <CardTitle>Dataset Overview</CardTitle>
          <CardDescription>All community datasets with upload information and file details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table  className="  w-full rounded-lg">
            <TableHeader className="">
              <TableRow className="pt-4 border-b border-primary">
                <TableHead className="">
                  {/* <Database className="" /> */}
                  Dataset Name
                </TableHead>
                <TableHead className="">
                  {/* <Calendar className="" /> */}
                  Upload Date
                </TableHead>
                <TableHead className="">
                  {/* <HardDrive className="" /> */}
                  File Size
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDatasets.map((dataset) => (
                <TableRow key={dataset.id} className="border-b border-primary">
                  <TableCell className="font-medium">{dataset.name}</TableCell>
                  <TableCell>{dataset.uploadDate}</TableCell>
                  <TableCell>{dataset.fileSize}</TableCell>
                  <TableCell >
                    <Badge
                      variant={
                        dataset.status === "Active"
                          ? "default"
                          : dataset.status === "Processing"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {dataset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"

                      className="cursor-pointer  bg-primary hover:border-primary hover:text-primary"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium ">Total Datasets</p>
                <p className="text-2xl font-bold ">5</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium t">Total Size</p>
                <p className="text-2xl font-bold ">12.3 MB</p>
              </div>
              <HardDrive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium ">Active Datasets</p>
                <p className="text-2xl font-bold ">3</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CommunityDataViewer