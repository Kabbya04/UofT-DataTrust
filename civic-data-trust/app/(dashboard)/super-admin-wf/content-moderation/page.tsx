"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ShieldAlert, ShieldCheck, ShieldX, ArrowUpRightFromSquare } from "lucide-react";

const flags = Array(7).fill({
    community: "Get Better", type: "Health", admin: "Jhon Doe", dateCreated: "Jan 15, 2025"
});

export default function ContentModerationPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Content Moderation</h1>
                <Button variant="outline">Moderation Guidelines</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Reviews</CardTitle><ShieldAlert className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">90,000</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Approved Today</CardTitle><ShieldCheck className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Rejected Today</CardTitle><ShieldX className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">50,000</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Escalated</CardTitle><ArrowUpRightFromSquare className="h-5 w-5 text-muted-foreground" /></CardHeader><CardContent><div className="text-3xl font-bold">30,000</div></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                <CardContent>
                    <Tabs defaultValue="communities">
                        <TabsList className="mb-4"><TabsTrigger value="communities">Communities</TabsTrigger><TabsTrigger value="contents">Contents</TabsTrigger><TabsTrigger value="profiles">Profiles</TabsTrigger></TabsList>
                        <div className="flex gap-4">
                            <Select><SelectTrigger className="w-full"><SelectValue placeholder="Flag Reason" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                            <Select><SelectTrigger className="w-full"><SelectValue placeholder="Severity" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                            <Select><SelectTrigger className="w-full"><SelectValue placeholder="Reporter Type" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                            <Select><SelectTrigger className="w-full"><SelectValue placeholder="Date" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem></SelectContent></Select>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Community</TableHead><TableHead>Type</TableHead><TableHead>Admin</TableHead><TableHead>Date Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>{flags.map((flag, i) => (<TableRow key={i}><TableCell>{flag.community}</TableCell><TableCell>{flag.type}</TableCell><TableCell>{flag.admin}</TableCell><TableCell>{flag.dateCreated}</TableCell><TableCell className="text-right"><div className="flex gap-2 justify-end"><Button>Approve</Button><Button variant="destructive">Reject</Button></div></TableCell></TableRow>))}</TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}