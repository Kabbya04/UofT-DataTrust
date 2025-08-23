"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Progress } from "../../../../components/ui/progress"
import { TrendingUp,Zap } from "lucide-react"


const PluginMetrics = () => {

    const pluginMetrics = [
        { name: "Data Validator", performance: 98, usage: 245, status: "optimal" },
        { name: "Privacy Scanner", performance: 92, usage: 189, status: "good" },
        { name: "Compliance Checker", performance: 87, usage: 156, status: "warning" },
        { name: "Analytics Engine", performance: 95, usage: 312, status: "optimal" },
    ]

    const getPerformanceColor = (status: string) => {
        switch (status) {
            case "optimal":
                return "text-green-600"
            case "good":
                return "text-blue-600"
            case "warning":
                return "text-yellow-600"
            case "critical":
                return "text-red-600"
            default:
                return "text-gray-600"
        }
    }
    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {pluginMetrics.map((plugin) => (
                    <Card key={plugin.name}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                                        <CardDescription>Performance and usage metrics</CardDescription>
                                    </div>
                                </div>
                                <Badge className={getPerformanceColor(plugin.status)}>{plugin.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Performance</span>
                                        <span>{plugin.performance}%</span>
                                    </div>
                                    <Progress value={plugin.performance} className="h-2" />
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{plugin.usage}</div>
                                    <div className="text-sm text-muted-foreground">Daily Usage</div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Analytics
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Configure
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default PluginMetrics