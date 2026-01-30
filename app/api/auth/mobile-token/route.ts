import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import jwt from "jsonwebtoken"

/**
 * POST /api/auth/mobile-token
 * Generate a JWT token for mobile app authentication
 * Called after user successfully authenticates on web
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Generate access token (expires in 7 days)
    const accessToken = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
        type: "mobile_access",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Generate refresh token (expires in 30 days)
    const refreshToken = jwt.sign(
      {
        userId: session.user.id,
        type: "mobile_refresh",
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    )

    // Fetch full user data from database if needed
    const { db } = await import("@/lib/db")
    const { users } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    })

    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      user: user || {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
      },
    })
  } catch (error) {
    console.error("Error generating mobile token:", error)
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    )
  }
}
