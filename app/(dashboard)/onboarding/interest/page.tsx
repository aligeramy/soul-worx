import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { InterestSelection } from "@/components/onboarding/interest-selection"

export default async function OnboardingInterestPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  // If already completed onboarding, redirect to dashboard
  // We'll check this in the component after fetching user data

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="w-full max-w-4xl">
        <InterestSelection userId={session.user.id} />
      </div>
    </div>
  )
}
