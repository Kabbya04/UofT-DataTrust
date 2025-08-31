"use client"

import { useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"

export default function ResearcherAccessRequestsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ]

  const requests = [
    {
      id: 1,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 2,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 3,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 4,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 5,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 6,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 7,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
    {
      id: 8,
      researcher: "Jhon Doe",
      fileName: "Spiderman Image",
      purpose: "Reusing for comic",
      status: "pending",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">

        <h1 className="text-3xl font-bold mb-8">Researcher Access Requests</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Researcher</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.researcher}</TableCell>
                  <TableCell>{request.fileName}</TableCell>
                  <TableCell>{`"${request.purpose}"`}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-black hover:bg-black/90 text-white">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
