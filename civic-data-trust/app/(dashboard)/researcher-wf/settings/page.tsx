'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from 'lucide-react';

const TABS = ["Account Settings", "Privacy & Notifications", "Display & Preferences"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your settings and preferences.</p>
      
      <div className="flex gap-4 mb-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-medium transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div>
        {activeTab === "Account Settings" && <AccountSettings />}
        {activeTab === "Privacy & Notifications" && <PrivacyNotifications />}
        {activeTab === "Display & Preferences" && <DisplayPreferences />}
      </div>
    </div>
  );
}

// Helper components
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const ToggleRow = ({ label }: { label: string }) => {
    const [on, setOn] = useState(false);
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p>
            </div>
            <ToggleSwitch checked={on} onChange={setOn} />
        </div>
    );
};

// Tab Content Components
function AccountSettings() {
  return (
    <Card>
      <CardContent className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-muted" />
            <div>
                <div className="font-semibold text-xl flex items-center">Jhon Doe <Badge className="ml-2">Researcher</Badge></div>
                <div className="text-sm text-muted-foreground">Member since 17 January, 2025</div>
            </div>
        </div>
        <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">First Name</label><Input defaultValue="Jhon" /></div>
                <div><label className="block text-sm font-medium mb-1">Last Name</label><Input defaultValue="Doe" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Email</label><Input type="email" defaultValue="jhon@email.com" /></div>
            <div><label className="block text-sm font-medium mb-1">Password</label><Input type="password" defaultValue="********" /></div>
            <Button>Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PrivacyNotifications() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Privacy Settings</CardTitle></CardHeader>
                <CardContent className="divide-y">
                    <ToggleRow label="Profile Visibility" />
                    <ToggleRow label="Show Online Status" />
                    <div className="py-4">
                        <p className="font-medium">Data Sharing</p>
                        <p className="text-sm text-muted-foreground mb-2">Lorem ipsum dolor sit amet</p>
                        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="radio" name="data-sharing"/> None</label><label className="flex items-center gap-2"><input type="radio" name="data-sharing" defaultChecked/> Limited</label><label className="flex items-center gap-2"><input type="radio" name="data-sharing"/> Full</label></div>
                    </div>
                    <ToggleRow label="Activity History" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="divide-y">
                    <ToggleRow label="Email Notification" />
                    <ToggleRow label="Push Notification" />
                    <div className="flex items-center justify-between py-3">
                        <div><p className="font-medium">Notification Frequency</p><p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p></div>
                        <Select defaultValue="immediate"><SelectTrigger className="w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="immediate">Immediate</SelectItem></SelectContent></Select>
                    </div>
                    <ToggleRow label="Community Updates" />
                    <ToggleRow label="Content Request Responses" />
                </CardContent>
            </Card>
        </div>
        <Button>Save Changes</Button>
    </div>
  );
}

function DisplayPreferences() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>Display Settings</CardTitle></CardHeader><CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div><p className="font-medium">Language</p><p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p></div>
                        <Select defaultValue="en"><SelectTrigger className="w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem></SelectContent></Select>
                    </div>
                     <div><p className="font-medium">Theme</p><p className="text-sm text-muted-foreground mb-2">Lorem ipsum dolor sit amet</p><div className="flex gap-4"><label className="flex items-center gap-2"><input type="radio" name="theme" defaultChecked/> Light</label><label className="flex items-center gap-2"><input type="radio" name="theme"/> Dark</label><label className="flex items-center gap-2"><input type="radio" name="theme"/> Auto</label></div></div>
                    <div className="flex items-center justify-between">
                        <div><p className="font-medium">Font Size</p><p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p></div>
                        <Select defaultValue="medium"><SelectTrigger className="w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="medium">Medium</SelectItem></SelectContent></Select>
                    </div>
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Request Settings</CardTitle></CardHeader><CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div><p className="font-medium">Default Access Level</p><p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p></div>
                        <Select defaultValue="view"><SelectTrigger className="w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="view">View Only</SelectItem></SelectContent></Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div><p className="font-medium">Request Expiration</p><p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet</p></div>
                        <Select defaultValue="30d"><SelectTrigger className="w-40"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="30d">30 Days</SelectItem></SelectContent></Select>
                    </div>
                    <ToggleRow label="Research Collaboration" />
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Research Access Control</CardTitle></CardHeader><CardContent className="divide-y">
                    <ToggleRow label="Public Research Data Visibility" />
                    <ToggleRow label="Public Research Data Download" />
                    <ToggleRow label="Public Research Data Modification" />
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Data Management</CardTitle></CardHeader><CardContent className="space-y-2">
                    <div className="flex items-center justify-between"><p>Download my research data</p><Button size="sm" variant="outline">Download</Button></div>
                    <div className="flex items-center justify-between"><p>Export Activity History</p><Button size="sm" variant="outline">Export</Button></div>
                    <div className="flex items-center justify-between"><p>Clear cache</p><Button size="sm" variant="outline">Clear</Button></div>
                    <div className="flex items-center justify-between"><p>Delete account</p><Button size="sm" variant="destructive">Delete</Button></div>
                </CardContent></Card>
            </div>
            <Button>Save Changes</Button>
        </div>
    );
}