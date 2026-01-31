import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  // Admins skip onboarding entirely
  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  if (isAdmin) {
    redirect("/dashboard")
  }

  // Check if user has completed onboarding
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      onboardingCompleted: true,
      primaryInterest: true,
      onboardingData: true,
    },
  })

  // If completed, redirect to dashboard
  if (user?.onboardingCompleted) {
    redirect("/dashboard")
  }

  // If no primary interest selected, start with interest selection
  if (!user?.primaryInterest) {
    redirect("/onboarding/interest")
  }

  // If has interest but not completed, check which step they're on
      const onboardingData = (user?.onboardingData as Record<string, unknown> | undefined) || {}
  const step = onboardingData?.step

  if (step === "interest") {
    redirect("/onboarding/questions")
  } else if (step === "questions") {
    // Check if basketball - if so, go to tiers, otherwise complete
    if (user.primaryInterest === "sports_basketball") {
      redirect("/onboarding/tiers")
    } else {
      redirect("/dashboard")
    }
  } else if (step === "tier") {
    // Check if Pro+ - if so, go to questionnaire
    const tier = onboardingData?.tier
    if (tier === "pro_plus") {
      // Check if questionnaire is completed
      const questionnaireCompleted = onboardingData?.questionnaireCompleted
      if (questionnaireCompleted) {
        // Check if call is booked
        const callBooked = onboardingData?.callBooked
        if (callBooked) {
          redirect("/dashboard")
        } else {
          redirect("/onboarding/book-call")
        }
      } else {
        redirect("/onboarding/pro-plus-questionnaire")
      }
    } else {
      redirect("/dashboard")
    }
  }

  // Default: start at interest selection
  redirect("/onboarding/interest")
}

