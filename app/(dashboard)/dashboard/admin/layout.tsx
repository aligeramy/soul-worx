import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SessionProvider } from "@/components/providers/session-provider"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Double-check admin access
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"
  
  if (!isAdmin || !session?.user) {
    redirect("/dashboard")
  }

  return (
    <SessionProvider>
      {/* Force dark theme for the admin area and use design tokens */}
      <div className="min-h-screen dark">
        <SidebarProvider>
          <AdminSidebar user={session.user} />
          <SidebarInset className="bg-background">
            <main className="flex-1 p-6">
              <div className="w-full">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionProvider>
  )
}
