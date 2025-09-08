"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { communityService, CommunityCategory } from "@/app/services/community";
import { Loader2, Plus } from "lucide-react";

export default function CreateNewCommunityPage() {
    const router = useRouter();
    const [communityName, setCommunityName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<CommunityCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const fetchedCategories = await communityService.getCommunityCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setError('Failed to load categories. Using defaults.');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleCreateCommunity = async () => {
        if (!communityName.trim()) {
            setError('Community name is required.');
            return;
        }

        if (!selectedCategoryId) {
            setError('Please select a category.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            const communityData = {
                name: communityName.trim(),
                community_category_id: selectedCategoryId,
                description: description.trim() || undefined,
            };

            console.log('Creating community with data:', communityData);
            
            const result = await communityService.createCommunity(communityData);
            console.log('Community created:', result);
            
            setSuccess('Community created successfully!');
            
            // Reset form
            setCommunityName('');
            setSelectedCategoryId('');
            setDescription('');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/super-admin-wf/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Community creation error:', error);
            setError(error instanceof Error ? error.message : 'Failed to create community. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            return;
        }

        try {
            setIsCreatingCategory(true);
            const newCategory = await communityService.createCommunityCategory(newCategoryName.trim());
            setCategories(prev => [...prev, newCategory]);
            setSelectedCategoryId(newCategory.id);
            setNewCategoryName('');
            setIsCreateCategoryDialogOpen(false);
        } catch (error) {
            console.error('Category creation error:', error);
            setError(error instanceof Error ? error.message : 'Failed to create category.');
        } finally {
            setIsCreatingCategory(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Create New Community</h1>
            
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
                    {success}
                </div>
            )}
            
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="comm-name">COMMUNITY NAME *</Label>
                        <Input 
                            id="comm-name" 
                            value={communityName}
                            onChange={(e) => setCommunityName(e.target.value)}
                            placeholder="Enter community name"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="comm-cat">COMMUNITY CATEGORY/TOPIC *</Label>
                        <div className="flex gap-2">
                            <Select 
                                value={selectedCategoryId} 
                                onValueChange={setSelectedCategoryId}
                                disabled={isLoading || isLoadingCategories}
                            >
                                <SelectTrigger id="comm-cat" className="flex-grow">
                                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsCreateCategoryDialogOpen(true)}
                                disabled={isLoading}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                CREATE NEW
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="comm-desc">Description</Label>
                        <Textarea 
                            id="comm-desc" 
                            className="min-h-[120px]" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter community description (optional)"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <Button 
                            onClick={handleCreateCommunity}
                            disabled={isLoading || !communityName.trim() || !selectedCategoryId}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating Community...
                                </>
                            ) : (
                                'Create Community'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            {/* Create Category Dialog */}
            <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-category">Category Name</Label>
                            <Input
                                id="new-category"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                                disabled={isCreatingCategory}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setIsCreateCategoryDialogOpen(false);
                                    setNewCategoryName('');
                                }}
                                disabled={isCreatingCategory}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateCategory}
                                disabled={isCreatingCategory || !newCategoryName.trim()}
                            >
                                {isCreatingCategory ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Category'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}