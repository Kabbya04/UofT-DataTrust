"use client"

import { useState, useMemo } from "react"
import { Eye, ChevronDown, Database, TrendingUp, TrendingDown, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Cell, Legend, Brush } from "recharts"
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
        totalDatasets: 847, totalDownloads: 12456, totalUploads: 234,
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

        const categoryData = Object.entries(categoryStats).map(([name, value], index) => ({
            name, value: totalViews > 0 ? Math.round((value / totalViews) * 100) : 0,
            fill: `hsl(26 83% 58% / ${1 - (index * 0.15)})`
        }));

        const totalRequests = perfData.reduce((sum, item) => sum + item.researchUsage, 0);
        const totalApproved = perfData.reduce((sum, item) => sum + item.downloads, 0);

        return {
            performanceData: perfData, trendData, categoryData,
            audienceStats: [
                { title: "Project views", value: totalViews.toLocaleString(), change: `+23% vs last month`, icon: <Eye className="h-4 w-4" />, trend: 'up' as const },
                { title: "Access Request", value: totalRequests.toLocaleString(), change: `+31% vs last month`, icon: <Database className="h-4 w-4" />, trend: 'up' as const },
                { title: "Approved Access", value: totalApproved.toLocaleString(), change: `-8% vs last month`, icon: <ChevronDown className="h-4 w-4" />, trend: 'down' as const }
            ]
        };
    }, [dataFilter, timeFilter]);

    return (
        <div className="flex-1 p-6">
            <div className="mb-6"><h1 className="text-xl font-bold mb-6">Statistics</h1></div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Your Audience</h2>
                <div className="flex gap-4 mb-6">
                    <Select value={dataFilter} onValueChange={setDataFilter}><SelectTrigger className="w-48"><SelectValue placeholder="All Data" /></SelectTrigger><SelectContent><SelectItem value="all">All Data</SelectItem><SelectItem value="Healthcare">Healthcare</SelectItem><SelectItem value="Finance">Finance</SelectItem><SelectItem value="Technology">Technology</SelectItem></SelectContent></Select>
                    <Select value={timeFilter} onValueChange={setTimeFilter}><SelectTrigger className="w-48"><SelectValue placeholder="Last 30 Days" /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 Days</SelectItem><SelectItem value="30">Last 30 Days</SelectItem><SelectItem value="90">Last 90 Days</SelectItem></SelectContent></Select>
                    <Button variant="default">Export</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{filteredData.audienceStats.map((stat, index) => (<Card key={index} className="border border-border"><CardContent className="p-6"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-muted-foreground">{stat.title}</span><div className="p-1 bg-muted rounded">{stat.icon}</div></div><div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div><div className={`text-sm ${stat.trend === 'up' ? 'text-foreground' : 'text-red-600'}`}>{stat.change}</div></CardContent></Card>))}</div>
            </div>
            <div className="mb-6 w-60">
                <Card className="flex flex-col">
                    <CardHeader className=" flex flex-row items-center gap-1 space-y-0 pb-2 px-6 pt-4">
                        <Database className="h-8 w-8 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold ml-8">{usageStats.totalDatasets}</div>
                    </CardContent>
                </Card>
            </div>
            <div className={`transition-all duration-300 mb-8 ${expandedChart ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
                {(!expandedChart || expandedChart === 'pie') && (<Card className={`border border-border ${expandedChart === 'pie' ? 'w-full h-full' : ''}`}><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Data Usage Category</h3><Button variant="outline" size="sm" onClick={() => setExpandedChart(expandedChart ? null : 'pie')} className="flex items-center gap-1">{expandedChart ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{expandedChart ? 'Minimize' : 'Expand'}</Button></div><PieChart width={500} height={300}><Pie data={filteredData.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="hsl(var(--background))" strokeWidth={2}>{filteredData.categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Pie><Legend verticalAlign="bottom" height={36} iconType="circle" /></PieChart></CardContent></Card>)}
                {(!expandedChart || expandedChart === 'line') && (<Card className={`border border-border ${expandedChart === 'line' ? 'w-full h-full' : ''}`}><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Data Usage Trends</h3><div className="flex gap-2">{expandedChart === 'line' && (<Button variant="outline" size="sm" onClick={() => { }} className="flex items-center gap-1"><RotateCcw className="h-4 w-4" />Reset Zoom</Button>)}<Button variant="outline" size="sm" onClick={() => setExpandedChart(expandedChart ? null : 'line')} className="flex items-center gap-1">{expandedChart ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{expandedChart ? 'Minimize' : 'Expand'}</Button></div></div><LineChart data={filteredData.trendData} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Line type="monotone" dataKey="usage" stroke="hsl(var(--primary))" dot={false} /><Brush dataKey="date" height={35} stroke="hsl(var(--primary))" /></LineChart></CardContent></Card>)}
            </div>
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Data Performance</h2>
                <div className="flex gap-4 mb-6">

                    <div className="space-y-4">
                        {filteredData.performanceData.length === 0 ? <Card className="border border-border"><CardContent className="p-8 text-center"><div className="text-muted-foreground">No data available for the selected filters.</div></CardContent></Card> : filteredData.performanceData.map((item) => (<Card key={item.id} className="border border-border"><CardContent className="p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-muted rounded flex items-center justify-center"><Database className="h-5 w-5 text-muted-foreground" /></div><div><h4 className="font-semibold text-foreground">{item.title}</h4><p className="text-sm text-muted-foreground">{item.date.toLocaleDateString()} • {item.size} • {item.category}</p></div></div><div className="flex items-center gap-8 text-center"><div><div className="text-2xl font-bold">{item.views.toLocaleString()}</div><div className="text-sm text-muted-foreground">Views</div></div><div><div className="text-2xl font-bold">{item.researchUsage.toLocaleString()}</div><div className="text-sm text-muted-foreground">Research Usage</div></div><div><div className="text-2xl font-bold">{item.downloads.toLocaleString()}</div><div className="text-sm text-muted-foreground">Downloads</div></div><div className="flex items-center gap-1">{item.growth.startsWith('+') ? <TrendingUp className="h-4 w-4 text-foreground" /> : <TrendingDown className="h-4 w-4 text-red-500" />}<span className={`text-sm font-medium ${item.growth.startsWith('+') ? 'text-foreground' : 'text-red-600'}`}>{item.growth}</span></div></div></div></CardContent></Card>))}
                    </div>

                </div>
            </div>
        </div>
    );
}