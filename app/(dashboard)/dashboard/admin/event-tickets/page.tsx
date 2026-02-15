import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAllTicketedEventsForAdmin } from "@/lib/db/queries"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"
import { MapPin, Ticket, ExternalLink } from "lucide-react"
import { RegenerateTicketButton, RegenerateAllForEventButton } from "./regenerate-ticket-button"
import { TicketRow } from "./ticket-row"
import { StopPropagation } from "./stop-propagation"

function formatTicketDate(value: unknown): string {
  if (value == null) return "—"
  const d = value instanceof Date ? value : new Date(value as string | number)
  return Number.isNaN(d.getTime()) ? "—" : format(d, "MMM d, yyyy HH:mm")
}

export default async function AdminEventTicketsPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const events = await getAllTicketedEventsForAdmin()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white">Event Tickets</h1>
        <p className="text-white/60 mt-1">Ticketed events and who bought tickets (with QRs)</p>
      </div>

      {events.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="text-center py-16">
            <Ticket className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No ticketed events yet</h3>
            <p className="text-white/60">Add a ticketed event and run the seed script, or create one via the app.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {events.map((event) => (
            <Card key={event.id} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{event.title}</h2>
                    <p className="text-white/60 text-sm mt-1">{event.dateLabel}</p>
                    <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {event.venueAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RegenerateAllForEventButton
                      eventId={event.id}
                      count={event.tickets.filter((t) => !t.ticketImageUrl).length}
                    />
                    <Badge variant="outline" className="border-white/20 text-white/80">
                      Min ${event.minPriceCents / 100}
                    </Badge>
                    <Link
                      href={`/events/${event.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View page
                    </Link>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                  Tickets sold ({event.tickets.length})
                </h3>
                {event.tickets.length === 0 ? (
                  <p className="text-white/50 text-sm">No tickets purchased yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-2 text-white/60 font-medium">Date</th>
                          <th className="text-left py-3 px-2 text-white/60 font-medium">Name / Email</th>
                          <th className="text-left py-3 px-2 text-white/60 font-medium">Amount</th>
                          <th className="text-left py-3 px-2 text-white/60 font-medium">QR / Ticket</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {event.tickets.map((t) => (
                          <TicketRow key={t.id} ticketId={t.id}>
                            <td className="py-3 px-2 text-white/70">
                              {formatTicketDate(t.createdAt)}
                            </td>
                            <td className="py-3 px-2">
                              <div className="font-medium text-white">{t.purchaserName || "—"}</div>
                              <div className="text-white/50 text-xs">{t.purchaserEmail}</div>
                            </td>
                            <td className="py-3 px-2 text-white/70">
                              ${(t.amountPaidCents / 100).toFixed(2)}
                            </td>
                            <td className="py-3 px-2">
                              <StopPropagation>
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`/api/admin/event-tickets/qr?ticketId=${encodeURIComponent(t.id)}`}
                                    alt="QR code"
                                    width={64}
                                    height={64}
                                    className="h-16 w-16 rounded border border-white/20 bg-white object-contain"
                                  />
                                  {t.ticketImageUrl ? (
                                    <a
                                      href={t.ticketImageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white/50 hover:text-white text-xs"
                                    >
                                      Ticket
                                    </a>
                                  ) : (
                                    <div className="flex flex-col items-start gap-1">
                                      <span className="text-white/40 text-xs">Image processing…</span>
                                      <RegenerateTicketButton ticketId={t.id} />
                                    </div>
                                  )}
                                </div>
                              </StopPropagation>
                            </td>
                          </TicketRow>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
