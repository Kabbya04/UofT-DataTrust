'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, User, Shield, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  
  // Account Settings State
  const [accountData, setAccountData] = useState({
    firstName: 'Jhon',
    lastName: 'Doe',
    email: 'jhon@email.com',
    password: '••••••••'
  });

  // Content & Community Management State
  const [contentSettings, setContentSettings] = useState({
    approvalWorkflow: 'approval-required',
    contentFlagging: true,
    bulkContentActions: true,
    automatedModeration: false
  });

  const [communitySettings, setCommunitySettings] = useState({
    communityCreation: 'admins-only',
    communityGuidelines: true,
    userManagement: true,
    analyticsDashboard: true,
    auditLog: true
  });

  // User Management & Platform Settings State
  const [userPlatformSettings, setUserPlatformSettings] = useState({
    defaultUserPermissions: 'basic-access',
    reportGeneration: 'daily',
    dataRetention: '30-days',
    twoFactorAuth: 'admins-only',
    auditLogging: true,
    thirdPartyIntegrations: true
  });

  const handleSaveChanges = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Saving settings:', {
      account: accountData,
      content: contentSettings,
      community: communitySettings,
      userPlatform: userPlatformSettings
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/project-admin-wf/dashboard">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and administrative preferences.
            </p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account Settings</span>
            </TabsTrigger>
            
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Content & Community Management</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>User Management & Platform Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Profile Section */}
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-lg">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">Jhon Doe</h3>
                        <Badge variant="secondary">Project Admin</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Member since 11 January, 2025</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">FIRST NAME</Label>
                      <Input
                        id="firstName"
                        value={accountData.firstName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">LAST NAME</Label>
                      <Input
                        id="lastName"
                        value={accountData.lastName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">EMAIL</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">PASSWORD</Label>
                    <Input
                      id="password"
                      type="password"
                      value={accountData.password}
                      onChange={(e) => setAccountData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleSaveChanges} disabled={isLoading} className="w-auto">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content & Community Management Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Management Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Content Management</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Approval Workflow</Label>
                      <p className="text-sm text-muted-foreground">Configure post approval process</p>
                      <Select 
                        value={contentSettings.approvalWorkflow} 
                        onValueChange={(value) => setContentSettings(prev => ({ ...prev, approvalWorkflow: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approval-required">Approval required</SelectItem>
                          <SelectItem value="auto-approve">Auto approve</SelectItem>
                          <SelectItem value="community-vote">Community vote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Content Flagging</Label>
                        <p className="text-sm text-muted-foreground">Enable user content flagging system</p>
                      </div>
                      <Switch 
                        checked={contentSettings.contentFlagging}
                        onCheckedChange={(checked) => setContentSettings(prev => ({ ...prev, contentFlagging: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Bulk content actions</Label>
                        <p className="text-sm text-muted-foreground">Allow bulk actions on multiple content items</p>
                      </div>
                      <Switch 
                        checked={contentSettings.bulkContentActions}
                        onCheckedChange={(checked) => setContentSettings(prev => ({ ...prev, bulkContentActions: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Automated Moderation</Label>
                        <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
                      </div>
                      <Switch 
                        checked={contentSettings.automatedModeration}
                        onCheckedChange={(checked) => setContentSettings(prev => ({ ...prev, automatedModeration: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Management Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Community Management</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Community Creation</Label>
                      <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
                      <Select 
                        value={communitySettings.communityCreation} 
                        onValueChange={(value) => setCommunitySettings(prev => ({ ...prev, communityCreation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admins-only">Admins only</SelectItem>
                          <SelectItem value="all-users">All users</SelectItem>
                          <SelectItem value="verified-users">Verified users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Community Guidelines</Label>
                        <p className="text-sm text-muted-foreground">Enforce platform wide community guidelines</p>
                      </div>
                      <Switch 
                        checked={communitySettings.communityGuidelines}
                        onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, communityGuidelines: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>User Management</Label>
                        <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
                      </div>
                      <Switch 
                        checked={communitySettings.userManagement}
                        onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, userManagement: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Analytics Dashboard</Label>
                        <p className="text-sm text-muted-foreground">Enforce platform wide community guidelines</p>
                      </div>
                      <Switch 
                        checked={communitySettings.analyticsDashboard}
                        onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, analyticsDashboard: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Audit Log</Label>
                        <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
                      </div>
                      <Switch 
                        checked={communitySettings.auditLog}
                        onCheckedChange={(checked) => setCommunitySettings(prev => ({ ...prev, auditLog: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handleSaveChanges} disabled={isLoading} className="w-auto mt-4">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </TabsContent>

          {/* User Management & Platform Settings Tab */}
          <TabsContent value="platform">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Management Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">User Management</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Default User Permissions</Label>
                      <p className="text-sm text-muted-foreground">Configure post approval process</p>
                      <Select 
                        value={userPlatformSettings.defaultUserPermissions} 
                        onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, defaultUserPermissions: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic-access">Basic Access</SelectItem>
                          <SelectItem value="read-only">Read Only</SelectItem>
                          <SelectItem value="full-access">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Report Generation</Label>
                      <p className="text-sm text-muted-foreground">Configure post approval process</p>
                      <Select 
                        value={userPlatformSettings.reportGeneration} 
                        onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, reportGeneration: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Retention</Label>
                      <p className="text-sm text-muted-foreground">Configure post approval process</p>
                      <Select 
                        value={userPlatformSettings.dataRetention} 
                        onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, dataRetention: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30-days">30 Days</SelectItem>
                          <SelectItem value="90-days">90 Days</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Settings Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Two Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
                      <Select 
                        value={userPlatformSettings.twoFactorAuth} 
                        onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, twoFactorAuth: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admins-only">Admins only</SelectItem>
                          <SelectItem value="all-users">All users</SelectItem>
                          <SelectItem value="optional">Optional</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">Track all administrative actions</p>
                      </div>
                      <Switch 
                        checked={userPlatformSettings.auditLogging}
                        onCheckedChange={(checked) => setUserPlatformSettings(prev => ({ ...prev, auditLogging: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Third Party Integrations</Label>
                        <p className="text-sm text-muted-foreground">Allow third party service integrations</p>
                      </div>
                      <Switch 
                        checked={userPlatformSettings.thirdPartyIntegrations}
                        onCheckedChange={(checked) => setUserPlatformSettings(prev => ({ ...prev, thirdPartyIntegrations: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handleSaveChanges} disabled={isLoading} className="w-auto mt-8">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}