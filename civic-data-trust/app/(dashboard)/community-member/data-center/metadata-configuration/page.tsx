import { ActionCard } from "@/app/components/dashboard/ActionCard";
import { Tag, ListChecks, DatabaseZap, ShieldCheck } from "lucide-react";

export default function MetadataConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Metadata Configuration</h1>
        <p className="text-muted-foreground mt-2 font-mono">Define schemas and tags to standardize data across the platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          href="#"
          icon={Tag}
          title="Manage Tags"
          description="Create, edit, or delete global tags used for categorizing datasets."
        />
        <ActionCard
          href="#"
          icon={ListChecks}
          title="Define Schemas"
          description="Establish standardized data structures and validation rules for new uploads."
        />
        <ActionCard
          href="#"
          icon={DatabaseZap}
          title="Automated Mapping"
          description="Configure rules to automatically apply metadata based on file content."
        />
        <ActionCard
          href="#"
          icon={ShieldCheck}
          title="Access Policies"
          description="Link metadata tags to specific data access and anonymization policies."
        />
      </div>
    </div>
  );
}