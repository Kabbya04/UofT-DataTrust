'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

const TABS = [
  "Account Settings",
  "Privacy & Notifications",
  "Display & Preferences"
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)

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
        {activeTab === 0 && <AccountSettings />}
        {activeTab === 1 && <PrivacyNotifications />}
        {activeTab === 2 && <DisplayPreferences />}
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
    <div className="px-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-muted" />
        <div>
          <div className="font-semibold text-lg">
            Jhon Doe 
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
              Researcher
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Member since 17 January, 2025
          </div>
        </div>
      </div>
      
      <form className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-md mb-1">First Name:</label>
            <input className="w-full border rounded px-2 py-1" defaultValue="Jhon" />
          </div>
          <div>
            <label className="block text-md mb-1">Last Name:</label>
            <input className="w-full border rounded px-2 py-1" defaultValue="Doe" />
          </div>
        </div>
        
        <div>
          <label className="block text-md mb-1">Email:</label>
          <input 
            className="w-full border rounded px-2 py-1 bg-muted" 
            defaultValue="jhon@email.com" 
            disabled 
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
        </div>
        
        <div>
          <label className="block text-md mb-1">Password:</label>
          <input 
            type="password"
            className="w-full border rounded px-2 py-1" 
            defaultValue="********" 
          />
        </div>
        
        <Button 
          variant="default"
          style={{ backgroundColor: '#03A9F4', color: 'white' }}
          className="hover:opacity-90"
        >
          Save Changes
        </Button>
      </form>
    </div>
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
        <Button 
          style={{ backgroundColor: '#03A9F4', color: 'white' }}
          className="hover:opacity-90"
        >
          Save Changes
        </Button>
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
                <Card><CardHeader><CardTitle>Data Management</CardTitle></CardHeader><CardContent className="space-y-4 px-10">
                    <div className="flex items-center justify-between"><span className="text-md">Download my research data</span><Button size="sm" className="w-32 text-white uppercase" style={{ background: '#2196F3' }}>download</Button></div>
                    <div className="flex items-center justify-between"><span className="text-md">Export Activity History</span><Button size="sm" className="bg-green-500 w-32 text-white uppercase">export</Button></div>
                    <div className="flex items-center justify-between"><span className="text-md">Clear cache</span><Button size="sm" className="bg-yellow-500 w-32 text-white uppercase">clear</Button></div>
                    <div className="flex items-center justify-between"><span className="text-md">Delete account</span><Button size="sm" className="bg-red-500 w-32 text-white uppercase">delete</Button></div>
                </CardContent></Card>
            </div>
            <Button 
              style={{ backgroundColor: '#03A9F4', color: 'white' }}
              className="hover:opacity-90"
            >
              Save Changes
            </Button>
        </div>
    );
}