"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, Database, FileClock, CheckCircle, TrendingUp } from "lucide-react";

const lineChartData = [
    { name: 'MON', value: 1000 },
    { name: 'TUE', value: 1200 },
    { name: 'WED', value: 2800 },
    { name: 'THU', value: 1800 },
    { name: 'FRI', value: 2400 },
    { name: 'SAT', value: 2200 },
    { name: 'SUN', value: 2600 },
];

const pieChartData = [
    { name: 'Active', value: 82.3 },
    { name: 'Inactive', value: 17.7 }
];

const COLORS = ['#3B82F6', '#E5E7EB'];

const barChartData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1800 },
    { name: 'Mar', value: 2600 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 2200 },
    { name: 'Jun', value: 2000 },
    { name: 'Jul', value: 1800 },
    { name: 'Aug', value: 3200 },
    { name: 'Sep', value: 3000 },
];

export default function CommunityAnalyticsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Community Analytics</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border border-gray-200 rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Datasets</CardTitle>
                        <Database className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">900</div>
                        <div className="flex items-center text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +100% vs last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Members</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">50,000</div>
                        <div className="flex items-center text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +100% vs last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                        <FileClock className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">30,000</div>
                        <div className="flex items-center text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +100% vs last month
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Approve Researchers</CardTitle>
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">5000</div>
                        <div className="flex items-center text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +100% vs last month
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Growth Chart */}
                <Card className="border border-gray-200 rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Member Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: "#3B82F6" }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Researcher Activity Chart */}
                <Card className="border border-gray-200 rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Researcher Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <div className="relative">
                            <ResponsiveContainer width={200} height={200}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        startAngle={90}
                                        endAngle={450}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">82.3%</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Contribution Chart */}
            <Card className="border border-gray-200 rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Data Contribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} barCategoryGap="20%">
                            <XAxis 
                                dataKey="name" 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Bar 
                                dataKey="value" 
                                fill="#93C5FD" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}