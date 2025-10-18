import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
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
      <div className="min-h-screen bg-black">
        <SidebarProvider
          style={
            {
              "--sidebar-background": "#1c1c1e",
              "--sidebar-foreground": "rgb(255 255 255 / 0.9)",
              "--sidebar-primary": "rgb(255 255 255)",
              "--sidebar-primary-foreground": "#000000",
              "--sidebar-accent": "rgb(255 255 255 / 0.1)",
              "--sidebar-accent-foreground": "rgb(255 255 255)",
              "--sidebar-border": "rgb(255 255 255 / 0.1)",
            } as React.CSSProperties
          }
        >
          <AdminSidebar user={session.user} />
          <SidebarInset className="bg-black">
            <AdminHeader />
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SessionProvider>
  )
}
