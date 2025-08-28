"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"


const DataUsage = () => {
    const dataUsageData = [
        { month: "Jan", usage: 2.4, limit: 5.0 },
        { month: "Feb", usage: 3.1, limit: 5.0 },
        { month: "Mar", usage: 2.8, limit: 5.0 },
        { month: "Apr", usage: 4.2, limit: 5.0 },
        { month: "May", usage: 3.9, limit: 5.0 },
        { month: "Jun", usage: 4.8, limit: 5.0 },
    ]
    return (

        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Usage Trends</CardTitle>
                        <CardDescription>Monthly data consumption vs limits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dataUsageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Usage Statistics</CardTitle>
                        <CardDescription>Current month data consumption</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">4.8 TB</div>
                                <div className="text-sm text-muted-foreground">Used This Month</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">0.2 TB</div>
                                <div className="text-sm text-muted-foreground">Remaining</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Storage Usage</span>
                                <span>96%</span>
                            </div>
                            <Progress value={96} className="h-2" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">AI Ethics Research</span>
                                <span className="text-sm font-medium">2.1 TB</span>
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">Climate Data Analysis</span>
                                <span className="text-sm font-medium">1.8 TB</span>
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">Social Media Sentiment</span>
                                <span className="text-sm font-medium">0.9 TB</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}

export default DataUsage