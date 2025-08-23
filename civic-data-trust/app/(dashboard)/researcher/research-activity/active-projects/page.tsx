"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Progress } from "../../../../components/ui/progress"
import { Activity, BarChart3, Database, FileText, TrendingUp, Users, Clock, Zap, Target } from "lucide-react"


const ActiveProjects = () => {
    const [selectedProject, setSelectedProject] = useState<string | null>(null)

    const activeProjects = [
        {
            id: "proj-001",
            name: "AI Ethics Research",
            status: "active",
            progress: 75,
            team: 8,
            datasets: 12,
            lastActivity: "2 hours ago",
            compliance: "compliant",
            description: "Investigating ethical implications of AI in healthcare",
        },
        {
            id: "proj-002",
            name: "Climate Data Analysis",
            status: "active",
            progress: 45,
            team: 5,
            datasets: 8,
            lastActivity: "1 day ago",
            compliance: "pending",
            description: "Analyzing climate change patterns using satellite data",
        },
        {
            id: "proj-003",
            name: "Social Media Sentiment",
            status: "paused",
            progress: 30,
            team: 3,
            datasets: 6,
            lastActivity: "1 week ago",
            compliance: "compliant",
            description: "Understanding public sentiment through social media analysis",
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500"
            case "paused":
                return "bg-yellow-500"
            case "completed":
                return "bg-blue-500"
            case "in-progress":
                return "bg-orange-500"
            case "pending":
                return "bg-gray-500"
            default:
                return "bg-gray-500"
        }
    }

    const getComplianceColor = (compliance: string) => {
        switch (compliance) {
            case "compliant":
                return "text-green-600"
            case "pending":
                return "text-yellow-600"
            case "issues":
                return "text-red-600"
            default:
                return "text-gray-600"
        }
    }



    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Active Projects</h1>
                    <p className="text-muted-foreground mt-2">Monitor research projects, data usage, and compliance metrics</p>
                </div>
                <div className="flex items-center gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            <div>
                                <div className="text-2xl font-bold">3</div>
                                <div className="text-sm text-muted-foreground">Active Projects</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid gap-6">
                    {activeProjects.map((project) => (
                        <Card key={project.id} className="relative">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                            <Badge className={`${getStatusColor(project.status)} text-white`}>{project.status}</Badge>
                                            <Badge variant="outline" className={getComplianceColor(project.compliance)}>
                                                {project.compliance}
                                            </Badge>
                                        </div>
                                        <CardDescription>{project.description}</CardDescription>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {project.team} members
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Database className="h-4 w-4" />
                                                {project.datasets} datasets
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {project.lastActivity}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{project.progress}%</div>
                                        <div className="text-sm text-muted-foreground">Complete</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Project Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className="h-2" />
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <BarChart3 className="h-4 w-4 mr-2" />
                                            Analytics
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Target className="h-4 w-4 mr-2" />
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ActiveProjects