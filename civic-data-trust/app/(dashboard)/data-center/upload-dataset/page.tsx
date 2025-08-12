'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { UploadCloud, FileText, Info } from "lucide-react";

export default function UploadDataSetPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Upload New Dataset</h1>
        <p className="text-muted-foreground mt-2 font-mono">Contribute data to the trust. All uploads are versioned.</p>
      </div>

      <Card className="bg-card dark:bg-neutral-900 border-2 border-dashed border-border dark:border-neutral-800 rounded-xl text-center">
        <CardContent className="p-12 flex flex-col items-center">
          <UploadCloud className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-xl font-semibold text-mono-caps">Drag & Drop Files Here</h2>
          <p className="text-muted-foreground font-mono mt-2">or</p>
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-mono-caps">
            Browse Files
          </Button>
          <p className="text-xs text-muted-foreground font-mono mt-6">
            Supported formats: CSV, JSON, GeoJSON. Max file size: 500MB.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl">
          <CardHeader className="flex flex-row items-start gap-4">
            <FileText className="w-6 h-6 text-primary mt-1 shrink-0" />
            <div>
              <CardTitle className="text-lg text-mono-caps">Data Formatting Guide</CardTitle>
              <p className="text-sm text-muted-foreground font-mono mt-2">Ensure your dataset is correctly formatted for seamless integration. Read our documentation for details on required fields and data types.</p>
            </div>
          </CardHeader>
        </Card>
        <Card className="bg-card dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl">
          <CardHeader className="flex flex-row items-start gap-4">
            <Info className="w-6 h-6 text-primary mt-1 shrink-0" />
            <div>
              <CardTitle className="text-lg text-mono-caps">Anonymization Policy</CardTitle>
              <p className="text-sm text-muted-foreground font-mono mt-2">All uploaded data must comply with our anonymization standards. Personally Identifiable Information (PII) is strictly prohibited.</p>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}