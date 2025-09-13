'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, ArrowLeft, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/components/contexts/auth-context';

interface CommunityCategory {
    id: string;
    name: string;
}

export default function CreateCommunityPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        community_category_id: '',
        description: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<CommunityCategory[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch community categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await fetch('/api/community-category?limit=100', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Categories response:', data);

                    // Handle different response formats
                    const categoriesData = data.data || data;
                    if (Array.isArray(categoriesData)) {
                        setCategories(categoriesData);
                    } else {
                        console.error('Unexpected categories response format:', data);
                        setError('Failed to load categories');
                    }
                } else {
                    console.error('Failed to fetch categories:', response.status);
                    setError('Failed to load categories');
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            console.log('Creating community with data:', formData);

            // Call the API service
            const response = await api.communities.create(
                formData.name,
                formData.community_category_id,
                formData.description || undefined
            );

            console.log('Community created successfully:', response);

            setSuccess(`Community "${formData.name}" created successfully!`);

            // Reset form
            setFormData({
                name: '',
                community_category_id: '',
                description: ''
            });

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push('/project-admin-wf/dashboard');
            }, 2000);

        } catch (err: any) {
            console.error('Failed to create community:', err);

            if (err.status === 401) {
                setError('Authentication failed. Please sign in again.');
            } else if (err.status === 400) {
                setError('Invalid community data. Please check your inputs.');
            } else if (err.status === 409) {
                setError('A community with this name already exists.');
            } else {
                setError(err.message || 'Failed to create community. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear errors when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <Link href="/project-admin-wf/dashboard">
                <ArrowLeft className="h-6 w-6 mb-8" />
            </Link>
            <div className="w-full mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Community</h1>
                    <p className="text-muted-foreground">
                        Set up a new community space for collaboration and discussion
                    </p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Main Form Card */}
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Community Details</span>
                    </CardTitle>
                    <CardDescription>
                        Provide the basic information for your new community
                    </CardDescription>
                </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            {/* Community Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Community Name *
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter community name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Choose a clear, descriptive name that represents your community
                                </p>
                            </div>

                            {/* Community Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-medium">
                                    Community Category/Topic *
                                </Label>
                                <Select
                                    value={formData.community_category_id}
                                    onValueChange={(value) => handleInputChange('community_category_id', value)}
                                    disabled={loadingCategories}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={
                                            loadingCategories ? "Loading categories..." : "Select a category"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.length === 0 && !loadingCategories ? (
                                            <SelectItem value="" disabled>
                                                No categories available
                                            </SelectItem>
                                        ) : (
                                            categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Select the primary topic or category for your community
                                    {loadingCategories && " (Loading categories...)"}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what your community is about, its purpose, and what members can expect..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="min-h-[120px] resize-none"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Provide a clear description of your community&apos;s purpose and goals (minimum 50 characters)
                                </p>
                            </div>

                            {/* Current User Info */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Community Administrator
                                </Label>
                                <div className="p-3 bg-muted/50 border rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{user?.name || 'Current User'}</span>
                                        <span className="text-xs text-muted-foreground">({user?.email || 'unknown@example.com'})</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        You will be automatically assigned as the administrator of this community
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <Link href="/project-admin-wf/dashboard">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !formData.name || !formData.community_category_id || loadingCategories}
                                    className="min-w-[140px]"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        'Create Community'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tips Card */}
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">💡 Community Creation Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>• Choose a name that clearly represents your community&apos;s focus</p>
                        <p>• Write a detailed description to help potential members understand the community&apos;s purpose</p>
                        <p>• Select an admin who is committed to moderating and growing the community</p>
                        <p>• Consider starting with a public community to encourage growth, then switch to private if needed</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}