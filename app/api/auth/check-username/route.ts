import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * GET /api/auth/check-username?username=@username
 * Check if a username is available
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    // Normalize username: remove @ if present, then add it
    const normalizedUsername = username.startsWith("@") 
      ? username 
      : `@${username}`

    // Validate username format (3-20 alphanumeric characters after @)
    const usernameRegex = /^@[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(normalizedUsername)) {
      return NextResponse.json(
        { available: false, error: "Username must be 3-20 alphanumeric characters" },
        { status: 400 }
      )
    }

    // Check if username exists
    const existing = await db.query.users.findFirst({
      where: eq(users.username, normalizedUsername),
    })

    return NextResponse.json({
      available: !existing,
      username: normalizedUsername,
    })
  } catch (error) {
    console.error("Check username error:", error)
    return NextResponse.json(
      { error: "Failed to check username" },
      { status: 500 }
    )
  }
}
