import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Edit, Save } from "lucide-react";

export default function TCPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-mono-caps">Platform Terms & Conditions</h1>
          <p className="text-muted-foreground mt-2 font-mono">Current active version: 2.1 (Published 2024-04-30)</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-mono-caps">
          <Edit className="w-4 h-4 mr-2"/> Edit Document
        </Button>
      </div>
      <Card className="bg-card dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-xl">
        <CardContent className="prose prose-sm dark:prose-invert font-mono p-6 max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the Civic Data Trust platform, you agree to be bound by these Terms & Conditions...</p>
          <h2>2. Data Contribution</h2>
          <p>All data contributed must be anonymized and stripped of any Personally Identifiable Information (PII). Contributors grant the Trust a perpetual, irrevocable license to use, analyze, and distribute the anonymized data...</p>
          <h2>3. Data Usage</h2>
          <p>Data accessed from the platform may only be used for purposes stated in your access request. Redistribution of raw data is strictly prohibited...</p>
        </CardContent>
      </Card>
    </div>
  );
}