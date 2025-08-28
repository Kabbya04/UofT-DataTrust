// app/(dashboard)/community-member-wf/community-details/[id]/page.tsx

import CommunityDetailsView from "./community-details-view";

// Updated interface for Next.js 15 - params is now a Promise
interface CommunityDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  // Await the params in Next.js 15
  const { id } = await params;
  
  return <CommunityDetailsView id={id} />;
}