import { NextRequest, NextResponse } from "next/server"
import {
  getTicketedEventById,
  getEventCouponByCode,
  applyEventCoupon,
  incrementCouponRedemption,
} from "@/lib/db/queries"
import { createPaymentCheckoutSession } from "@/lib/stripe"
import { createTicketAndSendEmail } from "@/lib/events/create-ticket-and-email"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, amountCents, email, name, couponCode } = body as {
      eventId?: string
      amountCents?: number
      email?: string
      name?: string
      couponCode?: string
    }

    if (!eventId || !amountCents || !email?.trim()) {
      return NextResponse.json(
        { error: "Missing eventId, amountCents, or email" },
        { status: 400 }
      )
    }

    const event = await getTicketedEventById(eventId)
    if (!event || event.status !== "scheduled") {
      return NextResponse.json({ error: "Event not found or not available" }, { status: 404 })
    }

    let finalCents = amountCents
    let coupon: Awaited<ReturnType<typeof getEventCouponByCode>> = null
    if (couponCode?.trim()) {
      coupon = await getEventCouponByCode(couponCode.trim(), eventId)
      if (!coupon) {
        return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 400 })
      }
      finalCents = applyEventCoupon(amountCents, coupon)
    }

    if (finalCents === 0) {
      // 100% off: create ticket immediately, no Stripe
      const ticket = await createTicketAndSendEmail({
        ticketedEventId: eventId,
        purchaserEmail: email.trim(),
        purchaserName: (name || "").trim() || undefined,
        amountPaidCents: 0,
        stripeSessionId: null,
        couponId: coupon?.id,
      })
      if (coupon?.id) await incrementCouponRedemption(coupon.id)
      const successUrl = `${APP_URL}/events/${event.slug}/success?session_id=free_${ticket.id}`
      return NextResponse.json({ url: successUrl })
    }

    if (finalCents < event.minPriceCents) {
      return NextResponse.json(
        { error: `After discount, minimum is $${event.minPriceCents / 100}` },
        { status: 400 }
      )
    }

    const metadata: Record<string, string> = {
      type: "event_ticket",
      eventId: event.id,
      eventSlug: event.slug,
      purchaserEmail: email.trim(),
      purchaserName: (name || "").trim(),
    }
    if (coupon?.id) metadata.couponId = coupon.id

    const session = await createPaymentCheckoutSession({
      successUrl: `${APP_URL}/events/${event.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${APP_URL}/events/${event.slug}`,
      lineItems: [
        {
          name: `${event.title} — Ticket`,
          description: event.dateLabel + (coupon ? ` (${coupon.code} applied)` : ""),
          amountCents: finalCents,
          quantity: 1,
        },
      ],
      metadata,
      customerEmail: email.trim(),
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Ticket checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
