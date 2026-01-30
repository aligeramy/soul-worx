import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * POST /api/onboarding/questions
 * Save user's onboarding questions answers
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { age, goals } = body

    // Get current user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update onboarding data
    const currentOnboardingData = (user.onboardingData as Record<string, unknown>) || {}
    const updatedOnboardingData = {
      ...currentOnboardingData,
      age: age || null,
      goals: goals || null,
      step: "questions",
      questionsCompletedAt: new Date().toISOString(),
    }

    // Update user
    await db
      .update(users)
      .set({
        age: age ? parseInt(age) : null,
        onboardingData: updatedOnboardingData,
      })
      .where(eq(users.id, session.user.id))

    return addCorsHeaders(
      NextResponse.json({ success: true }),
      origin
    )
  } catch (error) {
    console.error("Error saving questions:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to save answers" },
        { status: 500 }
      ),
      origin
    )
  }
}
