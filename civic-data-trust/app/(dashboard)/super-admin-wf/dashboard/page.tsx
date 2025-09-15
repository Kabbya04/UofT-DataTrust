"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { TrendingUp, Circle, Flag, Plus, X } from "lucide-react";
import Link from "next/link";
// Import the new chart components
import { SankeyChartPlaceholder } from "@/app/components/charts/SankeyChartPlaceholder";
import { HeatmapPlaceholder } from "@/app/components/charts/HeatmapPlaceholder";

const stats = [
    { title: "Total Topics", value: "509", change: "6.53%", color: "bg-yellow-400" },
    { title: "Total Communities", value: "498", change: "6.9%", color: "bg-purple-400" },
    { title: "Data Uploaded this month", value: "30 GB", change: "12.31%", color: "bg-teal-400" },
    { title: "Data Download this month", value: "380", change: "7%", color: "bg-blue-400" },
    { title: "Total Community Members", value: "551", change: "6.32%", color: "bg-indigo-400" },
    { title: "Total Researchers", value: "532", change: "9%", color: "bg-green-400" },
    { title: "Research Executed", value: "445", change: "2.44%", color: "bg-lime-400" },
    { title: "Approved Research", value: "353", change: "25%", color: "bg-emerald-400" },
    { title: "Total Posts", value: "412", change: "5.22%", color: "bg-orange-400" },
    { title: "Super Admin", value: "331", change: "5.21%", color: "bg-red-400" },
];

const initialTopCategories = [
    { id: 1, category: "Health", communities: 234, posts: 234234, researchers: 203453, growth: "23%" },
    { id: 2, category: "Fitness", communities: 153, posts: 203453, researchers: 203453, growth: "23%" },
    { id: 3, category: "AI", communities: 135, posts: 193435, researchers: 193435, growth: "23%" },
];

const recentActivity = [
    { text: "Admin permission updated for Jhon Doe", time: "2 hours ago" },
    { text: "Content flagged in Health community", time: "2 hours ago" },
    { text: "New community 'Machine Learning' created", time: "2 hours ago" },
];

// Edit Category Modal Component
function EditCategoryModal({ isOpen, onClose, categoryName, onSave }: {
    isOpen: boolean;
    onClose: () => void;
    categoryName: string;
    onSave: (newName: string) => void;
}) {
    const [editedName, setEditedName] = useState(categoryName);

    const handleSave = () => {
        if (editedName.trim()) {
            onSave(editedName.trim());
            onClose();
        }
    };

    const handleCancel = () => {
        setEditedName(categoryName); // Reset to original name
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 gap-0">
                {/* Header with close button */}
                <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
                    <DialogTitle className="text-lg font-semibold">Edit Category/Topic</DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0 hover:bg-muted rounded-sm"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                {/* Content */}
                <div className="px-6 pb-6">
                    <div className="space-y-4">
                        {/* Input field */}
                        <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Enter category name"
                            className="w-full"
                            autoFocus
                        />

                        {/* Action buttons */}
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                onClick={handleCancel}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSave}
                                className="px-6 bg-black hover:bg-black/90 text-white"
                                disabled={!editedName.trim()}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function SuperAdminDashboardPage() {
    // State for managing categories and modal
    const [topCategories, setTopCategories] = useState(initialTopCategories);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);

    // Handle edit button click
    const handleEditClick = (categoryId: number, categoryName: string) => {
        setEditingCategory({ id: categoryId, name: categoryName });
        setIsEditModalOpen(true);
    };

    // Handle saving edited category
    const handleSaveCategory = (newName: string) => {
        if (editingCategory) {
            setTopCategories(prev => 
                prev.map(cat => 
                    cat.id === editingCategory.id 
                        ? { ...cat, category: newName }
                        : cat
                )
            );
        }
    };

    // Handle delete category
    const handleDeleteCategory = (categoryId: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setTopCategories(prev => prev.filter(cat => cat.id !== categoryId));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/super-admin-wf/create-new-community">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Community
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Link href="/super-admin-wf/add-new-admin">
                            Add New Admin
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Link href="/super-admin-wf/send-announcement">Send Announcement</Link>
                    </Button>
                    <Button variant="destructive">
                        <Flag className="h-4 w-4 mr-2" />
                        <Link href="/super-admin-wf/review-flags">
                            Review Flags
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {stats.map(stat => (
                    <Card key={stat.title} className={`${stat.color} text-black bg-card border border-border`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{stat.value}</div>
                            <p className="text-xs flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />{stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">All Communities</h2>
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">All (520)</TabsTrigger>
                        <TabsTrigger value="internet">Internet (20)</TabsTrigger>
                        <TabsTrigger value="games">Games (20)</TabsTrigger>
                        <TabsTrigger value="technology">Technology (20)</TabsTrigger>
                        <TabsTrigger value="movies">Movies (20)</TabsTrigger>
                        <TabsTrigger value="television">Television (20)</TabsTrigger>
                        <TabsTrigger value="medicine">Medicine (20)</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border border-border">
                    <CardHeader><CardTitle>Global Data Flow (Sankey Chart)</CardTitle></CardHeader>
                    <CardContent>
                        {/* --- REPLACED IMAGE WITH DYNAMIC CHART --- */}
                        <SankeyChartPlaceholder />
                    </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                    <CardHeader><CardTitle>Data Categories (Heatmap)</CardTitle></CardHeader>
                    <CardContent>
                        {/* --- REPLACED IMAGE WITH DYNAMIC CHART --- */}
                        <HeatmapPlaceholder />
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card border border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Categories/Topic</CardTitle>
                    <Button variant="link">
                        <Link href={'/super-admin-wf/all-categories'}>SEE ALL</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Communities</TableHead>
                                <TableHead>Total Posts</TableHead>
                                <TableHead>Total Researchers</TableHead>
                                <TableHead>Growth</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topCategories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>{cat.category}</TableCell>
                                    <TableCell>{cat.communities}</TableCell>
                                    <TableCell>{cat.posts.toLocaleString()}</TableCell>
                                    <TableCell>{cat.researchers.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{cat.growth}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="link" 
                                            className="p-0 h-auto"
                                            onClick={() => handleEditClick(cat.id, cat.category)}
                                        >
                                            Edit
                                        </Button>
                                        {" | "}
                                        <Button 
                                            variant="link" 
                                            className="p-0 h-auto text-destructive"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Activity</CardTitle>
                        <Button variant="link">SEE ALL</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivity.map((activity, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-2 h-2 mt-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                <div>
                                    <p>{activity.text}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                    <CardHeader><CardTitle>Platform Status</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p className="flex items-center gap-2">
                            <Circle className="h-3 w-3 text-green-500 fill-current" />
                            API Server: Online
                        </p>
                        <p className="flex items-center gap-2">
                            <Circle className="h-3 w-3 text-orange-500 fill-current" />
                            Storage: 85% Full
                        </p>
                        <p className="flex items-center gap-2">
                            <Circle className="h-3 w-3 text-green-500 fill-current" />
                            Database: Online
                        </p>
                        <p className="flex items-center gap-2">
                            <Circle className="h-3 w-3 text-green-500 fill-current" />
                            CDN: Online
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Category Modal */}
            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                categoryName={editingCategory?.name || ""}
                onSave={handleSaveCategory}
            />
        </div>
    );
}