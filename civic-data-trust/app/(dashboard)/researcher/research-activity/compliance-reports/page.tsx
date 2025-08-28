"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { FileText } from "lucide-react"
import {
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Cell,
    Pie,
} from "recharts"


const ComplianceReports = () => {
    const complianceReports = [
        {
            id: "comp-001",
            title: "Q1 2024 Compliance Report",
            status: "completed",
            date: "2024-03-31",
            score: 95,
            issues: 2,
        },
        {
            id: "comp-002",
            title: "Data Privacy Audit",
            status: "in-progress",
            date: "2024-04-15",
            score: 88,
            issues: 5,
        },
        {
            id: "comp-003",
            title: "Ethics Review Report",
            status: "pending",
            date: "2024-04-30",
            score: null,
            issues: 0,
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

    const pieChartData = [
        { name: "Compliant", value: 75, color: "#10b981" },
        { name: "Pending", value: 20, color: "#f59e0b" },
        { name: "Issues", value: 5, color: "#ef4444" },
    ]
    return (

        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Compliance Reports</CardTitle>
                        <CardDescription>Recent compliance assessments and audits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {complianceReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{report.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {report.date} • {report.issues} issues found
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {report.score && (
                                        <div className="text-right">
                                            <div className="font-bold text-lg">{report.score}%</div>
                                            <div className="text-xs text-muted-foreground">Score</div>
                                        </div>
                                    )}
                                    <Badge className={`${getStatusColor(report.status)} text-white`}>{report.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Overview</CardTitle>
                        <CardDescription>Overall compliance distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <RechartsPieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-4">
                            {pieChartData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-medium">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>


    )
}

export default ComplianceReports