'use client';

import { Card, CardContent } from "@/app/components/ui/card";
import { PlayCircle } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-mono-caps">How to get started</h1>
      <Card className="w-full aspect-video flex items-center justify-center bg-muted/50 border-2 border-dashed">
        <CardContent className="text-center text-muted-foreground p-0">
          <PlayCircle className="h-24 w-24 mx-auto opacity-30" />
          <p className="mt-4 font-semibold">Video Tutorial Placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}