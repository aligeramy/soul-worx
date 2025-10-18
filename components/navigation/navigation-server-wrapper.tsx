import { getHasSession } from "@/lib/actions/session"
import { TopBar } from "@/components/navigation/top-bar"
import { NavigationClientWrapper } from "@/components/navigation/navigation-client-wrapper"

/**
 * Server wrapper that composes TopBar with Navigation
 */
export async function NavigationServerWrapper() {
  const hasSession = await getHasSession()

  return (
    <NavigationClientWrapper
      topBar={<TopBar hasSession={hasSession} />}
      hasSession={hasSession}
    />
  )
}

