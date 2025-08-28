"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

const users = [
    { name: "Jhon Doe", email: "jhon@email.com", role: "Super Admin", joinDate: "Jan 15, 2025", lastActivity: "1 hour ago", status: "Active" },
    { name: "Sarah Dell", email: "sarah@email.com", role: "Project Admin", joinDate: "Jan 15, 2025", lastActivity: "1 hour ago", status: "Active" },
    { name: "Jhon Doe", email: "jhon@email.com", role: "Super Admin", joinDate: "Jan 15, 2025", lastActivity: "1 hour ago", status: "Active" },
    { name: "Sarah Dell", email: "sarah@email.com", role: "Project Admin", joinDate: "Jan 15, 2025", lastActivity: "1 hour ago", status: "Inactive" },
    { name: "Jhon Doe", email: "jhon@email.com", role: "Super Admin", joinDate: "Jan 15, 2025", lastActivity: "1 hour ago", status: "Active" },
    { name: "Sarah Dell", email: "sarah@email.com", role: "Project Admin", joinDate: "Jan 15, 2025", lastActivity: "1 hour ago", status: "Active" },
];

export default function UserManagementPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">User Management</h1>
                <Button><UserPlus className="h-4 w-4 mr-2" />Add New User</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Users</CardTitle><UserCheck className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">New Signups</CardTitle><UserPlus className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Suspended Accounts</CardTitle><UserX className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div><p className="text-xs text-muted-foreground">+100% vs last month</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Filter By</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Registration Date" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Activity Level" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Role" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        <Select><SelectTrigger className="w-full"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Join Date</TableHead><TableHead>Last Activity</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>{users.map((user, i) => (<TableRow key={i}><TableCell>{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.role}</TableCell><TableCell>{user.joinDate}</TableCell><TableCell>{user.lastActivity}</TableCell><TableCell>{user.status}</TableCell><TableCell className="text-right"><div className="flex gap-2 justify-end"><Button variant="outline">Edit</Button><Button variant="destructive">Delete</Button></div></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}