"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { PlayCircle } from 'lucide-react';

const postsToReview = Array(3).fill({
    title: "TITLE",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    communityName: "Community Name"
});

export default function PostReviewPage() {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Post Review (320)</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">ALL</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="pt-6">
                    <div className="space-y-6">
                        {postsToReview.map((post, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-48 h-32 bg-muted rounded-md flex-shrink-0 flex items-center justify-center">
                                            <PlayCircle className="h-12 w-12 text-muted-foreground/50"/>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{post.title}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1 mb-3">{post.description}</p>
                                                </div>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">{post.communityName}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button>Approve</Button>
                                            <Button variant="destructive">Reject</Button>
                                            <Button variant="outline">Request changes</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}