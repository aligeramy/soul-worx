import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * POST /api/onboarding/interest
 * Save user's primary interest selection
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return addCorsHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        origin
      )
    }

    const body = await request.json()
    const { interest } = body

    // Validate interest
    const validInterests = ["sports_basketball", "poetry_arts", "life_coaching"]
    if (!interest || !validInterests.includes(interest)) {
      return addCorsHeaders(
        NextResponse.json(
          { error: "Invalid interest selection" },
          { status: 400 }
        ),
        origin
      )
    }

    // Update user
    await db
      .update(users)
      .set({
        primaryInterest: interest,
        onboardingData: {
          interest,
          step: "interest",
          completedAt: new Date().toISOString(),
        },
      })
      .where(eq(users.id, session.user.id))

    return addCorsHeaders(
      NextResponse.json({ success: true }),
      origin
    )
  } catch (error) {
    console.error("Error saving interest:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to save interest" },
        { status: 500 }
      ),
      origin
    )
  }
}
