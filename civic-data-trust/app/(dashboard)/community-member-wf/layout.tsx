"use client"

import type { ReactNode } from "react"
import { CommunityProvider } from "@/app/components/contexts/community-context";
import { SharedNavigationWF } from "@/app/components/shared-navigation-wf";

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <CommunityProvider>
      <SharedNavigationWF>
        {children}
      </SharedNavigationWF>
    </CommunityProvider>
  )
}