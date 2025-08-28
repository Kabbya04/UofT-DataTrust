"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";

const requests = Array(10).fill({
    name: "Jhon Doe", requestTime: "10:15 am, 7 Sep 2025", message: "Interested in joining"
});

export default function MembershipRequestsPage() {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Membership Requests</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">ALL</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab}>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Request Time</TableHead><TableHead>Message</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                                <TableBody>{requests.map((req, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{req.name}</TableCell>
                                        <TableCell>{req.requestTime}</TableCell>
                                        <TableCell>{req.message}</TableCell>
                                        <TableCell className="text-right"><div className="flex gap-2 justify-end"><Button>Approve</Button><Button variant="outline">Reject</Button></div></TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}