import Link from "next/link"
import { User } from "lucide-react"
import { auth } from "@/auth"

interface UserMenuProps {
  isHomepage: boolean
}

export async function UserMenu({ isHomepage }: UserMenuProps) {
  const session = await auth()
  const textColor = isHomepage ? "text-white hover:text-white/80" : "text-foreground hover:text-primary"

  if (session?.user) {
    return (
      <Link
        href="/dashboard"
        className={`flex items-center gap-2 text-sm transition-colors ${textColor}`}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
    )
  }

  return (
    <Link
      href="/signin"
      className={`flex items-center gap-2 text-sm transition-colors ${textColor}`}
    >
      <User className="h-4 w-4" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  )
}

