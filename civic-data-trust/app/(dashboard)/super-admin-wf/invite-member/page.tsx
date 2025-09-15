'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { ArrowLeft, Mail, UserPlus, Users, Search, Shield, Plus, X, Crown } from 'lucide-react';
import Link from 'next/link';

type InviteRole = 'community-member' | 'researcher' | 'project-admin' | 'super-admin';

export default function InviteMemberPage() {
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<InviteRole>('community-member');
    const [invitedEmails, setInvitedEmails] = useState<Array<{ email: string, role: InviteRole }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddEmail = () => {
        if (email && email.includes('@') && !invitedEmails.find(item => item.email === email)) {
            setInvitedEmails(prev => [...prev, { email, role: selectedRole }]);
            setEmail('');
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setInvitedEmails(prev => prev.filter(item => item.email !== emailToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail();
        }
    };

    const handleSendInvites = async () => {
        if (invitedEmails.length === 0) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Sending invites:', invitedEmails);
        setIsLoading(false);

        // Reset or redirect
        setInvitedEmails([]);
    };

    const getRoleInfo = (role: InviteRole) => {
        switch (role) {
            case 'community-member':
                return {
                    name: 'Community Member',
                    description: 'Can participate in discussions, view public content, and engage with the community',
                    icon: Users,
                    color: 'bg-blue-100 text-blue-800 border-blue-200'
                };
            case 'researcher':
                return {
                    name: 'Researcher',
                    description: 'Can access research data, conduct studies, and collaborate on research projects',
                    icon: Search,
                    color: 'bg-green-100 text-green-800 border-green-200'
                };
            case 'project-admin':
                return {
                    name: 'Project Admin',
                    description: 'Can manage users, moderate content, and configure project settings',
                    icon: Shield,
                    color: 'bg-purple-100 text-purple-800 border-purple-200'
                };
            case 'super-admin':
                return {
                    name: 'Super Admin',
                    description: 'Has full administrative privileges across all communities and projects',
                    icon: Crown,
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
                };
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <Link href="/super-admin-wf/dashboard">
                <ArrowLeft className="h-6 w-6 mb-8" />
            </Link>
            <div className="w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invite Members</h1>
                        <p className="text-muted-foreground">
                            Add new members to your community with specific roles and permissions
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Invite Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <UserPlus className="h-5 w-5" />
                                    <span>Send Invitations</span>
                                </CardTitle>
                                <CardDescription>
                                    Enter email addresses and select roles for new members
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address *
                                    </Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleAddEmail}
                                            disabled={!email || !email.includes('@')}
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Invite As *</Label>
                                    <RadioGroup value={selectedRole} onValueChange={(value: InviteRole) => setSelectedRole(value)}>
                                        <div className="space-y-3">
                                            {(['community-member', 'researcher', 'project-admin', 'super-admin'] as InviteRole[]).map((role) => {
                                                const roleInfo = getRoleInfo(role);
                                                const Icon = roleInfo.icon;

                                                return (
                                                    <div key={role} className="flex items-start space-x-3">
                                                        <RadioGroupItem value={role} id={role} className="mt-1" style={{ borderColor: '#03A9F4' }} />
                                                        <div className="flex-1 space-y-1">
                                                            <Label htmlFor={role} className="flex items-center space-x-2 cursor-pointer">
                                                                <Icon className="h-4 w-4" />
                                                                <span className="font-medium">{roleInfo.name}</span>
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                                {roleInfo.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Invited Emails List */}
                                {invitedEmails.length > 0 && (
                                    <div className="space-y-3">
                                        <Separator />
                                        <div>
                                            <Label className="text-sm font-medium">
                                                Pending Invitations ({invitedEmails.length})
                                            </Label>
                                            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                                {invitedEmails.map((item, index) => {
                                                    const roleInfo = getRoleInfo(item.role);
                                                    return (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                            <div className="flex items-center space-x-3">
                                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm font-medium">{item.email}</span>
                                                                <Badge variant="secondary" className={roleInfo.color}>
                                                                    {roleInfo.name}
                                                                </Badge>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveEmail(item.email)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Link href="/super-admin-wf/dashboard">
                                        <Button variant="outline">Cancel</Button>
                                    </Link>
                                    <Button
                                        onClick={handleSendInvites}
                                        disabled={isLoading || invitedEmails.length === 0}
                                        className="min-w-[120px]"
                                        style={{ backgroundColor: '#03A9F4' }}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Sending...</span>
                                            </div>
                                        ) : (
                                            `Send ${invitedEmails.length > 0 ? invitedEmails.length : ''} Invite${invitedEmails.length !== 1 ? 's' : ''}`
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Role Information Sidebar */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Role Permissions</CardTitle>
                                <CardDescription>
                                    Understanding different access levels
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(['community-member', 'researcher', 'project-admin', 'super-admin'] as InviteRole[]).map((role) => {
                                    const roleInfo = getRoleInfo(role);
                                    const Icon = roleInfo.icon;

                                    return (
                                        <div key={role} className="p-3 border rounded-lg">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Icon className="h-4 w-4" />
                                                <h4 className="font-medium text-sm">{roleInfo.name}</h4>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {roleInfo.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>


                    </div>
                </div>
                <Card className="bg-muted/30 w-full">
                    <CardHeader>
                        <CardTitle className="text-sm">💡 Invitation Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                        <p>• Invitees will receive an email with setup instructions</p>
                        <p>• You can change member roles later in settings</p>
                        <p>• Invitations expire after 7 days</p>
                        <p>• Members can decline invitations</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}