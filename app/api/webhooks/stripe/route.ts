import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { userMemberships, membershipTiers, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { constructWebhookEvent, stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { incrementCouponRedemption } from "@/lib/db/queries"
import { createTicketAndSendEmail } from "@/lib/events/create-ticket-and-email"

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Event ticket purchase (pay-what-you-want)
  if (session.metadata?.type === "event_ticket") {
    await handleEventTicketCheckout(session)
    return
  }

  const userId = session.metadata?.userId
  const isMobile = session.metadata?.mobile === "true"
  const isOnboarding = session.metadata?.onboarding === "true"
  const tierId = session.metadata?.tierId

  if (!userId || !tierId) {
    console.error("Missing userId or tierId in checkout session metadata")
    return
  }

  // First check by subscription ID
  let subscription = await db.query.userMemberships.findFirst({
    where: and(
      eq(userMemberships.userId, userId),
      eq(userMemberships.stripeSubscriptionId, session.subscription as string)
    ),
  })

  // If not found by subscription ID, check for any active membership for this user
  if (!subscription) {
    subscription = await db.query.userMemberships.findFirst({
      where: and(
        eq(userMemberships.userId, userId),
        eq(userMemberships.status, "active")
      ),
    })
  }

  const now = new Date()

  if (subscription) {
    // Update existing membership with new tierId
    await db
      .update(userMemberships)
      .set({
        tierId, // IMPORTANT: Update tierId when subscription changes
        status: "active",
        stripeSubscriptionId: session.subscription as string,
        stripeCustomerId: session.customer as string,
        updatedAt: now,
      })
      .where(eq(userMemberships.id, subscription.id))
  } else {
    // Create new membership
    await db.insert(userMemberships).values({
      userId,
      tierId,
      status: "active",
      stripeSubscriptionId: session.subscription as string,
      stripeCustomerId: session.customer as string,
      discordRoleAssigned: false,
      currentPeriodStart: now,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Trigger Discord role sync
  await syncDiscordRole(userId, tierId)
  
  // Update user onboarding data if this was during onboarding
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
  
  if (user) {
    const onboardingData = (user.onboardingData as Record<string, unknown>) || {}
    const tierSlug = session.metadata?.tierSlug || ""
    const updatedOnboardingData: Record<string, unknown> = {
      ...onboardingData,
      tier: tierSlug,
    }
    
    // If Pro+ and onboarding, set step to questionnaire
    if (tierSlug === "pro_plus" && isOnboarding) {
      updatedOnboardingData.step = "questionnaire"
    } else if (isOnboarding) {
      updatedOnboardingData.step = "complete"
    }
    
    await db
      .update(users)
      .set({
        onboardingData: updatedOnboardingData,
      })
      .where(eq(users.id, userId))
  }
}

/**
 * Handle event ticket checkout: create ticket, generate image, email
 */
async function handleEventTicketCheckout(session: Stripe.Checkout.Session) {
  const eventId = session.metadata?.eventId
  const purchaserEmail = session.metadata?.purchaserEmail
  const purchaserName = session.metadata?.purchaserName ?? null
  const couponId = session.metadata?.couponId ?? null
  if (!eventId || !purchaserEmail) {
    console.error("Event ticket checkout: missing eventId or purchaserEmail")
    return
  }

  // Webhook payload can have amount_total null; retrieve full session from Stripe if needed
  let amountPaidCents = session.amount_total ?? 0
  if (amountPaidCents === 0 && stripe && session.id) {
    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      })
      amountPaidCents = fullSession.amount_total ?? 0
      if (amountPaidCents === 0 && fullSession.line_items?.data?.length) {
        // amount_total per line item is already (unit_amount * quantity)
        amountPaidCents = fullSession.line_items.data.reduce(
          (sum, item) => sum + (item.amount_total ?? 0),
          0
        )
      }
    } catch (e) {
      console.error("Failed to retrieve checkout session for amount:", e)
    }
  }

  try {
    await createTicketAndSendEmail({
      ticketedEventId: eventId,
      purchaserEmail,
      purchaserName,
      amountPaidCents,
      stripeSessionId: session.id,
      couponId: couponId || undefined,
    })
    if (couponId) await incrementCouponRedemption(couponId)
  } catch (err) {
    console.error("Event ticket: create ticket or send email failed", err)
  }
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const membership = await db.query.userMemberships.findFirst({
    where: eq(userMemberships.stripeSubscriptionId, subscription.id),
  })

  if (!membership) {
    console.error(`Membership not found for subscription ${subscription.id}`)
    return
  }

  const status = mapStripeStatus(subscription.status)
  
  await db
    .update(userMemberships)
    .set({
      status,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cancelAt: (subscription as any).cancel_at ? new Date((subscription as any).cancel_at * 1000) : null,
      updatedAt: new Date(),
    })
    .where(eq(userMemberships.id, membership.id))

  // If cancelled, remove Discord role
  if (status === "cancelled" || status === "expired") {
    await removeDiscordRole(membership.userId, membership.tierId)
  }
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const membership = await db.query.userMemberships.findFirst({
    where: eq(userMemberships.stripeSubscriptionId, subscription.id),
  })

  if (!membership) {
    return
  }

  await db
    .update(userMemberships)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userMemberships.id, membership.id))

  // Remove Discord role
  await removeDiscordRole(membership.userId, membership.tierId)
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(invoice as any).subscription) return

  const membership = await db.query.userMemberships.findFirst({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: eq(userMemberships.stripeSubscriptionId, (invoice as any).subscription as string),
  })

  if (!membership) return

  // Ensure status is active
  await db
    .update(userMemberships)
    .set({
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(userMemberships.id, membership.id))
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(invoice as any).subscription) return

  const membership = await db.query.userMemberships.findFirst({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: eq(userMemberships.stripeSubscriptionId, (invoice as any).subscription as string),
  })

  if (!membership) return

  await db
    .update(userMemberships)
    .set({
      status: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(userMemberships.id, membership.id))
}

/**
 * Sync Discord role for user
 */
async function syncDiscordRole(userId: string, tierId: string) {
  try {
    const [user, tier] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, userId) }),
      db.query.membershipTiers.findFirst({ where: eq(membershipTiers.id, tierId) }),
    ])

    if (!user?.discordId || !tier?.discordRoleId) {
      console.log("Discord sync skipped: missing discordId or roleId")
      return
    }

    const { assignRole } = await import("@/lib/discord/bot")
    await assignRole(user.discordId, tier.discordRoleId)

    // Update membership record
    await db
      .update(userMemberships)
      .set({
        discordRoleAssigned: true,
        lastSyncedAt: new Date(),
      })
      .where(and(
        eq(userMemberships.userId, userId),
        eq(userMemberships.tierId, tierId)
      ))
  } catch (error) {
    console.error("Error syncing Discord role:", error)
  }
}

/**
 * Remove Discord role from user
 */
async function removeDiscordRole(userId: string, tierId: string) {
  try {
    const [user, tier] = await Promise.all([
      db.query.users.findFirst({ where: eq(users.id, userId) }),
      db.query.membershipTiers.findFirst({ where: eq(membershipTiers.id, tierId) }),
    ])

    if (!user?.discordId || !tier?.discordRoleId) {
      return
    }

    const { removeRole } = await import("@/lib/discord/bot")
    await removeRole(user.discordId, tier.discordRoleId)

    await db
      .update(userMemberships)
      .set({
        discordRoleAssigned: false,
        lastSyncedAt: new Date(),
      })
      .where(and(
        eq(userMemberships.userId, userId),
        eq(userMemberships.tierId, tierId)
      ))
  } catch (error) {
    console.error("Error removing Discord role:", error)
  }
}

/**
 * Map Stripe subscription status to our status
 */
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): "active" | "cancelled" | "expired" | "past_due" | "trialing" {
  switch (stripeStatus) {
    case "active":
      return "active"
    case "canceled":
      return "cancelled"
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
      return "expired"
    case "past_due":
      return "past_due"
    case "trialing":
      return "trialing"
    default:
      return "expired"
  }
}

