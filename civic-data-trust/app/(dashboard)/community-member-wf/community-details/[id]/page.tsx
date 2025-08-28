// app/(dashboard)/community-member-wf/community-details/[id]/page.tsx

import CommunityDetailsView from "./community-details-view";

// Define the props correctly for a Next.js page component.
// `params` is an object, not a promise.
interface CommunityDetailsPageProps {
  params: { id: string };
}

export default function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  return <CommunityDetailsView id={params.id} />;
}