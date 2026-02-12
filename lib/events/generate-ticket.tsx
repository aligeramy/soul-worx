/**
 * Generate event ticket image (with QR), upload to Vercel Blob, return URL.
 */
import QRCode from "qrcode"
import { put } from "@vercel/blob"
import { ImageResponse } from "@vercel/og"
import { getTicketedEventById } from "@/lib/db/queries"
import type { eventTickets } from "@/lib/db/schema"

export type TicketRecord = typeof eventTickets.$inferSelect

export async function generateTicketImageAndUpload(
  ticket: TicketRecord,
  event: Awaited<ReturnType<typeof getTicketedEventById>>
): Promise<string> {
  if (!event) throw new Error("Event not found")

  const qrDataUrl = await QRCode.toDataURL(ticket.qrCodeData, {
    width: 200,
    margin: 1,
  })

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#191512",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 400,
            backgroundColor: "#191512",
            borderRadius: 16,
            border: "2px solid rgba(255,255,255,0.2)",
            padding: 32,
          }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 4, marginBottom: 8 }}>
            SOULWORX PRESENTS
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 4 }}>
            {event.title}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>
            {event.dateLabel}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
            {event.venueAddress}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            Doors {event.doorsOpenAt || "—"} · Performances {event.performanceAt || "—"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Ticket holder</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "white" }}>
                {ticket.purchaserName || ticket.purchaserEmail}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR" width={80} height={80} style={{ borderRadius: 8 }} />
          </div>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 520,
    }
  )

  const buffer = Buffer.from(await response.arrayBuffer())
  const blob = await put(
    `tickets/${ticket.ticketedEventId}/${ticket.id}.png`,
    buffer,
    { access: "public", contentType: "image/png" }
  )
  return blob.url
}
