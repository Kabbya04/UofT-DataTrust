"use client"

import { useState, useMemo, useEffect } from "react"
import { Play, FileText, Download, Eye, Calendar, Users, Award, Star } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

// Mock data, in a real app this would come from an API
const mockUsers = {
    'alex-chen': { id: "USR-891-C", name: "Alex Chen", bio: "Data Science researcher specializing in machine learning algorithms.", joinedDate: new Date("2024-01-20") },
    'maria-rodriguez': { id: "USR-742-M", name: "Maria Rodriguez", bio: "Urban agriculture expert and sustainability advocate.", joinedDate: new Date("2024-02-10") }
};
const mockUserDatasets = {
    'alex-chen': [
        { id: "DS-101", title: "Secure Multi-Party Data Sharing Framework", description: "Revolutionary protocol enabling secure data collaboration.", uploadDate: new Date("2025-08-20"), size: "3.2 GB", downloads: 456, views: 2134, status: 'published', communityName: "Data Science Enthusiasts", fileType: "Python Package", isPublic: true },
        { id: "DS-102", title: "Cross-Community ML Algorithm Benchmarks", description: "Comprehensive performance analysis of machine learning algorithms.", uploadDate: new Date("2025-08-15"), size: "1.8 GB", downloads: 289, views: 1567, status: 'published', communityName: "Data Science Enthusiasts", fileType: "Research Paper", isPublic: true }
    ],
    'maria-rodriguez': [
        { id: "DS-201", title: "Urban Community Garden Yield Analysis 2025", description: "Detailed analysis of crop yields from 50+ urban community gardens.", uploadDate: new Date("2025-08-18"), size: "2.1 GB", downloads: 234, views: 1456, status: 'published', communityName: "Urban Gardening", fileType: "Dataset CSV", isPublic: true }
    ]
};
const achievements = [
    { id: 1, name: "Data Pioneer", icon: Award, description: "First dataset uploaded" },
    { id: 2, name: "Community Builder", icon: Users, description: "Joined 5+ communities" },
    { id: 3, name: "Top Contributor", icon: Star, description: "100+ contributions" },
];

interface PageProps {
    params: Promise<{ userId: string }>
}

export default function UserProfilePage({ params }: PageProps) {
    const [userId, setUserId] = useState<string>("")
    const [activeTab, setActiveTab] = useState("latest");

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            setUserId(resolvedParams.userId)
        }
        resolveParams()
    }, [params])

    const userProfile = mockUsers[userId as keyof typeof mockUsers] || { id: "N/A", name: "Unknown User", bio: "User not found.", joinedDate: new Date() };
    const userDatasets = useMemo(() => {
        return mockUserDatasets[userId as keyof typeof mockUserDatasets] || [];
    }, [userId]);

    const sortedDatasets = useMemo(() => {
        const datasets = [...userDatasets];
        switch (activeTab) {
            case 'popular': return datasets.sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads));
            case 'most-used': return datasets.sort((a, b) => b.downloads - a.downloads);
            default: return datasets.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
        }
    }, [userDatasets, activeTab]);

    if (!userId) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-1">
            <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold">{userProfile.name}</h1><Button variant="default">Follow</Button></div>
            <div className="flex gap-6">
                <div className="flex-1">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                        <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="latest">Latest</TabsTrigger><TabsTrigger value="popular">Popular</TabsTrigger><TabsTrigger value="most-used">Most Used</TabsTrigger></TabsList>
                    </Tabs>
                    <div className="space-y-4">
                        {sortedDatasets.length === 0 ? <Card className="border border-border"><CardContent className="p-8 text-center"><div className="text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-medium mb-2">No datasets found</h3><p className="text-sm">This user has not shared any public datasets yet.</p></div></CardContent></Card> : sortedDatasets.map((dataset) => (
                            <Card key={dataset.id} className="border border-border hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        <div className="w-64 h-40 bg-muted flex items-center justify-center relative overflow-hidden rounded-l-lg"><div className="bg-background/90 rounded-full p-3"><Play className="h-8 w-8 text-primary fill-current" /></div></div>
                                        <div className="flex-1 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1"><div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-foreground text-lg">{dataset.title}</h3><Badge variant="secondary" className="text-xs">{dataset.status}</Badge></div><p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dataset.description}</p></div>
                                                <div className="text-right ml-4"><div className="text-lg font-bold text-primary">{dataset.communityName}</div></div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center gap-4"><span>{dataset.uploadDate.toLocaleDateString()}</span><span>•</span><span>{dataset.size}</span><span>•</span><span>{dataset.fileType}</span></div>
                                                <div className="flex items-center gap-4"><div className="flex items-center gap-1"><Eye className="h-4 w-4" /><span>{dataset.views.toLocaleString()}</span></div><div className="flex items-center gap-1"><Download className="h-4 w-4" /><span>{dataset.downloads.toLocaleString()}</span></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="w-80 space-y-6">
                    <Card className="border border-border"><CardContent className="p-4"><h3 className="font-semibold text-foreground mb-4">Stats</h3><div className="grid grid-cols-2 gap-6"><div className="text-center"><div className="text-2xl font-bold text-foreground">5</div><div className="text-sm text-muted-foreground">Communities</div></div><div className="text-center"><div className="text-2xl font-bold text-foreground">{userDatasets.length}</div><div className="text-sm text-muted-foreground">Datasets</div></div></div></CardContent></Card>
                    <Card className="border border-border"><CardContent className="p-4"><h3 className="font-semibold text-foreground mb-4">Achievements</h3><div className="grid grid-cols-3 gap-3">{achievements.map((achievement) => (<div key={achievement.id} className="aspect-square bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer" title={`${achievement.name}: ${achievement.description}`}><achievement.icon className="h-6 w-6 text-muted-foreground" /></div>))}</div></CardContent></Card>
                </div>
            </div>
        </div>
    )
}