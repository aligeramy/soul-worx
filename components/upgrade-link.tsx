"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Sparkles } from "lucide-react"
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function UpgradeLink() {
  const { data } = useSession()
  const [userTier, setUserTier] = useState<"free" | "pro" | "pro_plus" | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = data?.user?.role === "admin" || data?.user?.role === "super_admin"

  useEffect(() => {
    async function fetchTier() {
      try {
        const response = await fetch("/api/user/tier")
        if (response.ok) {
          const data = await response.json()
          setUserTier(data.tier || "free")
        }
      } catch (error) {
        console.error("Error fetching tier:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTier()
  }, [])

  // Hide upgrade link for admins and Pro/Pro+ users
  if (isAdmin || loading || userTier === "pro" || userTier === "pro_plus") {
    return null
  }

  return (
    <DropdownMenuItem asChild>
      <Link href="/upgrade" className="cursor-pointer">
        <Sparkles className="mr-2 h-4 w-4" />
        <span>Upgrade Membership</span>
      </Link>
    </DropdownMenuItem>
  )
}
