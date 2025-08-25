// civic-data-trust/app/(dashboard)/community-member-wf/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityMemberWfPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard immediately
    router.replace('/community-member-wf/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}