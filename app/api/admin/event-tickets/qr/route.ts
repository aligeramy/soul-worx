import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { eventTickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import QRCode from "qrcode"

/**
 * GET /api/admin/event-tickets/qr?ticketId=xxx
 * Returns PNG image of the ticket's QR code (for admin table display).
 */
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const ticketId = searchParams.get("ticketId")
  if (!ticketId) {
    return NextResponse.json({ error: "ticketId required" }, { status: 400 })
  }

  const ticket = await db.query.eventTickets.findFirst({
    where: eq(eventTickets.id, ticketId),
    columns: { qrCodeData: true },
  })
  if (!ticket?.qrCodeData) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
  }

  try {
    const dataUrl = await QRCode.toDataURL(ticket.qrCodeData, {
      width: 128,
      margin: 1,
    })
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "")
    const buffer = Buffer.from(base64, "base64")
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch (err) {
    console.error("QR generation failed:", err)
    return NextResponse.json({ error: "Failed to generate QR" }, { status: 500 })
  }
}
