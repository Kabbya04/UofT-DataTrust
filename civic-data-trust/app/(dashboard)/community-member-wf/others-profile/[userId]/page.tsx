"use client"

import { useState, useEffect } from "react"
import { Card } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Search, Bell, Settings } from "lucide-react"
import { Input } from "../../../../components/ui/input"
import ExpandableContentCard from "../../../../components/dashboard/expandable-content-card"

interface OthersProfilePageProps {
    params: Promise<{ userId: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function OthersProfilePage({ params }: OthersProfilePageProps) {
    const [activeTab, setActiveTab] = useState("latest")
    const [userId, setUserId] = useState<string>("")
    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            setUserId(resolvedParams.userId)
        }
        resolveParams()
    }, [params])

    // Add loading state
    if (!userId) {
        return <div>Loading...</div>
    }

    // Mock user data
    const userData = {
        name: "Jane Doe",
        username: "janedoe",
        avatar: "/placeholder.svg?height=100&width=100",
        isFollowing: false,
        stats: {
            communities: 12,
            datasets: 15,
        },
        interests: ["Research", "Analytics", "Insights", "Biology", "Physics", "Chemistry"],
    }

    // Mock posts data
    const posts = [
        {
            id: "1",
            title: "Title Goes Here",
            author: {
                name: userData.name,
                avatar: userData.avatar,
                username: userData.username,
            },
            timestamp: "1 hour ago",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            videoThumbnail: "/placeholder.svg?height=200&width=400",
            communityName: "Community Name",
        },
        {
            id: "2",
            title: "Another Post Title",
            author: {
                name: userData.name,
                avatar: userData.avatar,
                username: userData.username,
            },
            timestamp: "2 hours ago",
            content:
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            videoThumbnail: "/placeholder.svg?height=200&width=400",
            communityName: "Community Name",
        },
    ]

    // Mock achievements data
    const achievements = [
        { id: 1, name: "First Post", earned: true },
        { id: 2, name: "Community Builder", earned: true },
        { id: 3, name: "Data Expert", earned: false },
        { id: 4, name: "Top Contributor", earned: true },
        { id: 5, name: "Research Pioneer", earned: false },
        { id: 6, name: "Analytics Master", earned: false },
    ]

    return (

        <div className="max-w-6xl mx-auto">
            <div className="flex gap-6">
                <div className="flex-1">
                    {/* Profile Header */}
                    <Card className="p-6 mb-6 border-none">
                        <div className="flex items-center justify-start gap-2">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                                    <AvatarFallback className="bg-gray-600 text-white text-lg">
                                        {userData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="">
                                    <h1 className="text-xl font-semibold">{userData.name}</h1>

                                </div>

                            </div>
                            <Button variant={userData.isFollowing ? "outline" : "default"} size="sm" className="mt-2">
                                {userData.isFollowing ? "Following" : "Follow"}
                            </Button>
                        </div>
                    </Card>



                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 border-none bg-none">
                        <TabsList className=" bg-transparent">
                            <TabsTrigger value="latest">Latest</TabsTrigger>
                            <TabsTrigger value="popular">Popular</TabsTrigger>
                            <TabsTrigger value="most-used">Most Used</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Posts */}
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <ExpandableContentCard key={post.id} {...post} />
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-64 space-y-4">
                    {/* Stats */}
                    <Card className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-lg font-semibold">{userData.stats.communities}</div>
                                <div className="text-xs ">Communities</div>
                            </div>
                            <div>
                                <div className="text-lg font-semibold">{userData.stats.datasets}</div>
                                <div className="text-xs ">Datasets</div>
                            </div>
                        </div>
                    </Card>
                    {/* Achievements */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Achievements</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement.id} className="flex flex-col items-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-xs font-medium ${achievement.earned ? "bg-primary text-primary-foreground" : "bg-gray-300 text-gray-600"
                                            }`}
                                    >
                                        Badges
                                    </div>
                                    <span className="text-xs text-center mt-2 ">{achievement.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Interests */}
                    {/* <Card className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {userData.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </Card> */}
                </div>
            </div>
        </div>

    )
}
