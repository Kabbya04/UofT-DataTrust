'use client';

import { useState } from 'react';
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCommunityImage } from "@/app/utils/image-mapping";

const categories = ["All (120)", "Internet (20)", "Games (20)", "Technology (20)", "Movies (20)", "Television (20)", "Medicine (20)"];
const communities = {
    Internet: Array(3).fill({ id: 'internet', name: "Toronto Health Community", members: 124, datasets: 18, field: "Healthcare data & research" }),
    Games: Array(3).fill({ id: 'games', name: "Gaming Analytics Hub", members: 88, datasets: 12, field: "Gaming user data" }),
    AI: Array(3).fill({ id: 'ai', name: "AI Research Collective", members: 210, datasets: 45, field: "AI model datasets" }),
    Fitness: Array(3).fill({ id: 'fitness', name: "Fitness & Wellness Data", members: 150, datasets: 22, field: "Wearable tech data" }),
};

const CommunityCard = ({ community, index }: { community: any; index: number }) => (
    <Card className="bg-white border border-civic-gray-200 rounded-lg shadow-figma hover:shadow-figma-card transition-all duration-200">
        <div className="flex gap-4 p-4">
            <div className="relative w-[119px] h-[107px] rounded-md flex-shrink-0 overflow-hidden">
                <Image
                    src={getCommunityImage(`${community.id}-${index}`)}
                    alt={community.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="119px"
                    priority={false}
                />
            </div>
            <div className="flex-1 space-y-3">
                <h3 className="font-bold text-figma-lg text-civic-gray-900">{community.name}</h3>
                <div className="space-y-1 text-figma-base text-civic-gray-500">
                    <p>{community.members} members</p>
                    <p>{community.datasets} datasets</p>
                    <p>{community.field}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-3 rounded-lg border-civic-gray-200 text-civic-gray-500 hover:text-civic-gray-900 hover:border-civic-gray-300">View Details</Button>
            </div>
        </div>
    </Card>
);

export default function MyCommunitiesPage() {
    const [activeCategory, setActiveCategory] = useState(categories[0]);

    return (
        <div className="space-y-8 font-urbanist">
            <h1 className="text-figma-3xl font-bold text-civic-gray-900">My Communities</h1>
            
            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "secondary"}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "rounded-2xl px-5 py-3 text-figma-lg font-normal transition-all duration-200 whitespace-nowrap",
                            activeCategory === cat 
                                ? "bg-white shadow-figma text-civic-gray-900 font-bold"
                                : "bg-white text-civic-gray-500 hover:shadow-figma hover:text-civic-gray-900"
                        )}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
            
            {/* Communities Grid */}
            <div className="space-y-8">
                {Object.entries(communities).map(([category, items]) => (
                    <div key={category}>
                        <h2 className="text-figma-2xl font-bold text-civic-gray-900 mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((community, index) => (
                                <CommunityCard key={index} community={community} index={index} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}