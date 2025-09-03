"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, BarChart2 } from "lucide-react";
import Link from 'next/link';
const recentActivity = Array(7).fill({
    time: "3 pm, 3 Jan 2025", activity: "New Post", fileType: "PNGs", user: "Jhon Doe", userType: "Tenant",
    community: "Toronto Health Community"
});

const barChartData = [
    { name: 'Jan', value: 2400 }, { name: 'Feb', value: 1398 }, { name: 'Mar', value: 3800 },
    { name: 'Apr', value: 2908 }, { name: 'May', value: 4800 }, { name: 'Jun', value: 3800 },
];

const pieChartData = [{ name: 'Group A', value: 400 }, { name: 'Group B', value: 300 }];
const COLORS = ['#FFBB28', '#00C49F'];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Community Management</h1>
                <div className="flex gap-4">
                    <Link href="/project-admin-wf/create-community">
                        <Button variant="outline">Create Community</Button>
                    </Link>
                    <Link href="/project-admin-wf/invite-members">
                        <Button>Invite Members</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Members</CardTitle><Users className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Users</CardTitle><TrendingUp className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Engagement Rate</CardTitle><BarChart2 className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">My Communities</h2>
                <Tabs defaultValue="all"><TabsList><TabsTrigger value="all">All (120)</TabsTrigger><TabsTrigger value="internet">Internet (20)</TabsTrigger><TabsTrigger value="games">Games (20)</TabsTrigger><TabsTrigger value="technology">Technology (20)</TabsTrigger><TabsTrigger value="movies">Movies (20)</TabsTrigger><TabsTrigger value="television">Television (20)</TabsTrigger><TabsTrigger value="medicine">Medicine (20)</TabsTrigger></TabsList></Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>Growth of Content</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={barChartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} /><Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
                <Card><CardHeader><CardTitle>Distribution of Content</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" labelLine={false}>{pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Activity</TableHead><TableHead>File Type</TableHead><TableHead>User</TableHead><TableHead>User Type</TableHead><TableHead>Community</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                        <TableBody>{recentActivity.map((activity, index) => (<TableRow key={index}><TableCell>{activity.time}</TableCell><TableCell>{activity.activity}</TableCell><TableCell>{activity.fileType}</TableCell><TableCell>{activity.user}</TableCell><TableCell>{activity.userType}</TableCell><TableCell>{activity.community}</TableCell><TableCell className="text-right"><Button variant="link" className="p-0 h-auto text-destructive">Delete</Button> | <Button variant="link" className="p-0 h-auto">Warning</Button></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}