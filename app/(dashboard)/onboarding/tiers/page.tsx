import { TierSelection } from "@/components/onboarding/tier-selection"

/** Showcase: onboarding tier selection (no auth required) */
export default function OnboardingTiersPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-3 bg-white">
      <div className="w-full max-w-5xl">
        <TierSelection userId="showcase" />
      </div>
    </div>
  )
}
