import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { hashPassword } from "@/lib/auth/password"
import { eq } from "drizzle-orm"

/**
 * POST /api/auth/signup
 * Create a new user account with email/password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, username } = body
    let { email, password } = body

    // Normalize email (case-insensitive - prevents duplicate accounts)
    email = (email || "").trim().toLowerCase()
    password = (password || "").trim()

    // Validation
    if (!email || !name || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password (min 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
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
        { error: "Username must be 3-20 alphanumeric characters" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Check if username already exists
    const existingUsername = await db.query.users.findFirst({
      where: eq(users.username, normalizedUsername),
    })
    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        username: normalizedUsername,
        password: hashedPassword,
        onboardingCompleted: false,
        role: "user",
      })
      .returning()

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Account created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
