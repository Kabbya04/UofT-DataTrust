"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Users, FileText, BarChart2, TrendingUp } from "lucide-react";

const lineChartData = [
    { name: 'Jan', new: 4000, active: 2400 }, { name: 'Feb', new: 3000, active: 1398 },
    { name: 'Mar', new: 2000, active: 9800 }, { name: 'Apr', new: 2780, active: 3908 },
    { name: 'May', new: 1890, active: 4800 }, { name: 'Jun', new: 2390, active: 3800 },
];
const communityPerformance = Array(10).fill({ topic: "Health", community: "Live Life", members: "67,899", engagement: "67%", growth: "+23%" });
const savedReports = Array(10).fill({ title: "Monthly Users Report", date: "Sep 10, 2025" });

export default function AnalyticsReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                <div className="flex gap-2">
                    <Button variant="outline">Export Data</Button>
                    <Button>Generate Report</Button>
                </div>
            </div>

            <Tabs defaultValue="30d"><TabsList><TabsTrigger value="24h">Last 24 hours</TabsTrigger><TabsTrigger value="7d">Last 7 Days</TabsTrigger><TabsTrigger value="30d">Last 30 Days</TabsTrigger><TabsTrigger value="90d">Last 90 Days</TabsTrigger><TabsTrigger value="custom">Custom</TabsTrigger></TabsList></Tabs>

            <Card>
                <CardHeader><CardTitle>Filter By</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Community" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Users" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Device" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Communities</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Posts</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Engagement Rate</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">5,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>User Growth & Activity</CardTitle></CardHeader>
                <CardContent className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={lineChartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><Line type="monotone" dataKey="new" stroke="hsl(var(--primary))" strokeWidth={2} /><Line type="monotone" dataKey="active" stroke="#82ca9d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Community Performance</CardTitle></CardHeader>
                    <CardContent><Table><TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Community</TableHead><TableHead>Members</TableHead><TableHead>Engagement</TableHead><TableHead>Growth</TableHead></TableRow></TableHeader><TableBody>{communityPerformance.map((item, i) => (<TableRow key={i}><TableCell>{item.topic}</TableCell><TableCell>{item.community}</TableCell><TableCell>{item.members}</TableCell><TableCell>{item.engagement}</TableCell><TableCell>{item.growth}</TableCell></TableRow>))}</TableBody></Table></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
                    <CardContent className="space-y-2">{savedReports.map((report, i) => (<div key={i} className="flex items-center justify-between p-3 border rounded-md"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm font-medium">{report.title}</p><p className="text-xs text-muted-foreground">{report.date}</p></div></div></div>))}</CardContent>
                </Card>
            </div>
        </div>
    );
}