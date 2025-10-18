import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Double-check admin access
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"
  
  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Navigation */}
      <div className="bg-black text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
                ADMIN
              </div>
              <span className="text-sm text-white/70">Content Management System</span>
            </div>
            <Link 
              href="/dashboard"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <AdminNavLink href="/dashboard/admin">Overview</AdminNavLink>
            <AdminNavLink href="/dashboard/admin/programs">Programs</AdminNavLink>
            <AdminNavLink href="/dashboard/admin/events">Events</AdminNavLink>
            <AdminNavLink href="/dashboard/admin/stories">Stories</AdminNavLink>
            <AdminNavLink href="/dashboard/admin/shop">Shop</AdminNavLink>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}

function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="py-4 border-b-2 border-transparent hover:border-black transition-colors text-sm font-medium text-neutral-600 hover:text-black"
    >
      {children}
    </Link>
  )
}

