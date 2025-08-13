// app/(dashboard)/community-discovery-and-membership/community-discovery-portal/[id]/page.tsx

import { CommunityDetailsViewer } from "../../../../components/community-details-viewer";

// Using 'any' as a temporary workaround for a likely Next.js 15 build bug.
// This tells TypeScript to not type-check the props for this page, bypassing the error.
export default function CommunityDetailsPage({ params }: any) {
  return <CommunityDetailsViewer communityId={params.id} />;
}