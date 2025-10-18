"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation/navigation"
import { CompactStickyNav } from "@/components/navigation/compact-sticky-nav"
import { shouldHideNavigation } from "@/config/navigation"
import { ReactNode } from "react"

interface NavigationClientWrapperProps {
  topBar: ReactNode
  hasSession: boolean
}

/**
 * Client wrapper that handles pathname-based logic
 * Receives the TopBar as a prop to respect server/client boundaries
 */
export function NavigationClientWrapper({ topBar, hasSession }: NavigationClientWrapperProps) {
  const pathname = usePathname()
  const hideNav = shouldHideNavigation(pathname)
  
  // Pages with full-screen hero sections where nav should overlay
  const isOverlayNav = pathname === "/" || pathname.includes('/events/')

  if (hideNav) {
    return null
  }

  return (
    <>
      <div className={isOverlayNav ? "absolute top-0 left-0 right-0 z-50" : "relative"}>
        {topBar}
        <Navigation />
      </div>
      <CompactStickyNav hasSession={hasSession} />
    </>
  )
}

