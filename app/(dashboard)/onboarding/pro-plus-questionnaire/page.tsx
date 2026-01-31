import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProPlusQuestionnaireForm } from "@/components/onboarding/pro-plus-questionnaire-form"
import { db } from "@/lib/db"
import { userMemberships, membershipTiers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export default async function ProPlusQuestionnairePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; session_id?: string; from?: string }>
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  if (isAdmin) {
    redirect("/dashboard")
  }

  const params = await searchParams

  // If coming from successful checkout, process it immediately
  if (params.success === 'true' && params.session_id) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/community/checkout-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: params.session_id }),
      })
    } catch (error) {
      console.error('Error processing checkout:', error)
    }
  }

  // Verify user is Pro+
  const membership = await db.query.userMemberships.findFirst({
    where: and(
      eq(userMemberships.userId, session.user.id),
      eq(userMemberships.status, "active")
    ),
    with: {
      tier: true,
    },
  })

  const isProPlus = membership?.tier?.slug === "pro-plus" || membership?.tier?.slug === "pro_plus"
  
  if (!isProPlus) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl">
        {params.success === 'true' && (
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
        <ProPlusQuestionnaireForm userId={session.user.id} fromDashboard={params.from === "dashboard"} />
      </div>
    </div>
  )
}
