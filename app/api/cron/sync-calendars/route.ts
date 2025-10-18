import { getUnprocessedEventUpdates, markEventUpdateProcessed } from "@/lib/db/queries"
import { NextResponse } from "next/server"

interface Rsvp {
  id: string
  calendarSyncEnabled: boolean
  status: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface User {
  id: string
  name: string | null
  email: string
}

interface Event {
  id: string
  title: string
  startTime: string | Date
  endTime: string | Date
  locationType?: string
  venueName?: string | null
  venueAddress?: string | null
  venueCity?: string | null
  venueState?: string | null
  venueZip?: string | null
}

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all unprocessed event updates
    const updates = await getUnprocessedEventUpdates()

    console.log(`Processing ${updates.length} event updates`)

    let processedCount = 0
    let errorCount = 0

    for (const update of updates) {
      try {
        const event = update.event
        
        if (!event) {
          console.error(`Event not found for update ${update.id}`)
          await markEventUpdateProcessed(update.id)
          errorCount++
          continue
        }

        // Get all RSVPs with calendar sync enabled
        const rsvpsToSync = event.rsvps?.filter(
          (rsvp: Rsvp) => rsvp.calendarSyncEnabled && rsvp.status === "confirmed"
        ) || []

        console.log(`Syncing calendar for ${rsvpsToSync.length} users for event ${event.id}`)

        // For each user with calendar sync enabled, send update notification
        for (const rsvp of rsvpsToSync) {
          try {
            // Here you would integrate with actual calendar APIs
            // For now, we'll send email notifications about the change
            
            await sendEventUpdateEmail({
              user: rsvp.user,
              event,
              changeType: update.changeType,
            })

            // Update the RSVP's last synced timestamp
            // await updateRsvp(rsvp.id, { lastSyncedAt: new Date() })
          } catch (error) {
            console.error(`Failed to sync calendar for user ${rsvp.user.id}:`, error)
            errorCount++
          }
        }

        // Mark update as processed
        await markEventUpdateProcessed(update.id)
        processedCount++
      } catch (error) {
        console.error(`Failed to process update ${update.id}:`, error)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      errors: errorCount,
      total: updates.length,
    })
  } catch (error: unknown) {
    console.error("Calendar sync cron error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sync calendars" },
      { status: 500 }
    )
  }
}

// Helper function to send event update emails
async function sendEventUpdateEmail({
  user,
  event,
  changeType,
}: {
  user: User
  event: Event
  changeType: string
}) {
  // This is a placeholder - you would integrate with your email service (e.g., Resend, SendGrid)
  console.log(`Sending update email to ${user.email} about ${changeType} change for event ${event.id}`)

  // let subject = ""
  // let message = ""

  switch (changeType) {
    case "time":
      // subject = `Event Time Changed: ${event.title}`
      // message = `The time for "${event.title}" has been updated.\n\nNew time: ${format(new Date((newValue as any).startTime as string), "MMMM d, yyyy 'at' h:mm a")}`
      break
    case "location":
      // subject = `Event Location Changed: ${event.title}`
      // message = `The location for "${event.title}" has been updated.\n\nNew location: ${(newValue as any).venueName as string || (newValue as any).virtualMeetingUrl as string}`
      break
    case "status":
      // subject = `Event Status Update: ${event.title}`
      // message = `The status of "${event.title}" has changed to: ${newValue}`
      break
    default:
      // subject = `Event Update: ${event.title}`
      // message = `Details for "${event.title}" have been updated. Please check your calendar for the latest information.`
      break
  }

  // TODO: Integrate with your email service
  // await sendEmail({
  //   to: user.email,
  //   subject,
  //   text: message,
  //   html: generateEmailHTML(message, event),
  // })

  return { sent: true }
}

