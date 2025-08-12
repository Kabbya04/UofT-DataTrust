import { ActionCard } from "@/app/components/dashboard/ActionCard";
import { FileJson2, Search, SlidersHorizontal } from "lucide-react";

export default function DatasetMetadataPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Dataset Metadata</h1>
        <p className="text-muted-foreground mt-2 font-mono">Explore and manage the rich metadata attached to datasets.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          href="#"
          icon={Search}
          title="Browse Metadata"
          description="Search and filter all datasets based on their metadata tags and schemas."
        />
        <ActionCard
          href="/data-center/metadata-configuration"
          icon={SlidersHorizontal}
          title="Configure Schemas"
          description="Define the structure and rules for metadata to ensure data quality."
        />
        <ActionCard
          href="#"
          icon={FileJson2}
          title="Bulk Editor"
          description="Apply metadata changes to multiple datasets at once for efficient management."
        />
      </div>
    </div>
  );
}