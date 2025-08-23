"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation" 
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useBreadcrumb, generateBreadcrumbsFromPath } from "../contexts/breadcrumb-context"

interface BreadcrumbProps {
  customBreadcrumbs?: Array<{ label: string; href?: string; isActive?: boolean }>
  autoGenerate?: boolean
}

export function Breadcrumb({ customBreadcrumbs, autoGenerate = true }: BreadcrumbProps) {
  const pathname = usePathname()
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumb()
  
  useEffect(() => {
    if (customBreadcrumbs) {
      setBreadcrumbs(customBreadcrumbs)
    } else if (autoGenerate) {
      const generated = generateBreadcrumbsFromPath(pathname)
      setBreadcrumbs(generated)
    }
  }, [pathname, customBreadcrumbs, autoGenerate, setBreadcrumbs])
  
  if (breadcrumbs.length <= 1) return null
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/60" />}
          {item.href && !item.isActive ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.isActive ? "text-foreground font-medium" : ""}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}