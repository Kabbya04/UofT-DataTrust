'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from 'recharts';
import { Database, FileClock, CheckCircle, FileUp, ImageIcon } from 'lucide-react';

const projects = [
  { name: "Climate Change", date: "7 Aug 2025", size: "2.5 MB", tag: "Sports" },
  { name: "Market Trends Analysis", date: "15 Jul 2025", size: "5.1 MB", tag: "Business" },
  { name: "AI Model Training", date: "2 Jun 2025", size: "12.8 MB", tag: "Technology" },
];

const donutChartData = [{ name: 'Category A', value: 400 }, { name: 'Category B', value: 300 }, { name: 'Category C', value: 200 }];
const lineChartData = [
    { name: 'Jan', usage: 4000 }, { name: 'Feb', usage: 3000 }, { name: 'Mar', usage: 2000 },
    { name: 'Apr', usage: 2780 }, { name: 'May', usage: 1890 }, { name: 'Jun', usage: 2390 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.7)', 'hsl(var(--primary) / 0.4)'];

export default function StatisticsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Statistics</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>My Research Data</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Select defaultValue="all"><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Data</SelectItem></SelectContent></Select>
                    <Select defaultValue="30d"><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30d">Last 30 Days</SelectItem></SelectContent></Select>
                    <Button>Export</Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Projects</CardTitle><Database className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">900</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Access Requested</CardTitle><FileClock className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Approved Access</CardTitle><CheckCircle className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Data Usage</CardTitle><FileUp className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">500 MB</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Data Usage Category</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart><Pie data={donutChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>{donutChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Data Usage Trends</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /><Line type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} /><Tooltip /></LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <div>
                <h2 className="text-xl font-semibold mb-4">My Projects</h2>
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <Card key={index} className="p-4 flex items-center justify-between hover:border-primary transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-muted rounded-lg"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>
                                <div><h3 className="font-semibold">{project.name}</h3><p className="text-sm text-muted-foreground">{project.date} &nbsp; {project.size}</p></div>
                            </div>
                            <Badge variant="outline">{project.tag}</Badge>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}