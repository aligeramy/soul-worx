import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { OnboardingQuestions } from "@/components/onboarding/onboarding-questions"

export default async function OnboardingQuestionsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  if (isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        <OnboardingQuestions userId={session.user.id} />
      </div>
    </div>
  )
}
