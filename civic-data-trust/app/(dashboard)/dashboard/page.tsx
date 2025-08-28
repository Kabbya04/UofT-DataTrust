// civic-data-trust/app/(dashboard)/dashboard/page.tsx

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { UploadCloud, FileSearch, Search, UserCog, ChartLine } from 'lucide-react';

// A reusable placeholder for the graph SVG
const PlaceholderGraph = () => (
  <div className="w-full h-48 text-muted-foreground/50">
    <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid lines */}
      <path d="M 0 30 H 400 M 0 60 H 400 M 0 90 H 400 M 0 120 H 400" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
      {/* Data line */}
      <path d="M 20 120 C 80 90, 150 40, 220 70 S 350 100, 380 60" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
      {/* Data points */}
      <circle cx="20" cy="120" r="3" fill="hsl(var(--primary))" />
      <circle cx="220" cy="70" r="3" fill="hsl(var(--primary))" />
      <circle cx="380" cy="60" r="3" fill="hsl(var(--primary))" />
    </svg>
  </div>
);

// A reusable component for the action cards - Now theme-aware
const ActionCard = ({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string }) => (
  <Link href={href} className="group">
    {/* --- CARD STYLING IS NOW THEME-AWARE --- */}
    <Card className="relative h-full bg-card rounded-xl 
                   overflow-hidden
                   transition-all duration-300 ease-in-out 
                   transform hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10">
      
      <div className="absolute top-0 left-0 h-full w-1 bg-primary 
                     opacity-0 group-hover:opacity-100 
                     transition-opacity duration-300" 
      />
      <div className="pl-4">
        <CardHeader>
          {/* --- ICON BACKGROUND IS NOW THEME-AWARE --- */}
          <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 text-primary 
                         flex items-center justify-center 
                         transition-colors duration-300 group-hover:bg-primary/20 dark:group-hover:bg-primary/10">
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

export default function DashboardWelcomePage() {
  const userName = "Alex Ryder"; 

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-mono-caps">Welcome Back, {userName}!</h1>
        <p className="text-muted-foreground mt-2 font-mono">Here&apos;s a quick overview of your Civic Data Trust dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          href="/data-center/upload-dataset"
          icon={UploadCloud}
          title="Upload Dataset"
          description="Contribute to the data trust by uploading a new dataset for community use."
        />
        <ActionCard
          href="/request-center/request-review"
          icon={FileSearch}
          title="Review Requests"
          description="View and manage pending data access requests from other members."
        />
        <ActionCard
          href="/community-discovery-and-membership/community-discovery-portal"
          icon={Search}
          title="Discover Communities"
          description="Explore and find new communities to join and collaborate with."
        />
        <ActionCard
          href="/authentication-profile/profile-management"
          icon={UserCog}
          title="Manage Profile"
          description="Update your personal information and manage your notification settings."
        />
      </div>

      {/* --- NEW WIDE GRAPH CARD ADDED HERE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2"> {/* This makes the card span the full width on large screens */}
          <h2 className="text-2xl font-bold text-mono-caps mb-4">Platform Statistics</h2>
          <Card className="bg-card  border border-border  rounded-xl">
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-mono-caps">Data Upload Trends</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono mt-1">Activity over the last 30 days</p>
                </div>
                <ChartLine className="w-6 h-6 text-primary"/>
             </CardHeader>
            <CardContent>
              <PlaceholderGraph />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}