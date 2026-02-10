import { InterestSelection } from "@/components/onboarding/interest-selection"

/** Showcase: onboarding interest selection (no auth required) */
export default function OnboardingInterestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl">
        <InterestSelection userId="showcase" />
      </div>
    </div>
  )
}
