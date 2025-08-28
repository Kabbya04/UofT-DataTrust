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

const SubmitRequest = () => {
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
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Submit New Access Request
          </CardTitle>
          <CardDescription>Request access to private communities that interest you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="community">Select Community</Label>
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a community to request access to" />
              </SelectTrigger>
              <SelectContent>
                {availableCommunities.map((community) => (
                  <SelectItem key={community.id} value={community.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{community.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {community.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{community.members} members</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you'd like to join this community and what you can contribute..."
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Provide a thoughtful explanation to increase your chances of approval
            </p>
          </div>

          <Button
            onClick={handleSubmitRequest}
            disabled={!selectedCommunity || !requestReason.trim()}
            className="w-full flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Access Request
          </Button>
        </CardContent>
      </Card>

      {/* Available Communities */}
      <Card>
        <CardHeader>
          <CardTitle>Available Private Communities</CardTitle>
          <CardDescription>Communities you can request access to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCommunities.map((community) => (
              <Card key={community.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{community.name}</h4>
                  <Badge variant="secondary">{community.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{community.members} members</span>
                  <Badge variant="outline">{community.privacy}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SubmitRequest