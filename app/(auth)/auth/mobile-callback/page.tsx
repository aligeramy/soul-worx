"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function MobileCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scheme = searchParams?.get("scheme") || "soulworx"

  useEffect(() => {
    async function handleMobileCallback() {
      try {
        // Get mobile token
        const response = await fetch("/api/auth/mobile-token", {
          method: "POST",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to get token")
        }

        const tokenData = await response.json()

        // Redirect to app via deep link
        const deepLink = `${scheme}://auth?token=${encodeURIComponent(tokenData.accessToken)}&refreshToken=${encodeURIComponent(tokenData.refreshToken)}`
        window.location.href = deepLink
      } catch (error) {
        console.error("Error handling mobile callback:", error)
        // Fallback: redirect to dashboard
        router.push("/dashboard")
      }
    }

    handleMobileCallback()
  }, [scheme, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Redirecting to app...</p>
      </div>
    </div>
  )
}
