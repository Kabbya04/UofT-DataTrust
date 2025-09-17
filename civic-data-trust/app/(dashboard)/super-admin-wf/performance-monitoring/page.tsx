"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CheckCircle, Clock } from "lucide-react";

const timeErrorRateData = [
    { name: '10am', time: 120, error: 2.5 }, { name: '11am', time: 150, error: 1.8 },
    { name: '12pm', time: 100, error: 3.2 }, { name: '1pm', time: 180, error: 1.2 },
    { name: '2pm', time: 130, error: 4.1 }, { name: '3pm', time: 200, error: 2.1 },
];
const serverLoadData = Array.from({ length: 12 }, (_, i) => ({ name: `${i+8}h`, load: Math.random() * 80 + 10 }));
const incidents = [
    { text: "Lorem ipsum dolor", time: "2 hours ago", status: "Resolved" },
    { text: "Lorem ipsum dolor", time: "2 hours ago", status: "Resolved" },
    { text: "Lorem ipsum dolor", time: "2 hours ago", status: "Resolved" },
];

export default function PerformanceMonitoringPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Performance Monitoring</h1>
            <Tabs defaultValue="24h"><TabsList><TabsTrigger value="24h">Last 24 hours</TabsTrigger><TabsTrigger value="7d">Last 7 Days</TabsTrigger><TabsTrigger value="30d">Last 30 Days</TabsTrigger><TabsTrigger value="90d">Last 90 Days</TabsTrigger></TabsList></Tabs>

            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><CheckCircle className="h-6 w-6 text-green-500" /><div><p className="font-semibold">All systems running</p><p className="text-xs text-muted-foreground">Last Incident: 3 days ago</p></div></div>
                    <div><p className="text-right font-semibold">99%</p><p className="text-xs text-muted-foreground">Platform uptime: 30 days</p></div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Response Time</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Error Rate</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Users</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>Response Time & Error Rate</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={timeErrorRateData}><XAxis dataKey="name" fontSize={12} /><YAxis /><Line type="monotone" yAxisId="left" dataKey="time" stroke="#8884d8" /><Line type="monotone" yAxisId="right" dataKey="error" stroke="#82ca9d" /></LineChart></ResponsiveContainer></CardContent></Card>
                <Card><CardHeader><CardTitle>Server Load</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={serverLoadData}><XAxis dataKey="name" fontSize={12} /><YAxis /><Line type="monotone" dataKey="load" stroke="hsl(var(--primary))" dot={false} /></LineChart></ResponsiveContainer></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Recent Incidents</CardTitle><Button variant="link">SEE ALL</Button></CardHeader>
                    <CardContent className="space-y-6">
                        {incidents.map((incident, i) => (
                            <div key={i} className="flex items-center gap-4"><Clock className="h-5 w-5 text-muted-foreground" /><div><p>{incident.text}</p><p className="text-xs text-muted-foreground">{incident.time}</p></div><Button variant="outline" size="sm" className="ml-auto bg-green-100 text-green-800 border-green-200 hover:bg-green-200"><CheckCircle className="h-4 w-4 mr-2"/>{incident.status}</Button></div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>System Resources</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><div className="flex justify-between mb-1"><label className="text-sm">CPU Usage</label><span>50%</span></div><Progress value={50} className="bg-[#EBEBEB] [&>div]:bg-[#2196F3]" /></div>
                        <div><div className="flex justify-between mb-1"><label className="text-sm">Memory Usage</label><span>50%</span></div><Progress value={50} className="bg-[#EBEBEB] [&>div]:bg-[#2196F3]" /></div>
                        <div><div className="flex justify-between mb-1"><label className="text-sm">Disk Usage</label><span>50%</span></div><Progress value={50} className="bg-[#EBEBEB] [&>div]:bg-[#2196F3]" /></div>
                        <div><div className="flex justify-between mb-1"><label className="text-sm">Network</label><span>50%</span></div><Progress value={50} className="bg-[#EBEBEB] [&>div]:bg-[#2196F3]" /></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}