"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function PlaceholderPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: { label: string; onClick?: () => void }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-primary text-xl">{title}</CardTitle>
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          {actions && (
            <div className="flex gap-2">
              {actions.map((action, i) => (
                <Button
                  key={i}
                  onClick={action.onClick}
                  className="bg-primary text-primary-foreground"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
