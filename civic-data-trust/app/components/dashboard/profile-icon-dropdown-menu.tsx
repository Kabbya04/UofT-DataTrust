import { SignOut, ArrowSquareOut, User, Users, FileText, CheckCircle } from "phosphor-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "../ui/card"
import { useAuth } from '../contexts/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface Profile01Props {
  name: string
  role: string
  avatar: string
  subscription?: string
}

const defaultProfile = {
  name: "Eugene An",
  role: "Prompt Engineer",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
  subscription: "Free Trial",
} satisfies Required<Profile01Props>

export default function Profile01({
  avatar = defaultProfile.avatar,
}: Partial<Profile01Props> = {}) {
  const { user, logout } = useAuth();
  
  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Map role IDs to readable role names
  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      '7d1222ee-a32b-4981-8b31-89ac68b640fb': 'Researcher',
      '38252b5f-55ff-4cae-aad1-f442971e2e16': 'Community User',
      '445acacc-aa8c-4902-892d-13e8afc8be3f': 'Community Admin',
      '093e572a-3226-4786-a16b-8020e2cf5bfd': 'Super Admin',
    };
    return roleNames[role] || role;
  };
  const menuItems: MenuItem[] = [
    {
      label: "My Profile",
      href: "/community-member-wf/my-profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      label: "Membership Requests",
      href: "/community-member-wf/membership-requests",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Audit Logs",
      href: "/community-member-wf/audit-logs",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: "Researcher Access Requests",
      href: "/community-member-wf/researcher-access-requests",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ]

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground">
        <Card className="relative px-6 pt-12 pb-6 border-0" style={{ backgroundColor: '#F1F1F1', color: 'black' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="relative shrink-0">
              <Avatar className="w-18 h-18 ring-4 ring-background">
                <AvatarImage src={avatar} alt={user?.name || 'User'} />
                <AvatarFallback className="text-lg">{user ? getUserInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold" style={{ color: 'black' }}>{user?.name || 'Loading...'}</h2>
              <p style={{ color: 'black' }}>{user ? getRoleName(user.role) : 'Loading...'}</p>
              <p className="text-sm" style={{ color: 'black' }}>{user?.email || ''}</p>
            </div>
          </div>
          <div className="h-px my-6" style={{ backgroundColor: '#ddd' }} />
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#F1F1F1', color: 'black' }}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium" style={{ color: 'black' }}>{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.value && <span className="text-sm mr-2" style={{ color: 'black' }}>{item.value}</span>}
                  {item.external && <ArrowSquareOut className="w-4 h-4" style={{ color: 'black' }} />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#F1F1F1', color: 'black' }}
            > 
              <div className="flex items-center gap-2">
                <SignOut className="w-4 h-4" style={{ color: 'black' }} />
                <span className="text-sm font-medium" style={{ color: 'black' }}>Logout</span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
