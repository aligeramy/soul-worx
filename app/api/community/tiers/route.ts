import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { membershipTiers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * GET /api/community/tiers
 * Get all active membership tiers
 */
export async function GET() {
  try {
    const tiers = await db.query.membershipTiers.findMany({
      where: eq(membershipTiers.isActive, true),
      orderBy: (tiers, { asc }) => [asc(tiers.sortOrder)],
    })

    return NextResponse.json(tiers)
  } catch (error) {
    console.error("Error fetching tiers:", error)
    return NextResponse.json(
      { error: "Failed to fetch tiers" },
      { status: 500 }
    )
  }
}

