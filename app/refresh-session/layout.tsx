import { SessionProvider } from "@/components/providers/session-provider"

export default function RefreshSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}

