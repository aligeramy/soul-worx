"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { LayoutDashboard, Calendar, LogOut, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data } = useSession()
  const isAdminPath = pathname?.startsWith("/dashboard/admin")

  if (isAdminPath) {
    // Admin: no top bar, full-width, themed by admin layout
    return <>{children}</>
  }

  const user = data?.user
  const isAdmin = user?.role === "admin" || user?.role === "super_admin"

  return (
    <div className="min-h-screen bg-brand-bg-darker relative">
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `url('/noise.png')`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-bg-darker/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo & Navigation */}
            <div className="flex items-center gap-8">
              <Logo href="/" size="sm" variant="light" />

              <nav className="hidden md:flex items-center gap-1">
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/calendar">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Right - User Menu */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback className="text-sm bg-white/10 text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white leading-none mb-1">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/60 leading-none">
                      {isAdmin ? "Admin" : "Member"}
                    </p>
                  </div>
                </div>
              )}

              {isAdmin && (
                <Link href="/dashboard/admin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Shield className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Admin</span>
                  </Button>
                </Link>
              )}

              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {children}
      </main>
    </div>
  )
}


