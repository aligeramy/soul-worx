"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SubscribeButtonProps {
  tierId: string
  tierName?: string
  isCurrentPlan?: boolean
  isFree?: boolean
  hasExistingMembership?: boolean
}

export function SubscribeButton({
  tierId,
  tierName,
  isCurrentPlan = false,
  isFree = false,
  hasExistingMembership = false,
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (isFree) return
    
    setLoading(true)
    try {
      const response = await fetch("/api/community/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error: unknown) {
      console.error("Subscription error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to start subscription. Please try again."
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  if (isCurrentPlan) {
    return (
      <Button className="w-full" disabled>
        Current Plan
      </Button>
    )
  }

  if (isFree) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Default Tier
      </Button>
    )
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className="w-full"
    >
      {loading
        ? "Loading..."
        : hasExistingMembership
        ? "Upgrade"
        : "Get Started"}
    </Button>
  )
}

