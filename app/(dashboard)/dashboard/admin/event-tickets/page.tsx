import { auth } from "@/auth"
import { redirect } from "next/navigation"
import {
  getTicketedEventsForAdminPaginated,
  getTicketedEventsForAdminCount,
} from "@/lib/db/queries"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { MapPin, Ticket, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { RegenerateTicketButton, RegenerateAllForEventButton } from "./regenerate-ticket-button"
import { TicketRow } from "./ticket-row"
import { StopPropagation } from "./stop-propagation"

const PER_PAGE_OPTIONS = [5, 10, 50, 100] as const
const DEFAULT_PER_PAGE = 5

function getTicketDate(t: { createdAt?: unknown; created_at?: unknown }): Date | null {
  const raw = t.createdAt ?? (t as { created_at?: unknown }).created_at
  if (raw == null) return null
  const d = raw instanceof Date ? raw : new Date(String(raw))
  return Number.isNaN(d.getTime()) ? null : d
}

function formatTicketDate(t: { createdAt?: unknown; created_at?: unknown }): string {
  const d = getTicketDate(t)
  return d ? format(d, "PPp") : "—"
}

function parsePerPage(value: string | undefined): number {
  const n = parseInt(value ?? "", 10)
  return PER_PAGE_OPTIONS.includes(n as (typeof PER_PAGE_OPTIONS)[number])
    ? n
    : DEFAULT_PER_PAGE
}

export default async function AdminEventTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; perPage?: string }>
}) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    redirect("/signin")
  }

  const params = await searchParams
  const perPage = parsePerPage(params.perPage)
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1)
  const [events, totalCount] = await Promise.all([
    getTicketedEventsForAdminPaginated(page, perPage),
    getTicketedEventsForAdminCount(),
  ])
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const currentPage = Math.min(page, totalPages)

  function paginationUrl(opts: { page?: number; perPage?: number }) {
    const p = opts.page ?? currentPage
    const pp = opts.perPage ?? perPage
    const search = new URLSearchParams()
    if (p > 1) search.set("page", String(p))
    if (pp !== DEFAULT_PER_PAGE) search.set("perPage", String(pp))
    const q = search.toString()
    return `/dashboard/admin/event-tickets${q ? `?${q}` : ""}`
  }

  // Sort tickets by purchase date (newest first) in case relation didn't
  const eventsWithSortedTickets = events.map((event) => ({
    ...event,
    tickets: [...event.tickets].sort((a, b) => {
      const da = getTicketDate(a)?.getTime() ?? 0
      const db = getTicketDate(b)?.getTime() ?? 0
      return db - da
    }),
  }))

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
        <>
          <div className="space-y-5">
            {eventsWithSortedTickets.map((event) => (
              <Card key={event.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">{event.title}</h2>
                      <p className="text-white/60 text-xs mt-0.5">{event.dateLabel}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {event.venueAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RegenerateAllForEventButton
                        eventId={event.id}
                        count={event.tickets.filter((t) => !t.ticketImageUrl).length}
                      />
                      <Badge variant="outline" className="border-white/20 text-white/80 text-xs">
                        Min ${event.minPriceCents / 100}
                      </Badge>
                      <Link
                        href={`/events/${event.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View page
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    Tickets sold ({event.tickets.length})
                  </h3>
                  {event.tickets.length === 0 ? (
                    <p className="text-white/50 text-xs">No tickets purchased yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-1.5 px-1.5 text-white/60 font-medium">Date</th>
                            <th className="text-left py-1.5 px-1.5 text-white/60 font-medium">Name / Email</th>
                            <th className="text-left py-1.5 px-1.5 text-white/60 font-medium">Amount</th>
                            <th className="text-left py-1.5 px-1.5 text-white/60 font-medium">QR / Ticket</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {event.tickets.map((t) => (
                            <TicketRow key={t.id} ticketId={t.id}>
                              <td className="py-1.5 px-1.5 text-white/70 whitespace-nowrap">
                                {formatTicketDate(t)}
                              </td>
                              <td className="py-1.5 px-1.5">
                                <div className="font-medium text-white">{t.purchaserName || "—"}</div>
                                <div className="text-white/50">{t.purchaserEmail}</div>
                              </td>
                              <td className="py-1.5 px-1.5 text-white/70">
                                ${(t.amountPaidCents / 100).toFixed(2)}
                              </td>
                              <td className="py-1.5 px-1.5">
                                <StopPropagation>
                                  <div className="flex items-center gap-1.5">
                                    <img
                                      src={`/api/admin/event-tickets/qr?ticketId=${encodeURIComponent(t.id)}`}
                                      alt="QR code"
                                      width={48}
                                      height={48}
                                      className="h-12 w-12 rounded border border-white/20 bg-white object-contain"
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
                                      <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-white/40 text-xs">Processing…</span>
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

          {events.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-white/60 text-sm">
                  Page {currentPage} of {totalPages}
                  <span className="text-white/50 ml-1">
                    ({totalCount} event{totalCount !== 1 ? "s" : ""})
                  </span>
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-white/50">Show</span>
                  {PER_PAGE_OPTIONS.map((n) =>
                    n === perPage ? (
                      <span
                        key={n}
                        className="min-w-[2rem] rounded px-2 py-1 text-center font-medium text-white bg-white/15"
                      >
                        {n}
                      </span>
                    ) : (
                      <Link
                        key={n}
                        href={paginationUrl({ page: 1, perPage: n })}
                        className="min-w-[2rem] rounded px-2 py-1 text-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {n}
                      </Link>
                    )
                  )}
                  <span className="text-white/50">per page</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Button variant="outline" size="sm" className="border-white/20 text-white/80" asChild>
                    <Link href={paginationUrl({ page: currentPage - 1 })}>
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="border-white/20 text-white/50" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
                {currentPage < totalPages ? (
                  <Button variant="outline" size="sm" className="border-white/20 text-white/80" asChild>
                    <Link href={paginationUrl({ page: currentPage + 1 })}>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="border-white/20 text-white/50" disabled>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
