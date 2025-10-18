"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { LayoutDashboard, Calendar, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo & Navigation */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Image
                  src="/logo/svg/logo.svg"
                  alt="Soulworx Logo"
                  width={32}
                  height={48}
                  className="h-10 w-auto"
                />
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/calendar">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
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
                <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback className="text-sm bg-neutral-200">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900 leading-none mb-1">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-500 leading-none">
                      {"Member"}
                    </p>
                  </div>
                </div>
              )}

              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}


