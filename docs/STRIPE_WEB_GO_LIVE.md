# Stripe go live (web app only)

Domain: **beta.soulworx.ca**

---

## 1. Keys to add

In Stripe Dashboard, turn **Test mode** OFF, then **Developers → API keys**. You get:

- **Publishable key** → `pk_live_...` (safe to use in frontend)
- **Secret key** → `sk_live_...` (server only, never expose)

Set these in `.env` and in your host (e.g. Vercel):

| Variable | Value |
|----------|--------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (Secret key from Dashboard) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (Publishable key) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (same Publishable key again; Next.js needs this for client) |
| `STRIPE_WEBHOOK_SECRET` | From webhook step below |

**Publishable key:** use the same `pk_live_...` value for both `STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

---

## 2. Webhook

1. **Developers → Webhooks → Add endpoint**
2. **Endpoint URL:** `https://beta.soulworx.ca/api/webhooks/stripe`
3. **Events to send:**  
   `checkout.session.completed`  
   `customer.subscription.updated`  
   `customer.subscription.deleted`  
   `invoice.payment_succeeded`  
   `invoice.payment_failed`
4. Create the endpoint, then **Reveal** the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET` in your env.

---

## 3. Live products/prices (subscriptions only)

- **Event tickets** — No setup needed. Each checkout creates a one-time line item; no Stripe products are pre-created.
- **Subscriptions (Pro / Pro+)** — Create live products and prices, then wire your DB tiers to them:

  1. Make sure **live** keys are in `.env` (see step 1).
  2. From the project root run:
     ```bash
     npm run setup-stripe-prices
     ```
     This creates in Stripe (live mode):
     - Product “Soulworx Pro Membership” + $20/month price  
     - Product “Soulworx Pro+ Membership” + $25/month price  
     and updates your `membership_tier` rows (Pro, Pro+) with the new `stripePriceId`s.

  **Alternative:** Log in as admin and `POST /api/admin/setup-stripe-prices` to do the same from the app.

---

## 4. Checklist

- [ ] Live API keys in `.env` and production env
- [ ] Webhook: `https://beta.soulworx.ca/api/webhooks/stripe` with the 5 events and signing secret in `STRIPE_WEBHOOK_SECRET`
- [ ] (Subscriptions only) Tiers in DB use live Stripe price IDs
- [ ] One real test payment (event ticket and/or subscription) to confirm checkout and webhook

Done. All payments on the web app will use live Stripe.
