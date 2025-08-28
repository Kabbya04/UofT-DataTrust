// app/components/RoleSelectorDialog.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Users, Microscope, Shield, Star } from 'lucide-react'; // <-- Unused icons like User, FlaskConical removed
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RoleSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// --- TYPE UPDATED: Removed the deleted roles ---
type Role = 'community-member-wf/home' | 'researcher-wf/home' | 'project-admin-wf/dashboard' | 'super-admin-wf/dashboard';

export default function RoleSelectorDialog({ isOpen, onOpenChange }: RoleSelectorDialogProps) {
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    if (!router) {
      console.error("Router is not available yet.");
      return; 
    }

    const path = `/${role}`;
    router.push(path);
    onOpenChange(false);
  };

  const RoleCard = ({ role, title, description, icon: Icon }: { role: Role; title: string; description: string; icon: React.ElementType; }) => (
    <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1" onClick={() => handleRoleSelect(role)}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg"><Icon className="w-6 h-6 text-primary" /></div>
          <div><CardTitle>{title}</CardTitle><CardDescription className="mt-1">{description}</CardDescription></div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Your Role</DialogTitle>
          <DialogDescription>Choose a role to view the corresponding dashboard experience.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* --- ROLES UPDATED: The two redundant roles have been removed --- */}
          <RoleCard role="super-admin-wf/dashboard" title="Super Admin" description="Full platform oversight, user management, and global analytics." icon={Star}/>
          <RoleCard role="project-admin-wf/dashboard" title="Project Admin" description="Manage communities, review posts, and view platform-wide analytics." icon={Shield}/>
          <RoleCard role="community-member-wf/home" title="Community Member" description="A workflow to manage and discover communities." icon={Users}/>
          <RoleCard role="researcher-wf/home" title="Researcher" description="A workflow for managing research projects." icon={Microscope}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}