import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { OnboardingQuestions } from "@/components/onboarding/onboarding-questions"

export default async function OnboardingQuestionsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="w-full max-w-2xl">
        <OnboardingQuestions userId={session.user.id} />
      </div>
    </div>
  )
}
