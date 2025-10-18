import { headers } from "next/headers"
import { TopBar } from "@/components/navigation/top-bar"
import { NavigationClientWrapper } from "@/components/navigation/navigation-client-wrapper"

/**
 * Server wrapper that composes TopBar (server) with Navigation (client)
 * Determines transparent navigation status from URL
 */
export async function NavigationServerWrapper() {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || "/"
  // Transparent on homepage and event pages with hero images
  const isTransparent = pathname === "/" || pathname.includes('/events/')

  return (
    <NavigationClientWrapper 
      topBar={<TopBar isHomepage={isTransparent} />}
    />
  )
}

