"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation/navigation"
import { shouldHideNavigation } from "@/config/navigation"
import { ReactNode } from "react"

interface NavigationClientWrapperProps {
  topBar: ReactNode
}

/**
 * Client wrapper that handles pathname-based logic
 * Receives the TopBar as a prop to respect server/client boundaries
 */
export function NavigationClientWrapper({ topBar }: NavigationClientWrapperProps) {
  const pathname = usePathname()
  const hideNav = shouldHideNavigation(pathname)

  if (hideNav) {
    return null
  }

  return (
    <>
      {topBar}
      <Navigation />
    </>
  )
}

