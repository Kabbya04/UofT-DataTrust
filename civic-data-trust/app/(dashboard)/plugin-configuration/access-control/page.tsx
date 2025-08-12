import { ActionCard } from "@/app/components/dashboard/ActionCard";
import { Users, Shield, KeyRound, Settings2 } from "lucide-react";

export default function AccessControlPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Access Control Configuration</h1>
        <p className="text-muted-foreground mt-2 font-mono">Manage who can see what data, and under which conditions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          href="#"
          icon={Users}
          title="Role Management"
          description="Define user roles like 'Researcher', 'Admin', and 'Community Member'."
        />
        <ActionCard
          href="#"
          icon={Shield}
          title="Policy Editor"
          description="Create and edit fine-grained access policies for specific datasets."
        />
        <ActionCard
          href="#"
          icon={KeyRound}
          title="API Key Permissions"
          description="Manage permissions for programmatic access via API keys."
        />
        <ActionCard
          href="#"
          icon={Settings2}
          title="Default Settings"
          description="Set the default access policy for all newly uploaded datasets."
        />
      </div>
    </div>
  );
}