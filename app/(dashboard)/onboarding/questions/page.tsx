import { OnboardingQuestions } from "@/components/onboarding/onboarding-questions"

/** Showcase: onboarding questions (no auth required) */
export default function OnboardingQuestionsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-2xl">
        <OnboardingQuestions userId="showcase" />
      </div>
    </div>
  )
}
