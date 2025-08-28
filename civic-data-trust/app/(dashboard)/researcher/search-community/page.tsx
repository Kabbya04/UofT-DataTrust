"use client"

import { useState } from "react"
import { Search, Filter, BookmarkPlus, History, ArrowUpDown, Users, Calendar, Tag } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Checkbox } from "../../../components/ui/checkbox"
import { Separator } from "../../../components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"

const mockCommunities = [
    {
        id: 1,
        name: "AI Research Hub",
        category: "Technology",
        description: "Advanced AI research and development community",
        members: 1250,
        tags: ["AI", "Machine Learning", "Research"],
        privacy: "Public",
        activity: "Very Active",
        founded: "2023",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Sustainable Living",
        category: "Environment",
        description: "Community focused on sustainable lifestyle practices",
        members: 890,
        tags: ["Sustainability", "Environment", "Green Living"],
        privacy: "Public",
        activity: "Active",
        founded: "2022",
        rating: 4.6,
    },
    {
        id: 3,
        name: "Startup Founders",
        category: "Business",
        description: "Network of entrepreneurs and startup founders",
        members: 2100,
        tags: ["Startup", "Entrepreneurship", "Business"],
        privacy: "Private",
        activity: "Very Active",
        founded: "2021",
        rating: 4.9,
    },
    {
        id: 4,
        name: "Digital Artists",
        category: "Arts",
        description: "Creative community for digital art enthusiasts",
        members: 750,
        tags: ["Digital Art", "Design", "Creative"],
        privacy: "Public",
        activity: "Moderate",
        founded: "2023",
        rating: 4.5,
    },
]

const savedSearches = [
    { id: 1, name: "AI Communities", query: "AI machine learning", filters: "Technology", saved: "2 days ago" },
    {
        id: 2,
        name: "Local Startups",
        query: "startup business",
        filters: "Business, Location: Local",
        saved: "1 week ago",
    },
    { id: 3, name: "Art & Design", query: "design creative", filters: "Arts", saved: "3 days ago" },
]

const SearchCommunity = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedPrivacy, setSelectedPrivacy] = useState("all")
    const [selectedActivity, setSelectedActivity] = useState("all")
    const [sortBy, setSortBy] = useState("relevance")
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [compareMode, setCompareMode] = useState(false)
    const [selectedForComparison, setSelectedForComparison] = useState<number[]>([])

    const handleCompareToggle = (communityId: number) => {
        setSelectedForComparison(
            (prev) =>
                prev.includes(communityId) ? prev.filter((id) => id !== communityId) : [...prev, communityId].slice(0, 3), // Max 3 communities for comparison
        )
    }

    const filteredCommunities = mockCommunities.filter((community) => {
        const matchesSearch =
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = selectedCategory === "all" || community.category === selectedCategory
        const matchesPrivacy = selectedPrivacy === "all" || community.privacy === selectedPrivacy
        const matchesActivity = selectedActivity === "all" || community.activity === selectedActivity

        return matchesSearch && matchesCategory && matchesPrivacy && matchesActivity
    })

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Community Search & Discovery</h1>
                    <p className="text-muted-foreground">Find and explore communities that match your interests</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={compareMode ? "default" : "outline"}
                        onClick={() => setCompareMode(!compareMode)}
                        className="flex items-center gap-2"
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        Compare Mode
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <History className="h-4 w-4" />
                                Saved Searches
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Saved Searches</DialogTitle>
                                <DialogDescription>Your previously saved search queries</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                                {savedSearches.map((search) => (
                                    <Card key={search.id} className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{search.name}</h4>
                                                <p className="text-sm text-muted-foreground">Query: {search.query}</p>
                                                <p className="text-xs text-muted-foreground">Filters: {search.filters}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">{search.saved}</p>
                                                <Button size="sm" variant="outline">
                                                    Load
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Main Search */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search communities by name, description, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Advanced Filters
                            </Button>
                            <Button className="flex items-center gap-2">
                                <BookmarkPlus className="h-4 w-4" />
                                Save Search
                            </Button>
                        </div>

                        {/* Basic Filters */}
                        <div className="flex gap-4">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Environment">Environment</SelectItem>
                                    <SelectItem value="Business">Business</SelectItem>
                                    <SelectItem value="Arts">Arts</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="members">Member Count</SelectItem>
                                    <SelectItem value="activity">Activity Level</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Advanced Filters */}
                        {showAdvancedFilters && (
                            <div className="border-t pt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Privacy Level</label>
                                        <Select value={selectedPrivacy} onValueChange={setSelectedPrivacy}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Privacy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="Public">Public</SelectItem>
                                                <SelectItem value="Private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Activity Level</label>
                                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Activity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="Very Active">Very Active</SelectItem>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Moderate">Moderate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Member Range</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Members" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="small">1-100</SelectItem>
                                                <SelectItem value="medium">101-1000</SelectItem>
                                                <SelectItem value="large">1000+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Found {filteredCommunities.length} communities</p>
                {compareMode && selectedForComparison.length > 0 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">Compare Selected ({selectedForComparison.length})</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Community Comparison</DialogTitle>
                                <DialogDescription>Compare selected communities side by side</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {selectedForComparison.map((id) => {
                                    const community = mockCommunities.find((c) => c.id === id)
                                    if (!community) return null
                                    return (
                                        <Card key={id}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{community.name}</CardTitle>
                                                <Badge variant="secondary">{community.category}</Badge>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-sm">{community.members} members</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm">Founded {community.founded}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4" />
                                                    <span className="text-sm">{community.activity}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{community.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {community.tags.map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Community Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community) => (
                    <Card key={community.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        {community.name}
                                        {compareMode && (
                                            <Checkbox
                                                checked={selectedForComparison.includes(community.id)}
                                                onCheckedChange={() => handleCompareToggle(community.id)}
                                            />
                                        )}
                                    </CardTitle>
                                    <CardDescription>{community.description}</CardDescription>
                                </div>
                                <Badge variant="secondary">{community.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{community.members} members</span>
                                </div>
                                <Badge variant={community.privacy === "Public" ? "default" : "secondary"}>{community.privacy}</Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Activity: {community.activity}</span>
                                <span className="text-muted-foreground">★ {community.rating}</span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {community.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <Separator />

                            <div className="flex justify-between ">
                                <Button  className="p-1">Join Community</Button>
                                <Button  variant="outline" className="p-1 bg-transparent">
                                    View Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default SearchCommunity