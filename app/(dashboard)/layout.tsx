import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardShell from "@/components/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
