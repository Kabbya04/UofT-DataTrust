'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Label } from '@/app/components/ui/label';

const TABS = [
  "Account Settings",
  "Platform & System Management", 
  "Advanced Settings"
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full mx-auto">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your settings and preferences.</p>
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
        {activeTab === 0 && <AccountSettings />}
        {activeTab === 1 && <PlatformSystemManagement />}
        {activeTab === 2 && <AdvancedSettings />}
        <div className="col-span-2 mt-6">
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90 text-white"
            style={{ backgroundColor: "#2196F3" }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper components
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
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

function AccountSettings() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@email.com',
    password: '********'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Super Admin" />
          <AvatarFallback className="text-xl">SA</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-lg">
            Super Admin
            <span 
              className="bg-civic-accent-green text-white px-2 py-0.5 rounded text-xs ml-2"
              style={{ backgroundColor: "#2196F3" }}
            >
              Super Admin
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Manage your profile information and security settings.</p>
        </div>
      </div>

      <Card className="border border-custom-border">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="border-custom-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="border-custom-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-custom-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="border-custom-border"
            />
          </div>

          <Button variant="link" className="p-0 h-auto text-sm text-brand-blue hover:text-brand-blue/90">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlatformSystemManagement() {
  const [settings, setSettings] = useState({
    platformSettings: "unified",
    crossPlatformFeatures: true,
    roleManagement: true,
    serverConfig: "auto-scaling",
    databaseManagement: true,
    apiManagement: true,
    systemMaintenance: "automatic",
    backupConfig: "daily"
  });

  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Platform & System Management</h2>
        <p className="text-sm text-muted-foreground">
          Configure platform-wide settings and system management preferences.
        </p>
      </div>

      <div className="border border-custom-border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Platform Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-md">Platform Settings</span>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Select value={settings.platformSettings} onValueChange={(value) => handleSelectChange("platformSettings", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unified">Unified</SelectItem>
                <SelectItem value="segmented">Segmented</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Cross-Platform Features</span>
            <ToggleSwitch 
              checked={settings.crossPlatformFeatures} 
              onChange={(value) => handleToggleChange("crossPlatformFeatures", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Role Management</span>
            <ToggleSwitch 
              checked={settings.roleManagement} 
              onChange={(value) => handleToggleChange("roleManagement", value)}
            />
          </div>
        </div>
      </div>

      <div className="border border-custom-border rounded-lg p-4">
        <h3 className="font-semibold mb-4">System Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-md">Server Configuration</span>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Select value={settings.serverConfig} onValueChange={(value) => handleSelectChange("serverConfig", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto-scaling">Auto Scaling</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Database Management</span>
            <ToggleSwitch 
              checked={settings.databaseManagement} 
              onChange={(value) => handleToggleChange("databaseManagement", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">API Management</span>
            <ToggleSwitch 
              checked={settings.apiManagement} 
              onChange={(value) => handleToggleChange("apiManagement", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-md">System Maintenance</span>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Select value={settings.systemMaintenance} onValueChange={(value) => handleSelectChange("systemMaintenance", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-md">Backup Configuration</span>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Select value={settings.backupConfig} onValueChange={(value) => handleSelectChange("backupConfig", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvancedSettings() {
  const [settings, setSettings] = useState({
    authFramework: "role-based",
    encryptionEnabled: true,
    auditTrailEnabled: true,
    systemAnalytics: true,
    dataExportControl: "admin-only",
    privacyCompliance: true,
    updateManagement: true,
    criticalAlerts: true
  });

  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Advanced Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure advanced security and system preferences.
        </p>
      </div>

      <div className="border border-custom-border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-md">Authentication Framework</span>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Select value={settings.authFramework} onValueChange={(value) => handleSelectChange("authFramework", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role-based">Role Based</SelectItem>
                <SelectItem value="attribute-based">Attribute Based</SelectItem>
                <SelectItem value="claim-based">Claim Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Encryption</span>
            <ToggleSwitch 
              checked={settings.encryptionEnabled} 
              onChange={(value) => handleToggleChange("encryptionEnabled", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Audit Trail</span>
            <ToggleSwitch 
              checked={settings.auditTrailEnabled} 
              onChange={(value) => handleToggleChange("auditTrailEnabled", value)}
            />
          </div>
        </div>
      </div>

      <div className="border border-custom-border rounded-lg p-4">
        <h3 className="font-semibold mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-md">System Analytics</span>
            <ToggleSwitch 
              checked={settings.systemAnalytics} 
              onChange={(value) => handleToggleChange("systemAnalytics", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-md">Data Export Control</span>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Select value={settings.dataExportControl} onValueChange={(value) => handleSelectChange("dataExportControl", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin-only">Admin Only</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="open">Open</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Privacy Compliance</span>
            <ToggleSwitch 
              checked={settings.privacyCompliance} 
              onChange={(value) => handleToggleChange("privacyCompliance", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Update Management</span>
            <ToggleSwitch 
              checked={settings.updateManagement} 
              onChange={(value) => handleToggleChange("updateManagement", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-md">Critical Alerts</span>
            <ToggleSwitch 
              checked={settings.criticalAlerts} 
              onChange={(value) => handleToggleChange("criticalAlerts", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}