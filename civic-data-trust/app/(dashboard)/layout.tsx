// import { Sidebar } from '../components/dashboard/sidebar';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     // Apply the dashboard-theme class here
//     <div className="dashboard-theme"> 
//       <div className="flex h-screen w-full bg-background">
//         <Sidebar />
//         <main className="flex-1 p-8 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client"

import type { ReactNode } from "react"
import { CommunityProvider } from "../components/contexts/community-context";
import { Sidebar } from '../components/dashboard/sidebar';
import TopNav from "../components/dashboard/top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto p-6 pt-24"><CommunityProvider>{children}</CommunityProvider></main>
      </div>
    </div>
  )
}
