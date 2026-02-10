import { auth } from "@/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""

  // Allow public access to onboarding for showcase (no auth required)
  if (pathname.startsWith("/onboarding")) {
    return (
      <DashboardShell>
        {children}
      </DashboardShell>
    )
  }

  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}
