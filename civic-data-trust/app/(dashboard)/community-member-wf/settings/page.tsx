"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"

const TABS = [
  "Account Settings",
  "Privacy & Notifications",
  "Display & Preferences"
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="w-full mx-auto ">
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
  )
}

function AccountSettings() {
  return (
    <div className=" ml-10 px-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-muted" />
        <div>
          <div className="font-semibold text-lg">Jhon Doe <span className="bg-muted px-2 py-0.5 rounded text-xs ml-2">Community Member</span></div>
          <div className="text-xs text-muted-foreground">Member since 17 January, 2025</div>
        </div>
      </div>
      <form className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-md mb-1">First Name:</label>
          <input className="w-full border rounded px-2 py-1" defaultValue="Jhon" />
        </div>
        <div>
          <label className="block text-md mb-1">Last Name:</label>
          <input className="w-full border rounded px-2 py-1" defaultValue="Doe" />
        </div>
        <div className="col-span-2">
          <label className="block text-md mb-1">Email:</label>
          <input className="w-full border rounded px-2 py-1" defaultValue="jhon@email.com" disabled />
        </div>
        <div className="col-span-2">
          <label className="block text-md mb-1">Password:</label>
          <input className="w-full border rounded px-2 py-1" type="password" defaultValue="********" />
        </div>
      </form>
      <Button variant="default">Save Changes</Button>
    </div>
  )
}

function PrivacyNotifications() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Privacy Settings */}
      <div className="border border-primary rounded-lg p-4">
        <h2 className="font-semibold mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <ToggleRow label="Profile Visibility" />
          <ToggleRow label="Show Online Status" />
          <div>
            <div className="text-md font-medium mb-1">Data Sharing</div>
            <div className="flex gap-4 ml-4">
              <Radio label="None" />
              <Radio label="Limited" />
              <Radio label="Full" checked />
            </div>
          </div>
          <ToggleRow label="Activity History" />
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="border border-primary rounded-lg p-4">
        <h2 className="font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <ToggleRow label="Email Notification" />
          <ToggleRow label="Push Notification" />
          <div className="flex flex-row items-center gap-8 justify-between">
            <div className="text-sm font-medium mb-1">Notification Frequency:</div>
            <select className="flex-1 border border-primary rounded px-2 py-1 text-md">
              <option>Immediate</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <ToggleRow label="Community Updates" />
          <ToggleRow label="Researcher Access Requests" />
        </div>
      </div>
      <div className="col-span-2 mt-6">
        <Button variant="default">Save Changes</Button>
      </div>
    </div>
  )
}

function DisplayPreferences() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Display Settings */}
      <div className="border border-primary rounded-lg p-4">
        <h2 className="font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4 px-8">
          <div className="flex items-center gap-8 justify-between">
            <div className="text-md font-medium mb-1">Language:</div>
            <select className="border flex-1 rounded px-2 py-1 text-md">
              <option>English</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <div className="text-md font-medium mb-1">Theme: </div>
            <div className="flex gap-4 ml-8">
              <Radio label="Light" />
              <Radio label="Dark" />
              <Radio label="Auto" checked />
            </div>
          </div>
          <div className="flex items-center gap-12 justify-between">
            <div className="text-md font-medium mb-1">Font Size:</div>
            <select className="border flex-1 rounded px-2 py-1 text-md">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>
      {/* Community Preferences */}
      <div className="border border-primary rounded-lg p-4">
        <h2 className="font-semibold mb-4">Community Preferences</h2>
        <div className="space-y-4">
          <ToggleRow label="Content Filter" />
          <ToggleRow label="Show suggested communities" />
        </div>
      </div>
      {/* Researcher Access Control */}
      <div className="border border-primary rounded-lg p-4">
        <h2 className="font-semibold mb-4">Researcher Access Control</h2>
        <div className="space-y-4">
          <ToggleRow label="Allow Researcher Requests" />
          <div className="flex items-center gap-8 justify-between">
            <div className="text-md font-medium mb-1">Default Access Level:</div>
            <select className="border flex-1 rounded px-2 py-1 text-md">
              <option>View Only</option>
              <option>Edit</option>
            </select>
          </div>
        </div>
      </div>
      {/* Data Management */}
      <div className="border border-primary rounded-lg p-4">
        <h2 className="font-semibold mb-4">Data Management</h2>
        <div className="space-y-4 px-10">
          <ActionRow label="Download my data" action="Download" />
          <ActionRow label="Export Activity History" action="Export" />
          <ActionRow label="Clear cache" action="Clear" />
          <ActionRow label="Delete account" action="Delete" danger />
        </div>
      </div>
      <div className="col-span-2 mt-6">
        <Button variant="default">Save Changes</Button>
      </div>
    </div>
  )
}

// Helper components for toggles, radios, actions
function ToggleRow({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <span className="text-md">{label}</span>
      <Toggle checked={checked} onChange={setChecked} />
    </div>
  );
}

// Custom Toggle component
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-200
        ${checked ? "bg-black" : "bg-gray-400"}`}
      style={{ boxShadow: checked ? "0 1px 4px rgba(0,0,0,0.08)" : undefined }}
    >
      <span
        className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
          ${checked ? "translate-x-1" : ""}`}
        style={{ transform: checked ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

function Radio({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <label className="flex items-center gap-1 text-md">
      <input type="radio" checked={checked} className="radio" />
      {label}
    </label>
  )
}

function ActionRow({ label, action, danger }: { label: string; action: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-md">{label}</span>
      <Button variant={danger ? "destructive" : "outline"} size="sm" className=" w-32">{action}</Button>
    </div>
  )
}