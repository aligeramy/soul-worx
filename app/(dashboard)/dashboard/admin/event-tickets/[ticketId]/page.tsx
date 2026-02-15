import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { getEventTicketById } from "@/lib/db/queries"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { format } from "date-fns"
import { MapPin, Ticket, ArrowLeft, User, Mail, DollarSign, Calendar } from "lucide-react"
import QRCode from "qrcode"

export default async function AdminEventTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const { ticketId } = await params
  const ticket = await getEventTicketById(ticketId)
  if (!ticket || !ticket.ticketedEvent) {
    notFound()
  }

  const event = ticket.ticketedEvent
  const qrDataUrl = await QRCode.toDataURL(ticket.qrCodeData, {
    width: 220,
    margin: 2,
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/event-tickets"
          className="text-white/60 hover:text-white flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event Tickets
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Ticket Details</h1>
        <p className="text-white/60 mt-1">Order and attendee information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Person details & order info */}
        <div className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Attendee
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/50">Name</dt>
                  <dd className="text-white font-medium">{ticket.purchaserName || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/50">Email</dt>
                  <dd className="text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-white/50" />
                    {ticket.purchaserEmail}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/50">Amount paid</dt>
                  <dd className="text-white font-medium">${(ticket.amountPaidCents / 100).toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/50">Purchased</dt>
                  <dd className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white/50" />
                    {format(ticket.createdAt, "PPp")}
                  </dd>
                </div>
                {ticket.stripeSessionId && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-white/50">Stripe session</dt>
                    <dd className="text-white/70 font-mono text-xs break-all">{ticket.stripeSessionId}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right: Event info, QR, ticket image */}
        <div className="space-y-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Event
              </h2>
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
              <p className="text-white/80 mt-1">{event.dateLabel}</p>
              <p className="text-white/60 text-sm flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4 shrink-0" />
                {event.venueAddress}
              </p>
              {(event.doorsOpenAt || event.performanceAt) && (
                <p className="text-white/50 text-sm mt-1">
                  Doors {event.doorsOpenAt || "—"} · Performances {event.performanceAt || "—"}
                </p>
              )}
              <Link
                href={`/events/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-white/70 hover:text-white underline"
              >
                View public event page →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">QR Code</h2>
              <p className="text-white/50 text-sm mb-4">Scan for verification at the door</p>
              <div className="inline-block rounded-lg border border-white/20 bg-white/5 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Ticket QR code" className="w-[220px] h-[220px]" />
              </div>
            </CardContent>
          </Card>

          {ticket.ticketImageUrl && (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Ticket image</h2>
                <a
                  href={ticket.ticketImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ticket.ticketImageUrl}
                    alt="Ticket"
                    className="w-full max-w-sm rounded-lg border border-white/20 object-cover"
                  />
                </a>
                <a
                  href={ticket.ticketImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-white/70 hover:text-white underline"
                >
                  Open full size →
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
