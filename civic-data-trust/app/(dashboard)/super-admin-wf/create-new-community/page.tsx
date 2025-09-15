"use client";

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Globe, Lock, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

const communityCategories = [
    "Internet", "Games", "Technology", "Movies", "Pop Culture",
    "Television", "Medicine", "Songs", "Sports", "Education",
    "Science", "Art", "Business", "Health", "Travel"
];

const admins = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com" },
];

export default function CreateNewCommunityPage() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        adminId: '',
        isPrivate: false
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Creating community:', formData);
        setIsLoading(false);

        // Reset form or redirect
        // router.push('/super-admin-wf/dashboard');
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <Link href="/super-admin-wf/dashboard">
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
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {communityCategories.map((category) => (
                                            <SelectItem key={category} value={category.toLowerCase()}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Select the primary topic or category for your community
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

                            {/* Select Admin */}
                            <div className="space-y-2">
                                <Label htmlFor="admin" className="text-sm font-medium">
                                    Select Admin *
                                </Label>
                                <Select value={formData.adminId} onValueChange={(value) => handleInputChange('adminId', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a community administrator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {admins.map((admin) => (
                                            <SelectItem key={admin.id} value={admin.id.toString()}>
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{admin.name}</span>
                                                    <span className="text-xs text-muted-foreground">({admin.email})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Select a user who will have administrative privileges for this community
                                </p>
                            </div>

                            {/* Privacy Settings */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Community Privacy</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${!formData.isPrivate
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                        onClick={() => handleInputChange('isPrivate', false)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <Globe className="h-5 w-5 mt-0.5 text-green-600" />
                                            <div>
                                                <h4 className="font-medium">Public Community</h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Anyone can discover and join this community
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.isPrivate
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                        onClick={() => handleInputChange('isPrivate', true)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <Lock className="h-5 w-5 mt-0.5 text-orange-600" />
                                            <div>
                                                <h4 className="font-medium">Private Community</h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Invitation only, members must be approved
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6 border-t">
                                <Link href="/super-admin-wf/dashboard">
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !formData.name || !formData.category || !formData.description || !formData.adminId}
                                    className="min-w-[140px]"
                                    style={{ backgroundColor: '#03A9F4' }}
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