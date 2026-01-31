import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { TierSelection } from "@/components/onboarding/tier-selection"

export default async function OnboardingTiersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  if (isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-3 bg-white">
      <div className="w-full max-w-5xl">
        <TierSelection userId={session.user.id} />
      </div>
    </div>
  )
}
