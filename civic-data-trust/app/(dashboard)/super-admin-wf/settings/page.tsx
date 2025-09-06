"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { User, Shield, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account");
    
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

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Account Settings
                    </TabsTrigger>
                    <TabsTrigger value="platform" className="flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" />
                        Platform & System Management
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Advanced Settings
                    </TabsTrigger>
                </TabsList>

                {/* Account Settings Tab */}
                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {/* Profile Section */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="bg-muted text-lg">
                                            {firstName[0]}{lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-semibold">{firstName} {lastName}</h3>
                                        <p className="text-sm text-muted-foreground">Member since 11 January, 2025</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm font-medium">
                                            FIRST NAME
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm font-medium">
                                            LAST NAME
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        EMAIL
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        PASSWORD
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <Button onClick={handleSaveChanges} className="bg-black hover:bg-black/90 text-white">
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Platform & System Management Tab */}
                <TabsContent value="platform" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Platform Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Platform Wide Settings</Label>
                                    <p className="text-xs text-muted-foreground">Configure settings across all platforms</p>
                                    <Select value={platformSettings} onValueChange={setPlatformSettings}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
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
                                    <Switch 
                                        checked={crossPlatformFeatures} 
                                        onCheckedChange={setCrossPlatformFeatures}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Role Management</Label>
                                        <p className="text-xs text-muted-foreground">Enable advanced role management</p>
                                    </div>
                                    <Switch 
                                        checked={roleManagement} 
                                        onCheckedChange={setRoleManagement}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Management</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Server Configuration</Label>
                                    <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                                    <Select value={serverConfig} onValueChange={setServerConfig}>
                                        <SelectTrigger>
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
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Database Management</Label>
                                        <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                                    </div>
                                    <Switch 
                                        checked={databaseManagement} 
                                        onCheckedChange={setDatabaseManagement}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">API Management</Label>
                                        <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                                    </div>
                                    <Switch 
                                        checked={apiManagement} 
                                        onCheckedChange={setApiManagement}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">System Maintenance</Label>
                                    <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                                    <Select value={systemMaintenance} onValueChange={setSystemMaintenance}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
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
                            </CardContent>
                        </Card>
                    </div>

                    <Button onClick={handleSaveChanges} className="bg-black hover:bg-black/90 text-white">
                        Save Changes
                    </Button>
                </TabsContent>

                {/* Advanced Settings Tab */}
                <TabsContent value="advanced" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Security Controls */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Authorization Framework</Label>
                                    <p className="text-xs text-muted-foreground">Configure authorization levels</p>
                                    <Select value={authFramework} onValueChange={setAuthFramework}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
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
                                    <Switch 
                                        checked={encryptionEnabled} 
                                        onCheckedChange={setEncryptionEnabled}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Audit Trail</Label>
                                        <p className="text-xs text-muted-foreground">Log all system activities</p>
                                    </div>
                                    <Switch 
                                        checked={auditTrailEnabled} 
                                        onCheckedChange={setAuditTrailEnabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Analytics & System Maintenance */}
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
                                    <Switch 
                                        checked={systemAnalytics} 
                                        onCheckedChange={setSystemAnalytics}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Data Export Controls</Label>
                                    <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                                    <Select value={dataExportControl} onValueChange={setDataExportControl}>
                                        <SelectTrigger>
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
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Privacy Compliance</Label>
                                        <p className="text-xs text-muted-foreground">Ensure compliance with privacy regulations</p>
                                    </div>
                                    <Switch 
                                        checked={privacyCompliance} 
                                        onCheckedChange={setPrivacyCompliance}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Update Management</Label>
                                        <p className="text-xs text-muted-foreground">Enable automatic system updates</p>
                                    </div>
                                    <Switch 
                                        checked={updateManagement} 
                                        onCheckedChange={setUpdateManagement}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium">Critical Alerts</Label>
                                        <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit amet</p>
                                    </div>
                                    <Switch 
                                        checked={criticalAlerts} 
                                        onCheckedChange={setCriticalAlerts}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Button onClick={handleSaveChanges} className="bg-black hover:bg-black/90 text-white">
                        Save Changes
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}