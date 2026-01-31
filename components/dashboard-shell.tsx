"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { LayoutDashboard, Calendar, LogOut, Shield, User, Settings, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpgradeLink } from "@/components/upgrade-link"

function getTierLabel(tier: string | null): string {
  switch (tier) {
    case "pro":
      return "Pro Tier"
    case "pro_plus":
      return "Pro+ Tier"
    default:
      return "Free Tier"
  }
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data } = useSession()
  const [tier, setTier] = useState<string | null>(null)
  const isAdminPath = pathname?.startsWith("/dashboard/admin")

  useEffect(() => {
    if (!data?.user?.id) return
    fetch("/api/user/tier")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data?.tier != null ? setTier(data.tier) : setTier("free"))
      .catch(() => setTier("free"))
  }, [data?.user?.id])
  const isProfilePath = pathname?.startsWith("/profile")
  const isOnboardingPath = pathname?.startsWith("/onboarding")

  if (isAdminPath || isProfilePath || isOnboardingPath) {
    // Admin, Profile, and Onboarding: no top bar, full-width, themed by their own layouts
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
                <>
                  {/* Desktop - User Menu with Dropdown */}
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
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
                              {isAdmin ? "Admin" : getTierLabel(tier)}
                            </p>
                          </div>
                          <ChevronDown className="h-4 w-4 text-white/60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <UpgradeLink />
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard/admin" className="cursor-pointer">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile - Simple Avatar */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1">
                          <Avatar className="h-8 w-8 border border-white/20">
                            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                            <AvatarFallback className="text-sm bg-white/10 text-white">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        <UpgradeLink />
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard/admin" className="cursor-pointer">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Admin Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
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


