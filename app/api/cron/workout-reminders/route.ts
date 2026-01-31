import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, personalizedPrograms, programChecklistItems } from "@/lib/db/schema"
import { eq, and, gte, lte } from "drizzle-orm"
import { startOfDay, endOfDay } from "date-fns"

/**
 * GET /api/cron/workout-reminders
 * Scheduled job to send push notifications for workouts due today
 * Runs daily at 8am (configured in vercel.json)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    // Find all checklist items due today that are not completed
    const dueItems = await db
      .select({
        itemId: programChecklistItems.id,
        dueDate: programChecklistItems.dueDate,
        programId: programChecklistItems.programId,
        userId: personalizedPrograms.userId,
        programTitle: personalizedPrograms.title,
        pushToken: users.pushToken,
      })
      .from(programChecklistItems)
      .innerJoin(personalizedPrograms, eq(programChecklistItems.programId, personalizedPrograms.id))
      .innerJoin(users, eq(personalizedPrograms.userId, users.id))
      .where(
        and(
          gte(programChecklistItems.dueDate, todayStart),
          lte(programChecklistItems.dueDate, todayEnd),
          eq(programChecklistItems.completed, false),
          eq(personalizedPrograms.status, "active")
        )
      )

    console.log(`Found ${dueItems.length} workouts due today`)

    let sentCount = 0
    let errorCount = 0

    // Group by user to send one notification per user with all their workouts
    const userWorkouts = new Map<string, Array<{ title: string; itemId: string }>>()

    for (const item of dueItems) {
      if (!item.pushToken) continue

      if (!userWorkouts.has(item.userId)) {
        userWorkouts.set(item.userId, [])
      }
      userWorkouts.get(item.userId)!.push({
        title: item.programTitle,
        itemId: item.itemId,
      })
    }

    // Send notifications
    for (const [userId, workouts] of userWorkouts.entries()) {
      const item = dueItems.find((i) => i.userId === userId)
      if (!item?.pushToken) continue

      try {
        const workoutTitles = workouts.map((w) => w.title).join(", ")
        const message =
          workouts.length === 1
            ? `You have a workout due today: ${workoutTitles}`
            : `You have ${workouts.length} workouts due today: ${workoutTitles}`

        // Send push notification via Expo
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: item.pushToken,
            sound: "default",
            title: "Workout Reminder",
            body: message,
            data: {
              type: "workout_reminder",
              programId: item.programId,
              itemId: workouts[0].itemId,
              deepLink: `soulworx://personalized-programs/${item.programId}`,
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to send notification: ${response.statusText}`)
        }

        sentCount++
        console.log(`Sent notification to user ${userId}`)
      } catch (error) {
        console.error(`Failed to send notification to user ${userId}:`, error)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      dueItems: dueItems.length,
      usersNotified: sentCount,
      errors: errorCount,
    })
  } catch (error) {
    console.error("Error in workout reminders cron:", error)
    return NextResponse.json(
      { error: "Failed to process workout reminders" },
      { status: 500 }
    )
  }
}
