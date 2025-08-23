"use client"

import { useState } from "react"
import { Send, Clock, CheckCircle, XCircle, Eye, Plus, Search } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Label } from "../../../../components/ui/label"

const mockRequests = [
  {
    id: 1,
    communityName: "AI Research Hub",
    requestDate: "2024-01-15",
    status: "pending",
    reason: "I'm a machine learning researcher interested in collaborating on AI projects",
    response: null,
    responseDate: null,
  },
  {
    id: 2,
    communityName: "Startup Founders",
    requestDate: "2024-01-10",
    status: "approved",
    reason: "I'm launching a tech startup and would like to connect with other founders",
    response: "Welcome to our community! We're excited to have you join us.",
    responseDate: "2024-01-12",
  },
  {
    id: 3,
    communityName: "Digital Artists",
    requestDate: "2024-01-08",
    status: "rejected",
    reason: "I'm interested in digital art and design",
    response: "Thank you for your interest. Unfortunately, we're currently at capacity.",
    responseDate: "2024-01-09",
  },
  {
    id: 4,
    communityName: "Sustainable Living",
    requestDate: "2024-01-05",
    status: "approved",
    reason: "I'm passionate about environmental sustainability and green living practices",
    response: "Great to have another sustainability advocate! Welcome aboard.",
    responseDate: "2024-01-06",
  },
]

const availableCommunities = [
  { id: 1, name: "Blockchain Developers", category: "Technology", privacy: "Private", members: 850 },
  { id: 2, name: "Creative Writers", category: "Arts", privacy: "Private", members: 420 },
  { id: 3, name: "Urban Gardening", category: "Environment", privacy: "Private", members: 650 },
  { id: 4, name: "Product Managers", category: "Business", privacy: "Private", members: 1200 },
]

const TrackRequest = () => {

     const [selectedTab, setSelectedTab] = useState("submit")
  const [selectedCommunity, setSelectedCommunity] = useState("")
  const [requestReason, setRequestReason] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredRequests = mockRequests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesSearch = request.communityName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleSubmitRequest = () => {
    if (!selectedCommunity || !requestReason.trim()) return

    // Here you would typically submit the request to your backend
    console.log("Submitting request:", { community: selectedCommunity, reason: requestReason })

    // Reset form
    setSelectedCommunity("")
    setRequestReason("")

    // Show success message or redirect
    alert("Access request submitted successfully!")
  }
 
  return (
    <div>
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Request Status Tracking
              </CardTitle>
              <CardDescription>Monitor the status of your pending and recent requests</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by community name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Requests */}
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(request.status)}
                          <h4 className="font-medium">{request.communityName}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Requested on {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{request.reason}</p>
                        {request.response && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Response:</p>
                            <p className="text-sm">{request.response}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Responded on {request.responseDate && new Date(request.responseDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Details</DialogTitle>
                            <DialogDescription>Full details of your access request</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Community</Label>
                              <p className="text-sm">{request.communityName}</p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusIcon(request.status)}
                                {getStatusBadge(request.status)}
                              </div>
                            </div>
                            <div>
                              <Label>Request Date</Label>
                              <p className="text-sm">{new Date(request.requestDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label>Your Message</Label>
                              <p className="text-sm">{request.reason}</p>
                            </div>
                            {request.response && (
                              <div>
                                <Label>Community Response</Label>
                                <p className="text-sm">{request.response}</p>
                                <p className="text-xs text-muted-foreground">
                                  {request.responseDate && new Date(request.responseDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}

export default TrackRequest