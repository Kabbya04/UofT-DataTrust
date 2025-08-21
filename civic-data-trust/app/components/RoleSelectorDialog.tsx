'use client';

import { useRouter } from 'next/navigation';
import { User, FlaskConical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RoleSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type Role = 'community-member' | 'researcher';

export default function RoleSelectorDialog({ isOpen, onOpenChange }: RoleSelectorDialogProps) {
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    // Navigate to the dashboard corresponding to the selected role
    router.push(`/${role}/dashboard`);
    onOpenChange(false); // Close the dialog
  };

  const RoleCard = ({
    role,
    title,
    description,
    icon: Icon,
  }: {
    role: Role;
    title: string;
    description: string;
    icon: React.ElementType;
  }) => (
    <Card
      className="cursor-pointer transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1"
      onClick={() => handleRoleSelect(role)}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Your Role</DialogTitle>
          <DialogDescription>
            Choose a role to view the corresponding dashboard experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RoleCard
            role="community-member"
            title="Community Member"
            description="Engage with communities, view shared data, and participate in discussions."
            icon={User}
          />
          <RoleCard
            role="researcher"
            title="Researcher"
            description="Access advanced tools, perform analysis, and manage research datasets."
            icon={FlaskConical}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}