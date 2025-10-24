import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  // Onboarding is no longer required - redirect everyone to dashboard
  // Users can update their profile in settings if they want
  redirect("/dashboard")
}

