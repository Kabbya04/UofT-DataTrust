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


            {/* My communities */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">My Community</h2>


                <div>
                    <Tabs defaultValue="all" className="">
                        <TabsList className="flex gap-2 items-center justify-start bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="all"
                                className="bg-blue-500 text-white hover:bg-blue-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="internet"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                Internet (20)
                            </TabsTrigger>
                            <TabsTrigger
                                value="games"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                Games (20)
                            </TabsTrigger>
                            <TabsTrigger
                                value="technology"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                Technology (20)
                            </TabsTrigger>
                            <TabsTrigger
                                value="movies"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                Movies (20)
                            </TabsTrigger>
                            <TabsTrigger
                                value="television"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                Television (20)
                            </TabsTrigger>
                            <TabsTrigger
                                value="medicine"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
                            >
                                Medicine (20)
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <Card className="border border-gray-200 rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Growth of Content</CardTitle>
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
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#60A5FA"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Distribution of Content</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center">
                            <div className="relative">
                                <ResponsiveContainer width={200} height={200}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Active', value: 82.3 },
                                                { name: 'Inactive', value: 17.7 }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            startAngle={90}
                                            endAngle={450}
                                            paddingAngle={2}
                                            dataKey="value"
                                            labelLine={false}
                                        >
                                            <Cell fill="#60A5FA" />
                                            <Cell fill="#E5E7EB" />
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
            </div>



            <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Activity</TableHead><TableHead>File Type</TableHead><TableHead>User</TableHead><TableHead>User Type</TableHead><TableHead>Community</TableHead><TableHead >Action</TableHead></TableRow></TableHeader>
                        <TableBody>{recentActivity.map((activity, index) => (<TableRow key={index}><TableCell>{activity.time}</TableCell><TableCell>{activity.activity}</TableCell><TableCell>{activity.fileType}</TableCell><TableCell>{activity.user}</TableCell><TableCell>{activity.userType}</TableCell><TableCell>{activity.community}</TableCell><TableCell className="text-right"><Button variant="secondary" className=" h-auto bg-green-500 ">Delete</Button> <Button variant="destructive" className=" h-auto">Warning</Button></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}