"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";

export default function CreateNewCommunityPage() {
    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Create New Community</h1>
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="comm-name">COMMUNITY NAME</Label>
                        <Input id="comm-name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comm-cat">COMMUNITY CATEGORY/TOPIC</Label>
                        <div className="flex gap-2">
                            <Input id="comm-cat" className="flex-grow"/>
                            <Button variant="outline">CREATE NEW</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comm-desc">Description</Label>
                        <Textarea id="comm-desc" className="min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comm-admin">Select Admin</Label>
                        <Select><SelectTrigger id="comm-admin"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="jhon">Jhon Doe</SelectItem></SelectContent></Select>
                    </div>
                    <div>
                        <Button>Create Community</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}