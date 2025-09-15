'use client';

import { useRouter } from 'next/navigation';
import { User, FlaskConical, Microscope, Users, Shield, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

// Step 1: Define an interface for the component's props
interface RoleSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type Role = 'researcher-wf/home' | 'community-member-wf/home' | 'project-admin-wf/dashboard' | 'super-admin-wf/dashboard';

// Step 2: Update the function to accept the props
export default function RoleSelectorDialog({ isOpen, onOpenChange }: RoleSelectorDialogProps) {
  const router = useRouter();

  // Debug logging
  console.log('RoleSelectorDialog rendered with isOpen:', isOpen);

  const handleRoleSelect = (role: Role) => {
    console.log('Role selected:', role); // Debug log
    const path = `/${role}`;
    router.push(path);
    onOpenChange(false); // Step 4: Close the dialog after selection
  };

  // If dialog is not supposed to be open, don't render anything
  if (!isOpen) {
    console.log('Dialog not open, not rendering');
    return null;
  }

  const RoleCard = ({ role, title, description, icon: Icon }: { role: Role; title: string; description: string; icon: React.ElementType; }) => (
    <Card className="cursor-pointer transition-all hover:border-civic-gray-400 hover:shadow-figma-card hover:-translate-y-1 bg-white border border-civic-gray-200 rounded-2xl" onClick={() => handleRoleSelect(role)}>
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-civic-gray-100 rounded-lg">
            <Icon className="w-6 h-6 text-civic-gray-900" />
          </div>
          <div>
            <CardTitle className="text-figma-lg font-bold text-civic-gray-900 font-urbanist">{title}</CardTitle>
            <CardDescription className="mt-1 text-figma-base text-civic-gray-500 font-urbanist">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    // Step 3: Pass the props to the underlying Dialog component
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-civic-gray-200 shadow-figma-card rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-figma-2xl font-bold text-civic-gray-900 font-urbanist">Select Your Role</DialogTitle>
          <DialogDescription className="text-figma-base text-civic-gray-500 font-urbanist">Choose a role to view the corresponding dashboard experience.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RoleCard role="super-admin-wf/dashboard" title="Super Admin" description="Full platform oversight, user management, and global analytics." icon={Star}/>
          <RoleCard role='project-admin-wf/dashboard' title="Community Admin" description="Manage communities, review posts, and view platform-wide analytics." icon={Shield}/>
          <RoleCard role="community-member-wf/home" title="Community Member" description="A workflow to manage and discover communities." icon={Users}/>
          <RoleCard role="researcher-wf/home" title="Researcher" description="A workflow for managing research projects." icon={Microscope}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}