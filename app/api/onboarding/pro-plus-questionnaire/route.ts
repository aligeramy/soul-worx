import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users, proPlusQuestionnaires } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { addCorsHeaders, handleOptions } from "@/lib/cors"

/**
 * POST /api/onboarding/pro-plus-questionnaire
 * Save Pro+ questionnaire answers
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
    const {
      age,
      skillLevel,
      gameDescription,
      position,
      yearsPlaying,
      currentGoalsYearly,
      currentGoalsOverall,
      improvementRankings,
      weight,
      height,
      currentInjuries,
      seeingPhysiotherapy,
      weightTrains,
      stretches,
      currentTeam,
      outsideSchoolTeams,
      inSeason,
      basketballWatching,
      equipmentAccess,
      trainingDays,
      averageSessionLength,
      biggestStruggle,
      confidenceLevel,
      mentalChallenge,
      mentalChallengeOther,
      coachability,
      preferredCoachingStyle,
      coachingStyleOther,
      gameFilmUrl,
      workoutVideos,
    } = body

    // Check if user is Pro+
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        memberships: {
          with: {
            tier: true,
          },
        },
      },
    })

    const userTier = user?.memberships?.[0]?.tier?.level
    if (userTier !== "pro_plus") {
      return NextResponse.json(
        { error: "Only Pro+ users can complete this questionnaire" },
        { status: 403 }
      )
    }

    // Check if questionnaire already exists
    const existing = await db.query.proPlusQuestionnaires.findFirst({
      where: eq(proPlusQuestionnaires.userId, session.user.id),
    })

    const questionnaireData = {
      userId: session.user.id,
      age: age ? parseInt(age) : null,
      skillLevel: skillLevel || null,
      gameDescription: gameDescription || null,
      position: position || null,
      yearsPlaying: yearsPlaying || null,
      currentGoalsYearly: currentGoalsYearly || null,
      currentGoalsOverall: currentGoalsOverall || null,
      improvementRankings: improvementRankings || null,
      weight: weight ? weight.toString() : null,
      height: height || null,
      currentInjuries: currentInjuries || null,
      seeingPhysiotherapy: seeingPhysiotherapy || false,
      weightTrains: weightTrains || false,
      stretches: stretches || false,
      currentTeam: currentTeam || null,
      outsideSchoolTeams: outsideSchoolTeams || null,
      inSeason: inSeason || false,
      basketballWatching: basketballWatching || null,
      equipmentAccess: equipmentAccess || null,
      trainingDays: trainingDays || null,
      averageSessionLength: averageSessionLength ? parseInt(averageSessionLength) : null,
      biggestStruggle: biggestStruggle || null,
      confidenceLevel: confidenceLevel ? parseInt(confidenceLevel) : null,
      mentalChallenge: mentalChallenge || null,
      mentalChallengeOther: mentalChallengeOther || null,
      coachability: coachability ? parseInt(coachability) : null,
      preferredCoachingStyle: preferredCoachingStyle || null,
      coachingStyleOther: coachingStyleOther || null,
      gameFilmUrl: gameFilmUrl || null,
      workoutVideos: workoutVideos || null,
      completedAt: new Date(),
      updatedAt: new Date(),
    }

    if (existing) {
      // Update existing
      await db
        .update(proPlusQuestionnaires)
        .set(questionnaireData)
        .where(eq(proPlusQuestionnaires.userId, session.user.id))
    } else {
      // Create new
      await db.insert(proPlusQuestionnaires).values(questionnaireData)
    }

    // Update user onboarding data
    const onboardingData = (user?.onboardingData as Record<string, unknown>) || {}
    await db
      .update(users)
      .set({
        onboardingData: {
          ...onboardingData,
          questionnaireCompleted: true,
          step: "questionnaire",
        },
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    return addCorsHeaders(
      NextResponse.json({ success: true }),
      origin
    )
  } catch (error) {
    console.error("Error saving questionnaire:", error)
    return addCorsHeaders(
      NextResponse.json(
        { error: "Failed to save questionnaire" },
        { status: 500 }
      ),
      origin
    )
  }
}
