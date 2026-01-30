/**
 * Google Calendar & Meet Integration
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console: https://console.cloud.google.com/
 * 2. Create or select a project
 * 3. Enable Google Calendar API
 * 4. Create a Service Account:
 *    - Go to IAM & Admin > Service Accounts
 *    - Create Service Account
 *    - Grant "Calendar Admin" role
 * 5. Generate JSON key and download
 * 6. Share your calendar with the service account email:
 *    - Open Google Calendar
 *    - Settings > Share with specific people
 *    - Add service account email with "Make changes to events" permission
 * 7. Add to .env:
 *    GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
 *    GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY={"type":"service_account",...} (full JSON as string)
 *    GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
 */

import { google } from "googleapis"
import { JWT } from "google-auth-library"

let calendarClient: ReturnType<typeof google.calendar> | null = null

/**
 * Initialize Google Calendar client
 */
function getCalendarClient() {
  if (calendarClient) {
    return calendarClient
  }

  const serviceAccountEmail = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL
  const serviceAccountKey = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  if (!serviceAccountEmail || !serviceAccountKey || !calendarId) {
    throw new Error(
      "Google Calendar credentials not configured. Please set GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL, GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY, and GOOGLE_CALENDAR_ID in .env"
    )
  }

  // Parse service account key (can be JSON string or file path)
  let keyData: { client_email: string; private_key: string }
  try {
    keyData = JSON.parse(serviceAccountKey) as { client_email: string; private_key: string }
  } catch {
    // If parsing fails, assume it's a file path (not implemented yet)
    throw new Error("GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY must be a valid JSON string")
  }

  // Create JWT client
  const jwtClient = new JWT({
    email: serviceAccountEmail,
    key: keyData.private_key,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  })

  // Create Calendar API client
  calendarClient = google.calendar({ version: "v3", auth: jwtClient })

  return calendarClient
}

/**
 * Create a calendar event with Google Meet link
 */
export async function createCalendarEvent(params: {
  summary: string
  description?: string
  startTime: Date
  endTime: Date
  attendeeEmail?: string
  attendeeName?: string
}) {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const event = {
    summary: params.summary,
    description: params.description || "",
    start: {
      dateTime: params.startTime.toISOString(),
      timeZone: "America/New_York", // TODO: Make timezone configurable
    },
    end: {
      dateTime: params.endTime.toISOString(),
      timeZone: "America/New_York",
    },
    conferenceData: {
      createRequest: {
        requestId: `coach-call-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    attendees: params.attendeeEmail
      ? [
          {
            email: params.attendeeEmail,
            displayName: params.attendeeName,
          },
        ]
      : [],
  }

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
    conferenceDataVersion: 1,
  })

  return {
    eventId: response.data.id!,
    meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
    htmlLink: response.data.htmlLink || null,
  }
}

/**
 * Check if a date/time is available (not already booked)
 */
export async function checkAvailability(date: Date): Promise<boolean> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  // Check if there's already an event on this date
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
  })

  // If there are any events, the date is booked
  return (response.data.items?.length || 0) === 0
}

/**
 * Get all booked dates
 */
export async function listBookedDates(startDate: Date, endDate: Date): Promise<Date[]> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const response = await calendar.events.list({
    calendarId,
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
    singleEvents: true,
  })

  const bookedDates = (response.data.items || []).map((event) => {
    const start = event.start?.dateTime || event.start?.date
    return start ? new Date(start) : null
  }).filter((date): date is Date => date !== null)

  // Extract unique dates (one booking per day)
  const uniqueDates = new Set(
    bookedDates.map((date) => {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      return d.toISOString()
    })
  )

  return Array.from(uniqueDates).map((iso) => new Date(iso))
}

/**
 * Cancel a calendar event
 */
export async function cancelEvent(eventId: string) {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  await calendar.events.delete({
    calendarId,
    eventId,
  })
}

/**
 * Get event details
 */
export async function getEvent(eventId: string) {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const response = await calendar.events.get({
    calendarId,
    eventId,
  })

  return {
    id: response.data.id,
    summary: response.data.summary,
    start: response.data.start?.dateTime || response.data.start?.date,
    end: response.data.end?.dateTime || response.data.end?.date,
    meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null,
    htmlLink: response.data.htmlLink || null,
  }
}
