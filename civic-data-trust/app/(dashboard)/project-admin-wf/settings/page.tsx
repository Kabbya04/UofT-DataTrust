'use client';

import { useState, useEffect } from 'react';
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
import { useAuth } from "@/app/components/contexts/auth-context";

const TABS = [
  "Account Settings",
  "Content & Community Management", 
  "User Management & Platform Settings"
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
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

  // Initialize form data when user data loads
  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      setAccountData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }));
    }
  }, [user?.name]);

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
    <div className="w-full mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/project-admin-wf/dashboard">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and administrative preferences.</p>
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`text-lg font-medium pb-1 border-b-2 cursor-pointer transition-all ${
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

      <div className="bg-background rounded-lg border border-custom-border p-6">
        {/* Account Settings Tab */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <div className="ml-10 px-8">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt={user?.name || "Project Admin"} />
                  <AvatarFallback className="text-xl">
                    {getUserInitials(user?.name || "Project Admin")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">
                    {user?.name || "Project Admin"}
                    <span 
                      className="bg-civic-accent-green text-white px-2 py-0.5 rounded text-xs ml-2"
                      style={{ backgroundColor: "#43CD41" }}
                    >
                      Project Admin
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Unknown'}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-md mb-1">First Name:</label>
                    <input 
                      name="firstName"
                      className="w-full border border-custom-border rounded px-2 py-1" 
                      value={accountData.firstName}
                      onChange={(e) => setAccountData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder={user?.name?.split(' ')[0] || 'First Name'}
                    />
                  </div>
                  <div>
                    <label className="block text-md mb-1">Last Name:</label>
                    <input 
                      name="lastName"
                      className="w-full border border-custom-border rounded px-2 py-1" 
                      value={accountData.lastName}
                      onChange={(e) => setAccountData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder={user?.name?.split(' ').slice(1).join(' ') || 'Last Name'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-md mb-1">Email:</label>
                  <input 
                    className="w-full border border-custom-border rounded px-2 py-1 bg-muted" 
                    value={accountData.email} 
                    disabled 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-custom-border">
                  <h3 className="font-semibold">Change Password</h3>
                  <div>
                    <label className="block text-md mb-1">Current Password:</label>
                    <input 
                      type="password"
                      className="w-full border border-custom-border rounded px-2 py-1" 
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-md mb-1">New Password:</label>
                    <input 
                      type="password"
                      className="w-full border border-custom-border rounded px-2 py-1" 
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-md mb-1">Confirm New Password:</label>
                    <input 
                      type="password"
                      className="w-full border border-custom-border rounded px-2 py-1" 
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <Button 
                variant="default"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                style={{ backgroundColor: "#2196F3" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Content & Community Management Tab */}
        {activeTab === 1 && (
          <div className="grid grid-cols-2 gap-6">
            {/* Content Management Settings */}
            <div className="border border-custom-border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Content Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-md">Content Approval Workflow</span>
                  </div>
                  <Select value={contentSettings.approvalWorkflow} onValueChange={(value) => setContentSettings(prev => ({ ...prev, approvalWorkflow: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approval-required">Approval Required</SelectItem>
                      <SelectItem value="auto-publish">Auto Publish</SelectItem>
                      <SelectItem value="community-moderated">Community Moderated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Content Flagging</span>
                  <ToggleSwitch 
                    checked={contentSettings.contentFlagging} 
                    onChange={(value) => setContentSettings(prev => ({ ...prev, contentFlagging: value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Bulk Content Actions</span>
                  <ToggleSwitch 
                    checked={contentSettings.bulkContentActions} 
                    onChange={(value) => setContentSettings(prev => ({ ...prev, bulkContentActions: value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Automated Moderation</span>
                  <ToggleSwitch 
                    checked={contentSettings.automatedModeration} 
                    onChange={(value) => setContentSettings(prev => ({ ...prev, automatedModeration: value }))}
                  />
                </div>
              </div>
            </div>

            {/* Community Management Settings */}
            <div className="border border-custom-border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Community Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-md">Community Creation</span>
                  </div>
                  <Select value={communitySettings.communityCreation} onValueChange={(value) => setCommunitySettings(prev => ({ ...prev, communityCreation: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admins-only">Admins Only</SelectItem>
                      <SelectItem value="members-allowed">Members Allowed</SelectItem>
                      <SelectItem value="open-to-all">Open to All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Community Guidelines</span>
                  <ToggleSwitch 
                    checked={communitySettings.communityGuidelines} 
                    onChange={(value) => setCommunitySettings(prev => ({ ...prev, communityGuidelines: value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">User Management</span>
                  <ToggleSwitch 
                    checked={communitySettings.userManagement} 
                    onChange={(value) => setCommunitySettings(prev => ({ ...prev, userManagement: value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Analytics Dashboard</span>
                  <ToggleSwitch 
                    checked={communitySettings.analyticsDashboard} 
                    onChange={(value) => setCommunitySettings(prev => ({ ...prev, analyticsDashboard: value }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Audit Log</span>
                  <ToggleSwitch 
                    checked={communitySettings.auditLog} 
                    onChange={(value) => setCommunitySettings(prev => ({ ...prev, auditLog: value }))}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 mt-6">
              <Button 
                variant="default"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                style={{ backgroundColor: "#2196F3" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* User Management & Platform Settings Tab */}
        {activeTab === 2 && (
          <div className="grid grid-cols-2 gap-6">
            {/* User Management Settings */}
            <div className="border border-custom-border rounded-lg p-4">
              <h2 className="font-semibold mb-4">User Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-md">Default User Permissions</span>
                  </div>
                  <Select value={userPlatformSettings.defaultUserPermissions} onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, defaultUserPermissions: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic-access">Basic Access</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Two-Factor Authentication</span>
                  <Select value={userPlatformSettings.twoFactorAuth} onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, twoFactorAuth: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="admins-only">Admins Only</SelectItem>
                      <SelectItem value="required">Required for All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Audit Logging</span>
                  <ToggleSwitch 
                    checked={userPlatformSettings.auditLogging} 
                    onChange={(value) => setUserPlatformSettings(prev => ({ ...prev, auditLogging: value }))}
                  />
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="border border-custom-border rounded-lg p-4">
              <h2 className="font-semibold mb-4">Platform Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-md">Report Generation</span>
                  </div>
                  <Select value={userPlatformSettings.reportGeneration} onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, reportGeneration: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-md">Data Retention</span>
                  </div>
                  <Select value={userPlatformSettings.dataRetention} onValueChange={(value) => setUserPlatformSettings(prev => ({ ...prev, dataRetention: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-days">7 Days</SelectItem>
                      <SelectItem value="30-days">30 Days</SelectItem>
                      <SelectItem value="90-days">90 Days</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-md">Third-Party Integrations</span>
                  <ToggleSwitch 
                    checked={userPlatformSettings.thirdPartyIntegrations} 
                    onChange={(value) => setUserPlatformSettings(prev => ({ ...prev, thirdPartyIntegrations: value }))}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 mt-6">
              <Button 
                variant="default"
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                style={{ backgroundColor: "#2196F3" }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200 ${
      checked ? "bg-brand-blue hover:bg-brand-blue/90" : "bg-gray-400"
    }`}
    style={{ 
      backgroundColor: checked ? '#2196F3' : undefined,
      boxShadow: checked ? "0 1px 4px rgba(0,0,0,0.08)" : undefined 
    }}
  >
    <span
      className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? "translate-x-1" : ""
      }`}
      style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
    />
  </button>
);