"use client"

import { useState, useMemo } from "react"
import { Eye, Cube, FunnelSimple, Database } from "phosphor-react"
import { TrendingUp, TrendingDown, Maximize2, Minimize2, RotateCcw, PieChart as PieChartIcon } from "lucide-react"
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, Cell, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

const allPerformanceData = [
    { id: "1", title: "Global Healthcare Analytics Dataset", date: new Date("2025-08-15"), size: "3.2 GB", views: 15647, researchUsage: 8934, downloads: 2341, category: "Healthcare", growth: "+23%" },
    { id: "2", title: "COVID-19 Vaccination Efficacy Data", date: new Date("2025-08-10"), size: "1.1 GB", views: 22456, researchUsage: 12567, downloads: 4123, category: "Healthcare", growth: "+45%" },
    { id: "3", title: "Machine Learning Stock Predictions", date: new Date("2025-08-12"), size: "856 MB", views: 9823, researchUsage: 4567, downloads: 1234, category: "Finance", growth: "+31%" },
    { id: "5", title: "AI-Powered Code Generation Datasets", date: new Date("2025-08-14"), size: "4.8 GB", views: 31245, researchUsage: 18765, downloads: 5432, category: "Technology", growth: "+89%" },
];

const allTrendData = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000);
    return {
        day: i + 1, date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), dateValue: date,
        usage: Math.floor(35 + Math.sin(i * 0.1) * 10 + (i * 1.2) / 20 + Math.sin(i * 0.3) * 5)
    };
});

export default function StatisticsPage() {
    const [dataFilter, setDataFilter] = useState("all")
    const [timeFilter, setTimeFilter] = useState("30")
    const [expandedChart, setExpandedChart] = useState<'pie' | 'line' | null>(null)
    
    const usageStats = {
        totalDatasets: 847, 
        totalDownloads: 12456, 
        totalUploads: 234,
        storageUsed: "45.7 GB"
    }
    
    const filteredData = useMemo(() => {
        const daysAgo = parseInt(timeFilter);
        const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const perfData = allPerformanceData.filter(d => d.date >= cutoffDate && (dataFilter === 'all' || d.category === dataFilter));
        const trendData = allTrendData.filter(d => d.dateValue >= cutoffDate);

        const categoryStats = perfData.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.views;
            return acc;
        }, {} as Record<string, number>);

        const totalViews = Object.values(categoryStats).reduce((sum, v) => sum + v, 0);

        // Updated colors to match Figma design specifications
        const figmaColors = ['#D4A574', '#B8946B', '#9C8362', '#807159'];
        const categoryData = Object.entries(categoryStats).map(([name, value], index) => ({
            name, 
            value: totalViews > 0 ? Math.round((value / totalViews) * 100) : 0,
            fill: figmaColors[index % figmaColors.length]
        }));

        const totalRequests = perfData.reduce((sum, item) => sum + item.researchUsage, 0);
        const totalApproved = perfData.reduce((sum, item) => sum + item.downloads, 0);

        return {
            performanceData: perfData, 
            trendData, 
            categoryData,
            audienceStats: [
                { 
                    title: "Project views", 
                    value: totalViews.toLocaleString(), 
                    change: `+23% vs last month`, 
                    icon: <Eye size={20} className="text-civic-gray-400" />, 
                    trend: 'up' as const 
                },
                { 
                    title: "Access Request", 
                    value: totalRequests.toLocaleString(), 
                    change: `+31% vs last month`, 
                    icon: <Cube size={20} className="text-civic-gray-400" />, 
                    trend: 'up' as const 
                },
                { 
                    title: "Approved Access", 
                    value: totalApproved.toLocaleString(), 
                    change: `-8% vs last month`, 
                    icon: <FunnelSimple size={20} className="text-civic-gray-400" />, 
                    trend: 'down' as const 
                },
                { 
                    title: "Total Datasets", 
                    value: usageStats.totalDatasets.toString(), 
                    change: `+12% vs last month`, 
                    icon: <Cube size={20} className="text-civic-gray-400" />, 
                    trend: 'up' as const 
                }
            ]
        };
    }, [dataFilter, timeFilter]);

    return (
        <div className="flex-1 p-8 bg-civic-gray-100 scrollbar-hidden">
            {/* Page Header */}
            <div className="mb-8">
                <p className="text-figma-sm text-civic-gray-500 mb-2">Community Member / Statistics</p>
                <h1 className="text-figma-3xl font-bold text-civic-gray-900 font-urbanist">Statistics</h1>
            </div>

            {/* Your Audience Section */}
            <div className="mb-8">
                <h2 className="text-figma-xl font-bold text-civic-gray-900 mb-6 font-urbanist">Your Audience</h2>
                
                {/* Filters */}
                <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma mb-6 p-6">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <Select value={dataFilter} onValueChange={setDataFilter}>
                                    <SelectTrigger className="w-48 h-12 border-civic-gray-200 rounded-xl text-figma-base">
                                        <SelectValue placeholder="All Data" />
                                    </SelectTrigger>
                                    <SelectContent className="border-civic-gray-200 rounded-xl">
                                        <SelectItem value="all">All Data</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={timeFilter} onValueChange={setTimeFilter}>
                                    <SelectTrigger className="w-48 h-12 border-civic-gray-200 rounded-xl text-figma-base">
                                        <SelectValue placeholder="Last 30 Days" />
                                    </SelectTrigger>
                                    <SelectContent className="border-civic-gray-200 rounded-xl">
                                        <SelectItem value="7">Last 7 Days</SelectItem>
                                        <SelectItem value="30">Last 30 Days</SelectItem>
                                        <SelectItem value="90">Last 90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="h-12 px-6 bg-button-primary hover:bg-button-primary/90 text-white rounded-xl font-medium text-figma-base">
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Audience Stats Cards - All 4 cards in one row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {filteredData.audienceStats.map((stat, index) => (
                        <Card key={index} className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-figma-base font-medium text-civic-gray-500">{stat.title}</span>
                                    <div className="p-2 bg-civic-gray-100 rounded-lg">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-figma-3xl font-bold text-civic-gray-900 mb-2">{stat.value}</div>
                                <div className={`text-figma-sm flex items-center gap-1 ${
                                    stat.trend === 'up' ? 'text-civic-accent-green' : 'text-button-danger'
                                }`}>
                                    {stat.trend === 'up' ? 
                                        <TrendingUp size={16} /> : 
                                        <TrendingDown size={16} />
                                    }
                                    {stat.change}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className={`transition-all duration-300 mb-8 ${
                expandedChart ? 'fixed inset-0 z-50 bg-white p-8 overflow-auto' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'
            }`}>
                {/* Pie Chart */}
                {(!expandedChart || expandedChart === 'pie') && (
                    <Card className={`bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200 ${
                        expandedChart === 'pie' ? 'w-full h-full' : ''
                    }`}>
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-figma-xl font-bold text-civic-gray-900 font-urbanist">Data Usage Category</h3>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setExpandedChart(expandedChart ? null : 'pie')} 
                                    className="flex items-center gap-2 border-civic-gray-200 text-civic-gray-500 rounded-lg"
                                >
                                    {expandedChart ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                    {expandedChart ? 'Minimize' : 'Expand'}
                                </Button>
                            </div>
                            <div className="w-full h-full flex items-center justify-center">
                                <ResponsiveContainer width={expandedChart ? 600 : 400} height={expandedChart ? 400 : 300}>
                                    <PieChart>
                                        <Pie 
                                            data={filteredData.categoryData} 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={expandedChart ? 80 : 60} 
                                            outerRadius={expandedChart ? 140 : 100} 
                                            dataKey="value" 
                                            stroke="white" 
                                            strokeWidth={3}
                                        >
                                            {filteredData.categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Legend 
                                            verticalAlign="bottom" 
                                            height={36} 
                                            iconType="circle"
                                            wrapperStyle={{fontSize: '14px', fontFamily: 'Urbanist'}}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Line Chart */}
                {(!expandedChart || expandedChart === 'line') && (
                    <Card className={`bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200 ${
                        expandedChart === 'line' ? 'w-full h-full' : ''
                    }`}>
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-figma-xl font-bold text-civic-gray-900 font-urbanist">Data Usage Trends</h3>
                                <div className="flex gap-2">
                                    {expandedChart === 'line' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => {}}
                                            className="flex items-center gap-2 border-civic-gray-200 text-civic-gray-500 rounded-lg"
                                        >
                                            <RotateCcw size={16} />
                                            Reset Zoom
                                        </Button>
                                    )}
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setExpandedChart(expandedChart ? null : 'line')} 
                                        className="flex items-center gap-2 border-civic-gray-200 text-civic-gray-500 rounded-lg"
                                    >
                                        {expandedChart ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                        {expandedChart ? 'Minimize' : 'Expand'}
                                    </Button>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={expandedChart ? 500 : 300}>
                                <LineChart data={filteredData.trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis 
                                        dataKey="date" 
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
                                        dataKey="usage" 
                                        stroke="#3B82F6" 
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#3B82F6" }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Data Performance Section */}
            <div>
                <h2 className="text-figma-xl font-bold text-civic-gray-900 mb-6 font-urbanist">Data Performance</h2>
                <div className="space-y-4">
                    {filteredData.performanceData.length === 0 ? (
                        <Card className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma">
                            <CardContent className="p-8 text-center">
                                <div className="text-civic-gray-500">No data available for the selected filters.</div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredData.performanceData.map((item) => (
                            <Card key={item.id} className="bg-white border border-civic-gray-200 rounded-2xl shadow-figma hover:shadow-figma-card transition-all duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-civic-gray-100 rounded-lg flex items-center justify-center">
                                                <Database size={24} className="text-civic-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-figma-lg text-civic-gray-900">{item.title}</h4>
                                                <p className="text-figma-base text-civic-gray-500">
                                                    {item.date.toLocaleDateString()} • {item.size} • {item.category}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 text-center">
                                            <div>
                                                <div className="text-figma-2xl font-bold text-civic-gray-900">{item.views.toLocaleString()}</div>
                                                <div className="text-figma-sm text-civic-gray-500">Views</div>
                                            </div>
                                            <div>
                                                <div className="text-figma-2xl font-bold text-civic-gray-900">{item.researchUsage.toLocaleString()}</div>
                                                <div className="text-figma-sm text-civic-gray-500">Research Usage</div>
                                            </div>
                                            <div>
                                                <div className="text-figma-2xl font-bold text-civic-gray-900">{item.downloads.toLocaleString()}</div>
                                                <div className="text-figma-sm text-civic-gray-500">Downloads</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.growth.startsWith('+') ? 
                                                    <TrendingUp size={20} className="text-civic-accent-green" /> : 
                                                    <TrendingDown size={20} className="text-button-danger" />
                                                }
                                                <span className={`text-figma-base font-medium ${
                                                    item.growth.startsWith('+') ? 'text-civic-accent-green' : 'text-button-danger'
                                                }`}>
                                                    {item.growth}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}