"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"


export default function AuditLogsPage() {
  const [dateFrom, setDateFrom] = useState("1 Sep 2025")
  const [dateTo, setDateTo] = useState("1 Sep 2025")
  const [dataType, setDataType] = useState("All")

  const logs = [
    {
      id: 1,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
    {
      id: 2,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "View",
    },
    {
      id: 3,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
    {
      id: 4,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
    {
      id: 5,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "View",
    },
    {
      id: 6,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
    {
      id: 7,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
    {
      id: 8,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
    {
      id: 9,
      time: "3 pm, 3 Jan 2025",
      fileName: "Spiderman Image",
      type: "PNGs",
      user: "Jhon Doe",
      action: "Download",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 ">

        <h1 className="text-3xl font-bold mb-8">Audit Logs</h1>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="date-from">Date:</Label>
                <Input id="date-from" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">to</Label>
                <Input id="date-to" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="PNGs">PNGs</SelectItem>
                    <SelectItem value="JPGs">JPGs</SelectItem>
                    <SelectItem value="PDFs">PDFs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Export</Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>{log.fileName}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
