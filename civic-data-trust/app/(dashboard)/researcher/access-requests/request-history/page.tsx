"use client"

import { useState } from "react"
import { Send, Clock, CheckCircle, XCircle, Eye, Plus, Search } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Label } from "@/app/components/ui/label"

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

const RequestHistory = () => {
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
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>Complete history of all your community access requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    {getStatusIcon(request.status)}
                                    <div>
                                        <h4 className="font-medium">{request.communityName}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(request.requestDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(request.status)}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Request History Details</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label>Community</Label>
                                                    <p className="text-sm">{request.communityName}</p>
                                                </div>
                                                <div>
                                                    <Label>Final Status</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {getStatusIcon(request.status)}
                                                        {getStatusBadge(request.status)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Timeline</Label>
                                                    <div className="text-sm space-y-1">
                                                        <p>Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                                                        {request.responseDate && (
                                                            <p>Responded: {new Date(request.responseDate).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Your Request</Label>
                                                    <p className="text-sm">{request.reason}</p>
                                                </div>
                                                {request.response && (
                                                    <div>
                                                        <Label>Community Response</Label>
                                                        <p className="text-sm">{request.response}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RequestHistory