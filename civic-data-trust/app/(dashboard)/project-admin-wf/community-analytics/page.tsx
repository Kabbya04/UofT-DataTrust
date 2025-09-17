"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, Database, FileClock, CheckCircle } from "lucide-react";
import { Cube } from "@phosphor-icons/react";

const lineChartData = [
    { name: 'Jan', value: 20 }, { name: 'Feb', value: 45 }, { name: 'Mar', value: 30 },
    { name: 'Apr', value: 60 }, { name: 'May', value: 50 }, { name: 'Jun', value: 75 },
];
const pieChartData = [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 }];
const COLORS = ['#2196F3', '#4FC3F7'];
const barChartData = [
    { name: 'Jan', value: 2400 }, { name: 'Feb', value: 1398 }, { name: 'Mar', value: 3800 },
    { name: 'Apr', value: 2908 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 3800 },
    { name: 'Jul', value: 4300 }, { name: 'Aug', value: 3490 }, { name: 'Sep', value: 4300 },
];

export default function CommunityAnalyticsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Community Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Datasets</CardTitle><div className="p-2 bg-muted rounded-md"><Cube size={20} className="text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Members</CardTitle><div className="p-2 bg-muted rounded-md"><Cube size={20} className="text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle><div className="p-2 bg-muted rounded-md"><Cube size={20} className="text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Approved Researchers</CardTitle><div className="p-2 bg-muted rounded-md"><Cube size={20} className="text-muted-foreground" /></div></CardHeader><CardContent><div className="text-3xl font-bold">5,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>Member Growth</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={lineChartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><Line type="monotone" dataKey="value" stroke="#2196F3" strokeWidth={2} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></CardContent></Card>
                <Card><CardHeader><CardTitle>Researcher Activity</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" labelLine={false}>{pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Data Contribution</CardTitle></CardHeader>
                <CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={barChartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><Bar dataKey="value" fill="#9EAFD8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent>
            </Card>
        </div>
    );
}