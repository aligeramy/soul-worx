import { NextRequest, NextResponse } from "next/server"
import { getTicketedEventById, getEventCouponByCode, applyEventCoupon } from "@/lib/db/queries"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get("eventId")
  const code = searchParams.get("code")
  const amountCents = parseInt(searchParams.get("amountCents") ?? "0", 10)

  if (!eventId || !code?.trim() || Number.isNaN(amountCents) || amountCents < 0) {
    return NextResponse.json(
      { valid: false, error: "Missing eventId, code, or amountCents" },
      { status: 400 }
    )
  }

  const event = await getTicketedEventById(eventId)
  if (!event || event.status !== "scheduled") {
    return NextResponse.json({ valid: false, error: "Event not found" }, { status: 404 })
  }

  const coupon = await getEventCouponByCode(code.trim(), eventId)
  if (!coupon) {
    return NextResponse.json({
      valid: false,
      discountedCents: amountCents,
      error: "Invalid or expired coupon code",
    })
  }

  const discountedCents = applyEventCoupon(amountCents, coupon)
  const label =
    coupon.type === "percent"
      ? `${coupon.value}% off`
      : `$${(coupon.value / 100).toFixed(2)} off`

  return NextResponse.json({
    valid: true,
    discountedCents,
    label,
    couponId: coupon.id,
  })
}
