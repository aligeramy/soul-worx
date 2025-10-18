import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { userMemberships, membershipTiers, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { constructWebhookEvent } from "@/lib/stripe"
import Stripe from "stripe"

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
  const userId = session.metadata?.userId
  const tierId = session.metadata?.tierId

  if (!userId || !tierId) {
    console.error("Missing userId or tierId in checkout session metadata")
    return
  }

  const subscription = await db.query.userMemberships.findFirst({
    where: and(
      eq(userMemberships.userId, userId),
      eq(userMemberships.stripeSubscriptionId, session.subscription as string)
    ),
  })

  const now = new Date()

  if (subscription) {
    // Update existing
    await db
      .update(userMemberships)
      .set({
        status: "active",
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

