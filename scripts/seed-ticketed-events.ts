/**
 * Seed the Poetry Night ticketed event and test coupons.
 * Run: pnpm exec tsx scripts/seed-ticketed-events.ts
 */
import "dotenv/config"
import { db } from "../lib/db"
import { ticketedEvents, eventCoupons } from "../lib/db/schema"
import { eq } from "drizzle-orm"

async function seed() {
  let event = await db.query.ticketedEvents.findFirst({
    where: eq(ticketedEvents.slug, "poetry-night-april-2025"),
  })
  if (!event) {
    const [inserted] = await db.insert(ticketedEvents).values({
      slug: "poetry-night-april-2025",
      title: "Poetry Night",
      description: "An evening of live poetry and spoken word.",
      status: "scheduled",
      dateLabel: "Saturday, April 4th",
      venueAddress: "7890 BATHURST STREET",
      doorsOpenAt: "7:00 PM",
      performanceAt: "8:30 PM",
      mixMingleEnd: "9:30-11 PM",
      minPriceCents: 1500,
    }).returning()
    event = inserted!
    console.log("Seeded: Poetry Night ticketed event.")
  } else {
    console.log("Poetry Night event already exists.")
  }

  const eventId = event.id

  const couponsToSeed = [
    { code: "POETRY10", type: "percent" as const, value: 10, desc: "10% off" },
    { code: "FREETEST", type: "percent" as const, value: 100, desc: "100% off (free)" },
  ]
  for (const c of couponsToSeed) {
    const existing = await db.query.eventCoupons.findFirst({
      where: eq(eventCoupons.code, c.code),
    })
    if (!existing) {
      await db.insert(eventCoupons).values({
        code: c.code,
        type: c.type,
        value: c.value,
        ticketedEventId: null,
        status: "active",
      })
      console.log(`Seeded coupon: ${c.code} (${c.desc})`)
    }
  }
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
