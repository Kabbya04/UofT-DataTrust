'use client';

import { useState } from 'react';
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ImageIcon } from "lucide-react";

const categories = ["All (120)", "Internet (20)", "Games (20)", "Technology (20)", "Movies (20)", "Television (20)", "Medicine (20)"];
const communities = {
    Internet: Array(3).fill({ name: "Toronto Health Community", members: 124, datasets: 18, field: "Healthcare data & research" }),
    Games: Array(3).fill({ name: "Gaming Analytics Hub", members: 88, datasets: 12, field: "Gaming user data" }),
    AI: Array(3).fill({ name: "AI Research Collective", members: 210, datasets: 45, field: "AI model datasets" }),
    Fitness: Array(3).fill({ name: "Fitness & Wellness Data", members: 150, datasets: 22, field: "Wearable tech data" }),
};

const CommunityCard = ({ community }: { community: any }) => (
    <Card className="p-4">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-lg"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>
            <div className="flex-1">
                <h3 className="font-semibold">{community.name}</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 mb-4 space-y-1">
                    <li>{community.members} members</li>
                    <li>{community.datasets} datasets</li>
                    <li>{community.field}</li>
                </ul>
                <Button variant="outline" size="sm">View Details</Button>
            </div>
        </div>
    </Card>
);

export default function MyCommunitiesPage() {
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Communities</h1>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "secondary"}
                        onClick={() => setActiveCategory(cat)}
                        className="rounded-full px-4"
                    >
                        {cat}
                    </Button>
                ))}
            </div>
            <div className="space-y-8">
                {Object.entries(communities).map(([category, items]) => (
                    <div key={category}>
                        <h2 className="text-xl font-semibold mb-4">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((community, index) => (
                                <CommunityCard key={index} community={community} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}