// app/(dashboard)/community-discovery-and-membership/community-discovery-portal/[id]/page.tsx

import { CommunityDetailsViewer } from "../../../../components/community-details-viewer";

// This is the correct and standard way to type props for a dynamic page in the App Router.
// We define the shape of the props object directly.
export default function CommunityDetailsPage({ params }: { params: { id: string } }) {
  return <CommunityDetailsViewer communityId={params.id} />;
}