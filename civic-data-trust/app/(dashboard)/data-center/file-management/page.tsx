import { ActionCard } from "@/app/components/dashboard/ActionCard";
import { Folder, Search, Shield, Clock } from "lucide-react";

export default function FileManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">File Management</h1>
        <p className="text-muted-foreground mt-2 font-mono">Browse, organize, and manage existing datasets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          href="#"
          icon={Folder}
          title="Housing Data"
          description="Datasets related to housing, occupancy, and development."
        />
        <ActionCard
          href="#"
          icon={Search}
          title="Economic Surveys"
          description="Data from local economic and business surveys."
        />
        <ActionCard
          href="#"
          icon={Shield}
          title="Public Safety"
          description="Anonymized records and statistics on public safety."
        />
        <ActionCard
          href="#"
          icon={Clock}
          title="Archived Data"
          description="Older datasets that are no longer actively updated."
        />
      </div>
    </div>
  );
}