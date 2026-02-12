import { Resend } from "resend"
import { render } from "@react-email/render"
import { EventTicketEmail } from "@/emails/event-ticket-email"

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.EMAIL_FROM || "noreply@soulworx.com"

export async function sendEventTicketEmail({
  to,
  eventTitle,
  dateLabel,
  venueAddress,
  purchaserName,
  amountPaid,
  ticketImageUrl,
}: {
  to: string
  eventTitle: string
  dateLabel: string
  venueAddress: string
  purchaserName?: string
  amountPaid: string
  ticketImageUrl: string
}) {
  const html = await render(
    EventTicketEmail({
      eventTitle,
      dateLabel,
      venueAddress,
      purchaserName,
      amountPaid,
      ticketImageUrl,
    })
  )
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Your ticket: ${eventTitle}`,
    html,
  })
  if (error) {
    console.error("Resend error:", error)
    throw new Error(error.message)
  }
}
