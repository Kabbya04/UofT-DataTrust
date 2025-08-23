import { OtherUserProfileWF } from "../../../../components/other-user-profile-wf"
import { SharedNavigationWF } from "../../../../components/shared-navigation-wf"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { userId } = await params
  
  return (
    <SharedNavigationWF>
      <OtherUserProfileWF userId={userId} />
    </SharedNavigationWF>
  )
}