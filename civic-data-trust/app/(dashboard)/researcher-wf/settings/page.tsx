'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from "@/app/components/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

const TABS = ["Account Settings", "Privacy & Notifications", "Display & Preferences"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);

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

const ToggleRow = ({ label, description }: { label: string; description?: string }) => {
    const [on, setOn] = useState(false);
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="font-medium">{label}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <ToggleSwitch checked={on} onChange={setOn} />
        </div>
    );
};

// Tab Content Components
function AccountSettings() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      setFormData(prev => ({
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

  // Map role IDs to readable role names
  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      '7d1222ee-a32b-4981-8b31-89ac68b640fb': 'Researcher',
      '38252b5f-55ff-4cae-aad1-f442971e2e16': 'Community Member',
      '445acacc-aa8c-4902-892d-13e8afc8be3f': 'Community Admin',
      '093e572a-3226-4786-a16b-8020e2cf5bfd': 'Super Admin',
    };
    return roleNames[role] || role;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user name if changed
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (fullName && fullName !== user?.name) {
        console.log('Updating user name from:', user?.name, 'to:', fullName);
        console.log('User ID:', user?.id);
        console.log('Update data being sent:', { name: fullName });
        await updateUser({ name: fullName });
      }

      // TODO: Handle password update - would need separate endpoint
      if (formData.newPassword && formData.currentPassword) {
        console.log('Password update requested - this would need a separate API endpoint');
        // For now, just log the intent
      }

      alert('Settings updated successfully!');
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Error updating settings:', error);
      alert(`Error updating settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-10 px-8">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.avatar || "/profile.jpg"} alt={user.name} />
          <AvatarFallback className="text-xl">{getUserInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-lg">
            {user.name} 
            <span 
              className="bg-civic-accent-green text-white px-2 py-0.5 rounded text-xs ml-2"
              style={{ backgroundColor: "#43CD41" }}
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
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-md mb-1">First Name:</label>
            <input 
              name="firstName"
              className="w-full border border-custom-border rounded px-2 py-1" 
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={user.name.split(' ')[0] || 'First Name'}
            />
          </div>
          <div>
            <label className="block text-md mb-1">Last Name:</label>
            <input 
              name="lastName"
              className="w-full border border-custom-border rounded px-2 py-1" 
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={user.name.split(' ').slice(1).join(' ') || 'Last Name'}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-md mb-1">Email:</label>
          <input 
            className="w-full border border-custom-border rounded px-2 py-1 bg-muted" 
            value={user.email} 
            disabled 
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-custom-border">
          <h3 className="font-semibold">Change Password</h3>
          <div>
            <label className="block text-md mb-1">Current Password:</label>
            <input 
              name="currentPassword"
              type="password"
              className="w-full border border-custom-border rounded px-2 py-1" 
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-md mb-1">New Password:</label>
            <input 
              name="newPassword"
              type="password"
              className="w-full border border-custom-border rounded px-2 py-1" 
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-md mb-1">Confirm New Password:</label>
            <input 
              name="confirmPassword"
              type="password"
              className="w-full border border-custom-border rounded px-2 py-1" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
          </div>
          {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
            <p className="text-red-500 text-xs">Passwords do not match</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          variant="default"
          className="bg-brand-blue hover:bg-brand-blue/90 text-white"
          disabled={isLoading || !!(formData.newPassword && formData.newPassword !== formData.confirmPassword)}
          style={{ backgroundColor: "#2196F3" }}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}

function PrivacyNotifications() {
  // Custom Radio component
  const Radio = ({ label, checked }: { label: string; checked?: boolean }) => {
    return (
      <label className="flex items-center gap-1 text-md">
        <input 
          type="radio" 
          checked={checked} 
          className="radio" 
          style={{ 
            accentColor: checked ? 'white' : 'black',
            borderColor: '#2196F3',
            borderWidth: '2px',
            backgroundColor: checked ? 'white' : 'transparent'
          }} 
        /> 
        {label}
      </label>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Privacy Settings */}
      <div className="border border-custom-border rounded-lg p-4">
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
      <div className="border border-custom-border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <ToggleRow label="Email Notification" />
          <ToggleRow label="Push Notification" />
          <div className="flex flex-row items-center gap-8 justify-between">
            <div className="text-sm font-medium mb-1">Notification Frequency:</div>
            <select className="flex-1 border border-custom-border rounded px-2 py-1 text-md">
              <option>Immediate</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <ToggleRow label="Community Updates" />
          <ToggleRow label="Content Request Responses" />
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
  );
}

function DisplayPreferences() {
  // Custom Radio component
  const Radio = ({ label, checked }: { label: string; checked?: boolean }) => {
    return (
      <label className="flex items-center gap-1 text-md">
        <input 
          type="radio" 
          checked={checked} 
          className="radio" 
          style={{ 
            accentColor: checked ? 'white' : 'black',
            borderColor: '#2196F3',
            borderWidth: '2px',
            backgroundColor: checked ? 'white' : 'transparent'
          }} 
        /> 
        {label}
      </label>
    )
  }

  // ActionRow component for Data Management
  const ActionRow = ({ label, action, danger }: { label: string; action: string; danger?: boolean }) => {
    // Determine button variant and class based on action
    let buttonVariant: "default" | "destructive" | "outline" | "success" = "outline";
    let buttonClass = "w-32"; // Ensure all buttons have the same width

    if (action === "Download") {
      buttonClass += " bg-brand-blue hover:bg-brand-blue/90 text-white";
    } else if (action === "Export") {
      // Instead of using the variant, directly apply the classes to ensure the color is applied
      buttonClass += " bg-civic-accent-green hover:bg-civic-accent-green/90 text-white";
    } else if (action === "Clear") {
      buttonClass += " bg-custom-orange hover:bg-custom-orange/90 text-white";
    } else if (danger) {
      buttonVariant = "destructive";
    }

    return (
      <div className="flex items-center justify-between">
        <span className="text-md">{label}</span>
        <Button 
          variant={buttonVariant} 
          size="sm" 
          className={buttonClass}
          style={{
            backgroundColor: action === "Download" ? "#2196F3" : 
                            action === "Export" ? "#43CD41" :
                            action === "Clear" ? "#DE9300" : undefined
          }}
        >
          {action}
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Display Settings */}
      <div className="border border-custom-border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Display Settings</h2>
        <div className="space-y-4 px-8">
          <div className="flex items-center gap-8 justify-between">
            <div className="text-md font-medium mb-1">Language:</div>
            <select className="border border-custom-border flex-1 rounded px-2 py-1 text-md">
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
            <select className="border border-custom-border flex-1 rounded px-2 py-1 text-md">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>
      {/* Request Settings */}
      <div className="border border-custom-border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Request Settings</h2>
        <div className="space-y-4">
          <ToggleRow label="Research Collaboration" />
          <div className="flex items-center gap-8 justify-between">
            <div className="text-md font-medium mb-1">Default Access Level:</div>
            <select className="border border-custom-border flex-1 rounded px-2 py-1 text-md">
              <option>View Only</option>
              <option>Edit</option>
            </select>
          </div>
        </div>
      </div>
      {/* Research Access Control */}
      <div className="border border-custom-border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Research Access Control</h2>
        <div className="space-y-4">
          <ToggleRow label="Public Research Data Visibility" />
          <ToggleRow label="Public Research Data Download" />
          <ToggleRow label="Public Research Data Modification" />
        </div>
      </div>
      {/* Data Management */}
      <div className="border border-custom-border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Data Management</h2>
        <div className="space-y-4 px-10">
          <ActionRow label="Download my research data" action="Download" />
          <ActionRow label="Export Activity History" action="Export" />
          <ActionRow label="Clear cache" action="Clear" />
          <ActionRow label="Delete account" action="Delete" danger />
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
  );
}
