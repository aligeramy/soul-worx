import { ProPlusQuestionnaireForm } from "@/components/onboarding/pro-plus-questionnaire-form"

/** Showcase: Pro+ questionnaire (no auth required) */
export default async function ProPlusQuestionnairePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; session_id?: string; from?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl">
        {params.success === "true" && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-900 font-semibold">Payment successful!</p>
                <p className="text-green-700 text-sm">Complete your questionnaire to get started with personalized programs.</p>
              </div>
            </div>
          </div>
        )}
        <ProPlusQuestionnaireForm userId="showcase" fromDashboard={params.from === "dashboard"} />
      </div>
    </div>
  )
}
