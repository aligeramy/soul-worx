import { User } from "lucide-react"

interface UserMenuSkeletonProps {
  isHomepage: boolean
}

export function UserMenuSkeleton({ isHomepage }: UserMenuSkeletonProps) {
  const textColor = isHomepage ? "text-white/50" : "text-foreground/50"

  return (
    <div className={`flex items-center gap-2 text-sm ${textColor} animate-pulse`}>
      <User className="h-4 w-4" />
      <span className="hidden sm:inline w-16 h-4 bg-current/20 rounded" />
    </div>
  )
}

