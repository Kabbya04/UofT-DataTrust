// app/(dashboard)/researcher/dashboard/page.tsx

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Search, Send, FolderKanban } from 'lucide-react';

// A reusable component for the action cards
const ActionCard = ({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string }) => (
  <Link href={href} className="group">
    <Card className="relative h-full bg-card rounded-xl 
                   overflow-hidden
                   transition-all duration-300 ease-in-out 
                   transform hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10">
      
      <div className="absolute top-0 left-0 h-full w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="pl-4">
        <CardHeader>
          <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 text-primary 
                         flex items-center justify-center 
                         transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg font-semibold text-mono-caps group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm font-mono">
            {description}
          </p>
        </CardContent>
      </div>
    </Card>
  </Link>
);

export default function ResearcherDashboardPage() {
  const researcherName = "Dr. Evelyn Reed"; 

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Welcome, {researcherName}!</h1>
        <p className="text-muted-foreground mt-2 font-mono">Your researcher dashboard is ready. Here are some quick actions to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          href="/researcher/search-community"
          icon={Search}
          title="Search Communities"
          description="Find communities and datasets relevant to your research field."
        />
        <ActionCard
          href="/researcher/access-requests/submit-request"
          icon={Send}
          title="Request Access"
          description="Submit a new request to access data from a private community."
        />
        <ActionCard
          href="/researcher/research-activity/active-projects"
          icon={FolderKanban}
          title="Manage Projects"
          description="View your active projects and track their data usage and compliance."
        />
      </div>
    </div>
  );
}