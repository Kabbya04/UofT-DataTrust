"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { FileClock } from "lucide-react";

export default function CommunityAuditLogsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Community Audit Logs</h1>
            <Card>
                <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Date</label>
                            <Input type="text" defaultValue="1 Sep 2025" className="w-40" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm">to</label>
                            <Input type="text" defaultValue="1 Sep 2025" className="w-40" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm">User</label>
                            <Select defaultValue="all"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Data Type</label>
                            <Select defaultValue="all"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
                        </div>
                        <Button 
                            variant="outline" 
                            style={{ backgroundColor: "#2196F3", color: "white", border: "none" }}
                        >
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center py-20 text-muted-foreground">
                <FileClock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No logs to display for the selected period.</p>
                <p className="text-sm">Adjust the filters to see results.</p>
            </div>
        </div>
    );
}