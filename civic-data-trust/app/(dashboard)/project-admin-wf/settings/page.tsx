'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useAuth } from '@/app/components/contexts/auth-context';

// Custom Toggle component to match community member dashboard
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200
        ${checked ? "" : "bg-gray-400"}`}
      style={{ 
        backgroundColor: checked ? '#2196F3' : undefined,
        boxShadow: checked ? "0 1px 4px rgba(0,0,0,0.08)" : undefined 
      }}
    >
      <span
        className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
          ${checked ? "translate-x-1" : ""}`}
        style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

const TABS = [
  "Account Settings",
  "Content & Community Management",
  "User Management & Platform Settings"
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveChanges = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="w-full  ">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your settings and preferences.</p>
      <div className="flex gap-6 mb-6">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`text-lg font-medium pb-1 border-b-2  cursor-pointer transition-all ${
              activeTab === idx
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
            style={{ minWidth: 180 }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-background rounded-lg border border-primary p-6">
        {activeTab === 0 && <AccountSettings handleSaveChanges={handleSaveChanges} isLoading={isLoading} />}
        {activeTab === 1 && <ContentCommunityManagement handleSaveChanges={handleSaveChanges} isLoading={isLoading} />}
        {activeTab === 2 && <UserManagementPlatform handleSaveChanges={handleSaveChanges} isLoading={isLoading} />}
      </div>
    </div>
  );
}

function AccountSettings({ handleSaveChanges, isLoading }: { handleSaveChanges: () => void; isLoading: boolean }) {
  const { user } = useAuth();
  const [accountData, setAccountData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    password: '••••••••'
  });

  const getUserInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      '7d1222ee-a32b-4981-8b31-89ac68b640fb': 'Researcher',
      '38252b5f-55ff-4cae-aad1-f442971e2e16': 'Community Member',
      '445acacc-aa8c-4902-892d-13e8afc8be3f': 'Project Admin',
      '093e572a-3226-4786-a16b-8020e2cf5bfd': 'Super Admin',
    };
    return roleNames[role] || role;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-8">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/profile.jpg" alt={user.name} />
          <AvatarFallback className="text-xl">{getUserInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-lg">
            {user.name}
            <span 
              className="text-white text-xs ml-2 inline-flex items-center justify-center"
              style={{
                width: '149px',
                height: '24px',
                backgroundColor: '#43CD41',
                borderRadius: '32px',
                paddingTop: '7px',
                paddingRight: '14px',
                paddingBottom: '9px',
                paddingLeft: '14px',
                gap: '4px'
              }}
            >
              {getRoleName(user.role)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
      
      <form className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-md mb-1">First Name:</label>
            <input 
              className="w-full border rounded px-2 py-1" 
              value={accountData.firstName}
              onChange={(e) => setAccountData({...accountData, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-md mb-1">Last Name:</label>
            <input 
              className="w-full border rounded px-2 py-1" 
              value={accountData.lastName}
              onChange={(e) => setAccountData({...accountData, lastName: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-md mb-1">Email:</label>
          <input 
            className="w-full border rounded px-2 py-1 bg-muted" 
            value={accountData.email}
            onChange={(e) => setAccountData({...accountData, email: e.target.value})}
            disabled 
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
        </div>
        
        <div>
          <label className="block text-md mb-1">Password:</label>
          <input 
            type="password"
            className="w-full border rounded px-2 py-1" 
            value={accountData.password}
            onChange={(e) => setAccountData({...accountData, password: e.target.value})}
          />
        </div>
        
        <Button 
          onClick={handleSaveChanges} 
          variant="default"
          style={{ backgroundColor: '#03A9F4', color: 'white' }}
          className="hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}

function ContentCommunityManagement({ handleSaveChanges, isLoading }: { handleSaveChanges: () => void; isLoading: boolean }) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Content Management</h3>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Content Approval Workflow</Label>
            <p className="text-xs text-muted-foreground">Set content approval requirements</p>
            <Select value={contentSettings.approvalWorkflow} onValueChange={(value) => setContentSettings({...contentSettings, approvalWorkflow: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="approval-required">Approval Required</SelectItem>
                <SelectItem value="auto-approve">Auto Approve</SelectItem>
                <SelectItem value="review-after">Review After Publishing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Content Flagging System</Label>
              <p className="text-xs text-muted-foreground">Enable automated content flagging</p>
            </div>
            <Toggle 
              checked={contentSettings.contentFlagging} 
              onChange={(checked) => setContentSettings({...contentSettings, contentFlagging: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Bulk Content Actions</Label>
              <p className="text-xs text-muted-foreground">Allow bulk content operations</p>
            </div>
            <Toggle 
              checked={contentSettings.bulkContentActions} 
              onChange={(checked) => setContentSettings({...contentSettings, bulkContentActions: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Automated Moderation</Label>
              <p className="text-xs text-muted-foreground">Enable AI-powered content moderation</p>
            </div>
            <Toggle 
              checked={contentSettings.automatedModeration} 
              onChange={(checked) => setContentSettings({...contentSettings, automatedModeration: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Community Management</h3>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Community Creation</Label>
            <p className="text-xs text-muted-foreground">Who can create new communities</p>
            <Select value={communitySettings.communityCreation} onValueChange={(value) => setCommunitySettings({...communitySettings, communityCreation: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admins-only">Admins Only</SelectItem>
                <SelectItem value="verified-users">Verified Users</SelectItem>
                <SelectItem value="all-users">All Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Community Guidelines</Label>
              <p className="text-xs text-muted-foreground">Enforce community guidelines</p>
            </div>
            <Toggle 
              checked={communitySettings.communityGuidelines} 
              onChange={(checked) => setCommunitySettings({...communitySettings, communityGuidelines: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">User Management Tools</Label>
              <p className="text-xs text-muted-foreground">Enable advanced user management</p>
            </div>
            <Toggle 
              checked={communitySettings.userManagement} 
              onChange={(checked) => setCommunitySettings({...communitySettings, userManagement: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Analytics Dashboard</Label>
              <p className="text-xs text-muted-foreground">Show community analytics</p>
            </div>
            <Toggle 
              checked={communitySettings.analyticsDashboard} 
              onChange={(checked) => setCommunitySettings({...communitySettings, analyticsDashboard: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Audit Log</Label>
              <p className="text-xs text-muted-foreground">Track community actions</p>
            </div>
            <Toggle 
              checked={communitySettings.auditLog} 
              onChange={(checked) => setCommunitySettings({...communitySettings, auditLog: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button 
          onClick={handleSaveChanges} 
          className="text-white"
          style={{ backgroundColor: '#03A9F4' }}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

function UserManagementPlatform({ handleSaveChanges, isLoading }: { handleSaveChanges: () => void; isLoading: boolean }) {
  const [userPlatformSettings, setUserPlatformSettings] = useState({
    defaultUserPermissions: 'basic-access',
    reportGeneration: 'daily',
    dataRetention: '30-days',
    twoFactorAuth: 'admins-only',
    auditLogging: true,
    thirdPartyIntegrations: true
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">User Management & Platform Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Default User Permissions</Label>
                <p className="text-xs text-muted-foreground">Set default permissions for new users</p>
                <Select value={userPlatformSettings.defaultUserPermissions} onValueChange={(value) => setUserPlatformSettings({...userPlatformSettings, defaultUserPermissions: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic-access">Basic Access</SelectItem>
                    <SelectItem value="enhanced-access">Enhanced Access</SelectItem>
                    <SelectItem value="full-access">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Report Generation</Label>
                <p className="text-xs text-muted-foreground">Automated report frequency</p>
                <Select value={userPlatformSettings.reportGeneration} onValueChange={(value) => setUserPlatformSettings({...userPlatformSettings, reportGeneration: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Data Retention</Label>
                <p className="text-xs text-muted-foreground">How long to keep user data</p>
                <Select value={userPlatformSettings.dataRetention} onValueChange={(value) => setUserPlatformSettings({...userPlatformSettings, dataRetention: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="90-days">90 Days</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="indefinite">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Require 2FA for specific roles</p>
                <Select value={userPlatformSettings.twoFactorAuth} onValueChange={(value) => setUserPlatformSettings({...userPlatformSettings, twoFactorAuth: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admins-only">Admins Only</SelectItem>
                    <SelectItem value="all-users">All Users</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Audit Logging</Label>
                  <p className="text-xs text-muted-foreground">Log all platform activities</p>
                </div>
                <Toggle 
                  checked={userPlatformSettings.auditLogging} 
                  onChange={(checked) => setUserPlatformSettings({...userPlatformSettings, auditLogging: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Third-Party Integrations</Label>
                  <p className="text-xs text-muted-foreground">Allow external service integrations</p>
                </div>
                <Toggle 
                  checked={userPlatformSettings.thirdPartyIntegrations} 
                  onChange={(checked) => setUserPlatformSettings({...userPlatformSettings, thirdPartyIntegrations: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSaveChanges} 
        className="text-white"
        style={{ backgroundColor: '#03A9F4' }}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}