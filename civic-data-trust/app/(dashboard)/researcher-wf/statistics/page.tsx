'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Database, FileClock, CheckCircle, FileUp, ImageIcon } from 'lucide-react';

const projects = [
  { name: "Climate Change", date: "7 Aug 2025", size: "2.5 MB", tag: "Sports" },
  { name: "Market Trends Analysis", date: "15 Jul 2025", size: "5.1 MB", tag: "Business" },
  { name: "AI Model Training", date: "2 Jun 2025", size: "12.8 MB", tag: "Technology" },
];

// Updated data to match admin dashboard color scheme
const donutChartData = [
  { name: 'Active', value: 65, fill: '#3B82F6' },
  { name: 'Pending', value: 25, fill: '#60A5FA' },
  { name: 'Inactive', value: 10, fill: '#E5E7EB' }
];

const lineChartData = [
    { name: 'Jan', usage: 4000 }, { name: 'Feb', usage: 3000 }, { name: 'Mar', usage: 2000 },
    { name: 'Apr', usage: 2780 }, { name: 'May', usage: 1890 }, { name: 'Jun', usage: 2390 },
];

export default function StatisticsPage() {
    return (
        <div className="space-y-8 font-urbanist">
            <h1 className="text-figma-3xl font-bold text-civic-gray-900">Statistics</h1>
            
            <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma">
                <CardHeader className="pb-4">
                    <CardTitle className="text-figma-xl font-bold text-civic-gray-900">My Research Data</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4 p-6">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-48 h-12 border-civic-gray-200 rounded-xl text-figma-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-civic-gray-200 rounded-xl">
                            <SelectItem value="all">All Data</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-48 h-12 border-civic-gray-200 rounded-xl text-figma-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-civic-gray-200 rounded-xl">
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="h-12 px-6 bg-button-primary hover:bg-button-primary/90 text-white rounded-xl font-medium text-figma-base">Export</Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-figma-base font-medium text-civic-gray-500">Total Projects</CardTitle>
                        <Database className="h-5 w-5 text-civic-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-figma-3xl font-bold text-civic-gray-900">900</div>
                        <p className="text-figma-sm text-civic-gray-500">+100% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-figma-base font-medium text-civic-gray-500">Access Requested</CardTitle>
                        <FileClock className="h-5 w-5 text-civic-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-figma-3xl font-bold text-civic-gray-900">50,000</div>
                        <p className="text-figma-sm text-civic-gray-500">+100% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-figma-base font-medium text-civic-gray-500">Approved Access</CardTitle>
                        <CheckCircle className="h-5 w-5 text-civic-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-figma-3xl font-bold text-civic-gray-900">30,000</div>
                        <p className="text-figma-sm text-civic-gray-500">+100% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-figma-base font-medium text-civic-gray-500">Data Usage</CardTitle>
                        <FileUp className="h-5 w-5 text-civic-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-figma-3xl font-bold text-civic-gray-900">500 MB</div>
                        <p className="text-figma-sm text-civic-gray-500">+100% vs last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-figma-xl font-bold text-civic-gray-900 font-urbanist">Project Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={donutChartData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={50} 
                                    outerRadius={90} 
                                    paddingAngle={2}
                                    stroke="#FFFFFF"
                                    strokeWidth={3}
                                >
                                    {donutChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E6E6E6',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                        fontFamily: 'Urbanist, sans-serif',
                                        fontSize: '14px'
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    wrapperStyle={{
                                        fontFamily: 'Urbanist, sans-serif',
                                        fontSize: '14px',
                                        color: '#595959'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-figma-xl font-bold text-civic-gray-900 font-urbanist">Research Activity Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#595959" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    fontFamily="Urbanist, sans-serif"
                                />
                                <YAxis 
                                    stroke="#595959" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    fontFamily="Urbanist, sans-serif"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="usage" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3} 
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E6E6E6',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                        fontFamily: 'Urbanist, sans-serif',
                                        fontSize: '14px'
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <div>
                <h2 className="text-figma-xl font-bold text-civic-gray-900 mb-6">My Projects</h2>
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <Card key={index} className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-civic-gray-100 rounded-lg">
                                    <ImageIcon className="h-6 w-6 text-civic-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-figma-lg text-civic-gray-900">{project.name}</h3>
                                    <p className="text-figma-base text-civic-gray-500">{project.date} &nbsp; {project.size}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-civic-gray-200 text-civic-gray-500 bg-white rounded-lg px-3 py-1 text-figma-base">
                                {project.tag}
                            </Badge>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}