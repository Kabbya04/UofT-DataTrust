import { OtherUserProfileWF } from "@/app/components/other-user-profile-wf"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { userId } = await params
  
  return <OtherUserProfileWF userId={userId} />
}