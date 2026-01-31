import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { getUserTier } from "@/lib/db/queries"

/**
 * GET /api/user/tier
 * Get current user's tier
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tier = await getUserTier(session.user.id)
    
    return NextResponse.json({ tier })
  } catch (error) {
    console.error("Error fetching user tier:", error)
    return NextResponse.json(
      { error: "Failed to fetch tier" },
      { status: 500 }
    )
  }
}
