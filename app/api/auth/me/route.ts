import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

/**
 * GET /api/auth/me
 * Get current user from JWT token (for mobile app)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET

    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
      type: string
    }

    if (decoded.type !== "mobile_access") {
      return NextResponse.json({ error: "Invalid token type" }, { status: 401 })
    }

    // Return user data (you can fetch from database if needed)
    return NextResponse.json({
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    console.error("Error verifying token:", error)
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    )
  }
}
