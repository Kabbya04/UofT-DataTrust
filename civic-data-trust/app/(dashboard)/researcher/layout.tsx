// app/(dashboard)/researcher/layout.tsx

"use client"

import type { ReactNode } from "react"
import { Sidebar } from '../../components/dashboard/sidebar';
import TopNav from "../../components/dashboard/top-nav"
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

  // This structure mirrors the community-member layout
  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto p-6 pt-24">{children}</main>
      </div>
    </div>
  )
}