import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { TierSelection } from "@/components/onboarding/tier-selection"

export default async function OnboardingTiersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="w-full max-w-5xl">
        <TierSelection userId={session.user.id} />
      </div>
    </div>
  )
}
