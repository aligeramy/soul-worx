import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { LogOut, LayoutDashboard, Calendar } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"

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
              <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-neutral-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                  <AvatarFallback className="text-sm bg-neutral-200">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900 leading-none mb-1">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-neutral-500 leading-none">
                    {isAdmin ? "Administrator" : "Member"}
                  </p>
                </div>
              </div>
              
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm"
                  className="rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </form>
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
