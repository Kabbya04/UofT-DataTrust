"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { useAuth } from "@/app/components/contexts/auth-context";

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

const TABS = ["Account Settings", "Platform & System Management", "Advanced Settings"];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    
    // Account Settings State
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");
    const [email, setEmail] = useState("john@email.com");
    const [password, setPassword] = useState("********");

    // Advanced Settings State
    const [authFramework, setAuthFramework] = useState("role-based");
    const [encryptionEnabled, setEncryptionEnabled] = useState(true);
    const [auditTrailEnabled, setAuditTrailEnabled] = useState(true);
    const [systemAnalytics, setSystemAnalytics] = useState(true);
    const [dataExportControl, setDataExportControl] = useState("admin-only");
    const [privacyCompliance, setPrivacyCompliance] = useState(true);
    const [updateManagement, setUpdateManagement] = useState(true);
    const [criticalAlerts, setCriticalAlerts] = useState(true);

    // Platform & System Management State
    const [platformSettings, setPlatformSettings] = useState("unified");
    const [crossPlatformFeatures, setCrossPlatformFeatures] = useState(true);
    const [roleManagement, setRoleManagement] = useState(true);
    const [serverConfig, setServerConfig] = useState("auto-scaling");
    const [databaseManagement, setDatabaseManagement] = useState(true);
    const [apiManagement, setApiManagement] = useState(true);
    const [systemMaintenance, setSystemMaintenance] = useState("automatic");
    const [backupConfig, setBackupConfig] = useState("daily");

    const handleSaveChanges = () => {
        console.log("Saving changes...");
        alert("Settings saved successfully!");
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your settings and preferences.
                </p>
            </div>

            <div className="flex gap-4 mb-6 border-b">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-lg font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div>
              {activeTab === "Account Settings" && <AccountSettings firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleSaveChanges={handleSaveChanges} />}
              {activeTab === "Platform & System Management" && <PlatformManagement platformSettings={platformSettings} setPlatformSettings={setPlatformSettings} crossPlatformFeatures={crossPlatformFeatures} setCrossPlatformFeatures={setCrossPlatformFeatures} roleManagement={roleManagement} setRoleManagement={setRoleManagement} serverConfig={serverConfig} setServerConfig={setServerConfig} databaseManagement={databaseManagement} setDatabaseManagement={setDatabaseManagement} apiManagement={apiManagement} setApiManagement={setApiManagement} systemMaintenance={systemMaintenance} setSystemMaintenance={setSystemMaintenance} backupConfig={backupConfig} setBackupConfig={setBackupConfig} handleSaveChanges={handleSaveChanges} />}
              {activeTab === "Advanced Settings" && <AdvancedSettings authFramework={authFramework} setAuthFramework={setAuthFramework} encryptionEnabled={encryptionEnabled} setEncryptionEnabled={setEncryptionEnabled} auditTrailEnabled={auditTrailEnabled} setAuditTrailEnabled={setAuditTrailEnabled} systemAnalytics={systemAnalytics} setSystemAnalytics={setSystemAnalytics} dataExportControl={dataExportControl} setDataExportControl={setDataExportControl} privacyCompliance={privacyCompliance} setPrivacyCompliance={setPrivacyCompliance} updateManagement={updateManagement} setUpdateManagement={setUpdateManagement} criticalAlerts={criticalAlerts} setCriticalAlerts={setCriticalAlerts} handleSaveChanges={handleSaveChanges} />}
            </div>
        </div>
    );
}

// Account Settings Component
function AccountSettings({ firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, handleSaveChanges }: any) {
  const { user } = useAuth();

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
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/profile.jpg" alt={user.name} />
              <AvatarFallback className="text-lg">{getUserInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">
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
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">FIRST NAME</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">LAST NAME</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">EMAIL</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">PASSWORD</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button onClick={handleSaveChanges} className="text-white" style={{ backgroundColor: '#03A9F4' }}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Advanced Settings Component
function AdvancedSettings({ authFramework, setAuthFramework, encryptionEnabled, setEncryptionEnabled, auditTrailEnabled, setAuditTrailEnabled, systemAnalytics, setSystemAnalytics, dataExportControl, setDataExportControl, privacyCompliance, setPrivacyCompliance, updateManagement, setUpdateManagement, criticalAlerts, setCriticalAlerts, handleSaveChanges }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Authorization Framework</Label>
            <p className="text-xs text-muted-foreground">Configure authorization levels</p>
            <Select value={authFramework} onValueChange={setAuthFramework}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="role-based">Role Based</SelectItem>
                <SelectItem value="attribute-based">Attribute Based</SelectItem>
                <SelectItem value="policy-based">Policy Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Encryption Settings</Label>
              <p className="text-xs text-muted-foreground">Enable end-to-end encryption</p>
            </div>
            <Toggle checked={encryptionEnabled} onChange={setEncryptionEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Audit Trail</Label>
              <p className="text-xs text-muted-foreground">Log all system activities</p>
            </div>
            <Toggle checked={auditTrailEnabled} onChange={setAuditTrailEnabled} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics & System Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">System Wide Analytics</Label>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Toggle checked={systemAnalytics} onChange={setSystemAnalytics} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Data Export Controls</Label>
            <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            <Select value={dataExportControl} onValueChange={setDataExportControl}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin-only">Admin Only</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="open">Open</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Privacy Compliance</Label>
              <p className="text-xs text-muted-foreground">Ensure compliance with privacy regulations</p>
            </div>
            <Toggle checked={privacyCompliance} onChange={setPrivacyCompliance} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Update Management</Label>
              <p className="text-xs text-muted-foreground">Enable automatic system updates</p>
            </div>
            <Toggle checked={updateManagement} onChange={setUpdateManagement} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Critical Alerts</Label>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Toggle checked={criticalAlerts} onChange={setCriticalAlerts} />
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button onClick={handleSaveChanges} className="text-white" style={{ backgroundColor: '#03A9F4' }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// Platform Management Component
function PlatformManagement({ platformSettings, setPlatformSettings, crossPlatformFeatures, setCrossPlatformFeatures, roleManagement, setRoleManagement, serverConfig, setServerConfig, databaseManagement, setDatabaseManagement, apiManagement, setApiManagement, systemMaintenance, setSystemMaintenance, backupConfig, setBackupConfig, handleSaveChanges }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Platform Wide Settings</Label>
            <p className="text-xs text-muted-foreground">Configure settings across all platforms</p>
            <Select value={platformSettings} onValueChange={setPlatformSettings}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unified">Unified</SelectItem>
                <SelectItem value="distributed">Distributed</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Cross Platform Features</Label>
              <p className="text-xs text-muted-foreground">Enable features that work across platforms</p>
            </div>
            <Toggle checked={crossPlatformFeatures} onChange={setCrossPlatformFeatures} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Role Management</Label>
              <p className="text-xs text-muted-foreground">Enable advanced role management</p>
            </div>
            <Toggle checked={roleManagement} onChange={setRoleManagement} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Server Configuration</Label>
            <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            <Select value={serverConfig} onValueChange={setServerConfig}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto-scaling">Auto Scaling</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Database Management</Label>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Toggle checked={databaseManagement} onChange={setDatabaseManagement} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">API Management</Label>
              <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <Toggle checked={apiManagement} onChange={setApiManagement} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">System Maintenance</Label>
            <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            <Select value={systemMaintenance} onValueChange={setSystemMaintenance}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Backup Configuration</Label>
            <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
            <Select value={backupConfig} onValueChange={setBackupConfig}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button onClick={handleSaveChanges} className="text-white" style={{ backgroundColor: '#03A9F4' }}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}