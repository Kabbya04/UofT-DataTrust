"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, Edit, Trash2, Eye, TrendingUp } from "lucide-react";
import { EditCategoryModal } from "@/app/components/dashboard/EditCategoryModal";

// Mock data for categories
const categoriesData = [
    {
        id: 1,
        category: "Health",
        communities: "2.3k",
        totalPosts: "234.23k",
        totalResearchers: "234.23k",
        growth: "234.23%"
    },
    {
        id: 2,
        category: "Fitness",
        communities: "453",
        totalPosts: "203.453",
        totalResearchers: "203.453",
        growth: "203.453"
    },
    {
        id: 3,
        category: "AI",
        communities: "435",
        totalPosts: "193.435",
        totalResearchers: "193.435",
        growth: "193.435"
    },
    {
        id: 4,
        category: "Health",
        communities: "2.3k",
        totalPosts: "234.23k",
        totalResearchers: "234.23k",
        growth: "234.23%"
    },
    {
        id: 5,
        category: "Fitness",
        communities: "453",
        totalPosts: "203.453",
        totalResearchers: "203.453",
        growth: "203.453"
    },
    {
        id: 6,
        category: "AI",
        communities: "435",
        totalPosts: "193.435",
        totalResearchers: "193.435",
        growth: "193.435"
    },
    {
        id: 7,
        category: "Health",
        communities: "2.3k",
        totalPosts: "234.23k",
        totalResearchers: "234.23k",
        growth: "234.23%"
    },
    {
        id: 8,
        category: "Fitness",
        communities: "453",
        totalPosts: "203.453",
        totalResearchers: "203.453",
        growth: "203.453"
    },
    {
        id: 9,
        category: "AI",
        communities: "435",
        totalPosts: "193.435",
        totalResearchers: "193.435",
        growth: "193.435"
    },
    {
        id: 10,
        category: "Health",
        communities: "2.3k",
        totalPosts: "234.23k",
        totalResearchers: "234.23k",
        growth: "234.23%"
    },
    {
        id: 11,
        category: "Fitness",
        communities: "453",
        totalPosts: "203.453",
        totalResearchers: "203.453",
        growth: "203.453"
    },
    {
        id: 12,
        category: "AI",
        communities: "435",
        totalPosts: "193.435",
        totalResearchers: "193.435",
        growth: "193.435"
    }
];
const initialTopCategories = [
    { id: 1, category: "Health", communities: 234, posts: 234234, researchers: 203453, growth: "23%" },
    { id: 2, category: "Fitness", communities: 153, posts: 203453, researchers: 203453, growth: "23%" },
    { id: 3, category: "AI", communities: 135, posts: 193435, researchers: 193435, growth: "23%" },
];

export default function AllCategoriesTopicsPage() {
    // State for managing categories and modal
    const [topCategories, setTopCategories] = useState(initialTopCategories);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
    const router = useRouter();
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
    const handleViewDetails = (id: number) => {
        console.log(`Viewing details for category ${id}`);
        // Handle view details logic
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">All Categories/Topics</h1>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardContent className="p-0">
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold text-foreground px-6 py-4">
                                        Category
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground px-6 py-4">
                                        Communities
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground px-6 py-4">
                                        Total Posts
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground px-6 py-4">
                                        Total Researchers
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground px-6 py-4">
                                        Growth
                                    </TableHead>
                                    <TableHead className="font-semibold text-foreground px-6 py-4">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categoriesData.map((category, index) => (
                                    <TableRow
                                        key={category.id}
                                        className={`hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                                    >
                                        <TableCell className="font-medium px-6 py-4">
                                            {category.category}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {category.communities}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {category.totalPosts}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {category.totalResearchers}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                <span className="text-green-600 font-medium">
                                                    {category.growth}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleViewDetails(category.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEditClick(category.id, category.category)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Category
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Category
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer with pagination info */}
                    <div className="px-6 py-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Showing {categoriesData.length} categories
                        </p>
                    </div>
                </CardContent>
            </Card>

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