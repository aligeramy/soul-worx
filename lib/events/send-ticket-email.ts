import { Resend } from "resend"
import { render } from "@react-email/render"
import { EventTicketEmail } from "@/emails/event-ticket-email"

const apiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.EMAIL_FROM || "noreply@soulworx.com"
const from = `Soulworx Events <${fromEmail}>`
const resend = apiKey ? new Resend(apiKey) : null

export async function sendEventTicketEmail({
  to,
  eventTitle,
  dateLabel,
  venueAddress,
  purchaserName,
  amountPaid,
  ticketImageUrl = "",
  qrCodeDataUrl,
}: {
  to: string
  eventTitle: string
  dateLabel: string
  venueAddress: string
  purchaserName?: string
  amountPaid: string
  ticketImageUrl?: string
  qrCodeDataUrl?: string
}) {
  if (!resend) {
    console.error("RESEND_API_KEY is not set — ticket email not sent to", to)
    return null
  }

  const html = await render(
    EventTicketEmail({
      eventTitle,
      dateLabel,
      venueAddress,
      purchaserName,
      amountPaid,
      ticketImageUrl,
      qrCodeDataUrl,
    })
  )

  const { data, error } = await resend.emails.send({
    from,
    to: to.trim(),
    subject: `Your ticket: ${eventTitle}`,
    html,
  })

  if (error) {
    console.error("Resend error sending ticket email:", error)
    throw new Error(error.message)
  }
  return data
}
