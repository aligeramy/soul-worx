"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Client component that checks if onboarding was just completed
 * If so, redirects to dashboard to prevent onboarding loop
 */
export function OnboardingCheck() {
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding was just completed
    const onboardingComplete = sessionStorage.getItem("onboarding_complete")
    
    if (onboardingComplete === "true") {
      // Clear the flag
      sessionStorage.removeItem("onboarding_complete")
      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    }
  }, [router])

  return null
}

