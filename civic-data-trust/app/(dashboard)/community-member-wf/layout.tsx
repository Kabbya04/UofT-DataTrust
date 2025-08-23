"use client"

import type { ReactNode } from "react"
import { CommunityProvider } from "@/app/components/contexts/community-context";
import { BreadcrumbProvider } from "@/app/components/contexts/breadcrumb-context";
import { UserProvider } from "@/app/components/contexts/user-context";
import { Sidebar } from '@/app/components/dashboard/sidebar';
import TopNav from "@/app/components/dashboard/top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Breadcrumb } from "@/app/components/ui/breadcrumb"

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
    <BreadcrumbProvider>
      <UserProvider>
        <CommunityProvider>
          <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
            <Sidebar />
            <div className="w-full flex flex-1 flex-col">
              <TopNav />
              <main className="flex-1 overflow-auto p-6 pt-24">
                <Breadcrumb />
                {children}
              </main>
            </div>
          </div>
        </CommunityProvider>
      </UserProvider>
    </BreadcrumbProvider>
  )
}