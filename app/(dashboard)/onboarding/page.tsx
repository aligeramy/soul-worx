import { redirect } from "next/navigation"

/**
 * Onboarding entry - showcase mode: always show interest selection.
 * Navigate directly to /onboarding/interest to view the flow.
 */
export default function OnboardingPage() {
  redirect("/onboarding/interest")
}

