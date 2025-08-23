"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { ScrollArea } from "../../../../components/ui/scroll-area"

import { Progress } from "../../../../components/ui/progress"
import { CheckCircle, Clock, AlertTriangle, Eye, Download, Calendar } from "lucide-react"

const TCReviewInterface = () => {


    const termsDocuments = [
        {
            id: "data-usage-policy",
            title: "Data Usage Policy",
            version: "v2.1",
            lastUpdated: "2024-01-15",
            status: "pending",
            description: "Guidelines for ethical data collection and usage in research projects.",
            mandatory: true,
        },
        {
            id: "privacy-agreement",
            title: "Privacy Agreement",
            version: "v1.8",
            lastUpdated: "2024-01-10",
            status: "agreed",
            description: "Privacy protection measures and user data handling procedures.",
            mandatory: true,
        },
        {
            id: "research-ethics",
            title: "Research Ethics Guidelines",
            version: "v3.0",
            lastUpdated: "2024-01-20",
            status: "review",
            description: "Ethical standards and best practices for research activities.",
            mandatory: true,
        },
        {
            id: "community-guidelines",
            title: "Community Guidelines",
            version: "v1.5",
            lastUpdated: "2024-01-05",
            status: "agreed",
            description: "Rules and expectations for community participation.",
            mandatory: false,
        },
    ]



    const getStatusColor = (status: string) => {
        switch (status) {
            case "agreed":
                return "bg-green-500"
            case "pending":
                return "bg-yellow-500"
            case "review":
                return "bg-blue-500"
            default:
                return "bg-gray-500"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "agreed":
                return <CheckCircle className="h-4 w-4" />
            case "pending":
                return <Clock className="h-4 w-4" />
            case "review":
                return <Eye className="h-4 w-4" />
            default:
                return <AlertTriangle className="h-4 w-4" />
        }
    }



    const complianceRate = Math.round(
        (termsDocuments.filter((doc) => doc.status === "agreed").length / termsDocuments.length) * 100,
    )
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Terms & Conditions Review</h1>
                    <p className="text-muted-foreground mt-2">
                        Review and manage compliance with terms, conditions, and agreements
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{complianceRate}%</div>
                        <div className="text-sm text-muted-foreground">Compliance Rate</div>
                    </div>
                    <Progress value={complianceRate} className="w-24" />
                </div>
            </div>

            <div  className="space-y-6">
                <div className="grid gap-6">
                    {termsDocuments.map((doc) => (
                        <Card key={doc.id} className="relative">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                                            <Badge variant="outline">{doc.version}</Badge>
                                            {doc.mandatory && (
                                                <Badge variant="destructive" className="text-xs">
                                                    Mandatory
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription>{doc.description}</CardDescription>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Updated: {doc.lastUpdated}
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-white ${getStatusColor(doc.status)}`}
                                            >
                                                {getStatusIcon(doc.status)}
                                                <span className="capitalize">{doc.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Review
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-32 w-full border rounded-md p-4">
                                    <div className="text-sm space-y-2">
                                        <p>
                                            <strong>Section 1:</strong> This document outlines the terms and conditions for{" "}
                                            {doc.title.toLowerCase()}...
                                        </p>
                                        <p>
                                            <strong>Section 2:</strong> Users must comply with all applicable laws and regulations...
                                        </p>
                                        <p>
                                            <strong>Section 3:</strong> Data protection and privacy measures are mandatory...
                                        </p>
                                        <p>
                                            <strong>Section 4:</strong> Violation of these terms may result in account suspension...
                                        </p>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TCReviewInterface