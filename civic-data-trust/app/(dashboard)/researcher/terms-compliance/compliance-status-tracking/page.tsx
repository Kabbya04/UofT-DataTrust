import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Eye, FileText } from 'lucide-react'
import { ScrollArea } from "@/app/components/ui/scroll-area"
const ComplianceStatusTracking = () => {
    const complianceHistory = [
        {
            id: 1,
            document: "Data Usage Policy v2.0",
            action: "Agreement Signed",
            date: "2023-12-15",
            status: "completed",
        },
        {
            id: 2,
            document: "Privacy Agreement v1.7",
            action: "Document Reviewed",
            date: "2023-12-10",
            status: "completed",
        },
        {
            id: 3,
            document: "Research Ethics Guidelines v2.9",
            action: "Compliance Check",
            date: "2023-12-05",
            status: "completed",
        },
    ]
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
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Overview</CardTitle>
                        <CardDescription>Current compliance status across all documents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {termsDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium text-sm">{doc.title}</div>
                                        <div className="text-xs text-muted-foreground">{doc.version}</div>
                                    </div>
                                </div>
                                <div
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${getStatusColor(doc.status)}`}
                                >
                                    {getStatusIcon(doc.status)}
                                    <span className="capitalize">{doc.status}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Compliance History</CardTitle>
                        <CardDescription>Recent compliance activities and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-64">
                            <div className="space-y-3">
                                {complianceHistory.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{item.action}</div>
                                            <div className="text-sm text-muted-foreground">{item.document}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{item.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ComplianceStatusTracking