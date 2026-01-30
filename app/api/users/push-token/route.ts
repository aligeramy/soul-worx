import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * POST /api/users/push-token
 * Store push notification token for user
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin")
  return handleOptions(origin)
}

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
    const { userId, pushToken } = body

    if (!pushToken) {
      return addCorsHeaders(
        NextResponse.json({ error: "Push token is required" }, { status: 400 }),
        origin
      )
    }

    // Verify user matches session
    if (userId !== session.user.id) {
      return addCorsHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
        origin
      )
    }

    // Update user with push token
    await db
      .update(users)
      .set({
        pushToken: pushToken,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    return addCorsHeaders(
      NextResponse.json({ success: true }),
      origin
    )
  } catch (error: unknown) {
    console.error("Error saving push token:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to save push token"
    return addCorsHeaders(
      NextResponse.json({ error: errorMessage }, { status: 500 }),
      origin
    )
  }
}
