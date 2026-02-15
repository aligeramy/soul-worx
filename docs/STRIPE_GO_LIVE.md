# Stripe: Exiting Test Mode (Go Live)

This guide covers switching from Stripe **test mode** to **live mode** for the entire site: events (ticket checkout), community subscriptions, and any other payments. It applies to both **localhost** and **production**.

---

## 1. What Stripe keys you need

Your app uses these **four** Stripe env vars:

| Env var | Used by | Where |
|--------|--------|--------|
| `STRIPE_SECRET_KEY` | Server (API routes, webhook) | All checkout and subscription APIs |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | `POST /api/webhooks/stripe` |
| `STRIPE_PUBLISHABLE_KEY` | Optional / docs | Not currently read in Next.js app code; keep for consistency |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client (if you add Stripe.js later) | Next.js frontend; must be `NEXT_PUBLIC_` to be exposed to browser |

For **Expo (mobile)** you also need:

| Env var | Used by |
|--------|--------|
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Expo app (e.g. upgrade flow) |

**Live keys** (Dashboard → Developers → API keys, **toggle “Test mode” OFF**):

- **Publishable:** `pk_live_...`
- **Secret:** `sk_live_...`

You will get a **new webhook signing secret** when you create a **live** webhook endpoint (see below).

---

## 2. Webhook endpoint (required for subscriptions & tickets)

Your single webhook handler is:

- **URL:** `https://<YOUR_DOMAIN>/api/webhooks/stripe`  
  - Localhost: use Stripe CLI to forward (see step 4).  
  - Production: use your real domain, e.g. `https://soulworx.ca/api/webhooks/stripe`.

**Events the app handles** (subscribe to these in Stripe Dashboard or CLI):

| Event | Purpose |
|-------|--------|
| `checkout.session.completed` | Event tickets + subscription signups; creates tickets / memberships |
| `customer.subscription.updated` | Sync membership status (e.g. plan change, renewal) |
| `customer.subscription.deleted` | Mark membership cancelled/expired |
| `invoice.payment_succeeded` | Renewals; keep membership active |
| `invoice.payment_failed` | Optional handling (e.g. retry / dunning) |

Create **one live webhook** in Stripe that sends these five events to your production URL. Stripe will give you a **live** signing secret (`whsec_...`). Use that as `STRIPE_WEBHOOK_SECRET` in production.

---

## 3. API routes that use Stripe (site-wide)

So you can verify behaviour and env vars in one place:

| Area | Route | Purpose |
|------|--------|--------|
| **Events (tickets)** | `POST /api/events/ticket-checkout` | Create Stripe Checkout for paid event tickets (or issue free ticket if 100% off) |
| **Subscriptions (web)** | `POST /api/community/subscribe` | Create Checkout session for Pro / Pro+ (tier by id or slug) |
| **Subscriptions (mobile)** | `POST /api/community/upgrade-mobile` | Same for app; different success/cancel URLs |
| **Success callback** | `GET /api/community/checkout-success` | After web checkout; syncs membership from Stripe session |
| **Webhook** | `POST /api/webhooks/stripe` | All subscription + event-ticket lifecycle events |
| **Admin** | `POST /api/admin/setup-stripe-prices` | Create Stripe products/prices and save `stripePriceId` on tiers |
| **Admin** | `POST /api/admin/fix-membership` | Fix membership tier from Stripe subscription (e.g. after plan change) |

All of these use `STRIPE_SECRET_KEY` (and the webhook uses `STRIPE_WEBHOOK_SECRET`). No code changes are required to “switch” to live; only env vars.

---

## 4. Steps to go live

### 4.1 Stripe Dashboard (live mode)

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com).
2. Turn **off** “Test mode” (toggle top-right).
3. **Developers → API keys:** copy your **live** keys:
   - Publishable: `pk_live_...`
   - Secret: `sk_live_...`

### 4.2 Create live products/prices (if not already done)

- In **live mode**, create Products (e.g. “Pro”, “Pro+”) and recurring Prices if you haven’t already.
- Either run your **admin** flow that calls `POST /api/admin/setup-stripe-prices` (with live `STRIPE_SECRET_KEY`), or create products/prices in the Dashboard and then set each tier’s `stripePriceId` in your DB to the **live** price IDs (e.g. `price_...`).  
- **Important:** Test price IDs (e.g. `price_xxx`) will not work in live mode; you need live price IDs.

### 4.3 Webhook (production)

1. In Stripe Dashboard (live mode): **Developers → Webhooks → Add endpoint**.
2. **Endpoint URL:** `https://<YOUR_PRODUCTION_DOMAIN>/api/webhooks/stripe`  
   (e.g. `https://soulworx.ca/api/webhooks/stripe` or your Vercel URL).
3. Select events (or “Select all” then narrow later):
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Add endpoint. Open it and **Reveal** the **Signing secret** (`whsec_...`). This is your **live** `STRIPE_WEBHOOK_SECRET`.

### 4.4 Localhost (optional: test live locally)

To hit your **local** app with **live** events (use with care; real charges):

1. Install Stripe CLI and log in:  
   `stripe login`
2. Forward to your local server:  
   `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. The CLI prints a **temporary** signing secret (e.g. `whsec_...`). Use that as `STRIPE_WEBHOOK_SECRET` in your **local** `.env` while forwarding.
4. Use your **live** `STRIPE_SECRET_KEY` and **live** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` locally if you want to test live payments locally.

For **day-to-day local dev**, most people keep **test** keys and test webhook locally so they don’t trigger real charges.

### 4.5 Set environment variables

**Production (Vercel / host):**

- `STRIPE_SECRET_KEY` = `sk_live_...`
- `STRIPE_WEBHOOK_SECRET` = live webhook signing secret from step 4.3
- `STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (optional but recommended)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`

**Local (.env):**

- In the repo, test keys are **commented out** and live keys are left **empty** so you can paste in your live values.
- Fill in `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and both publishable keys with your **live** values (for local webhook testing with Stripe CLI, use the temporary secret from `stripe listen` as `STRIPE_WEBHOOK_SECRET`).
- **Optional:** To keep using **test mode** locally, uncomment the test block in `.env` and comment out or remove the live block; use live keys only in production.

**Expo (mobile):**

- In `expo/.env` (and any build env):  
  `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`  
  so the app uses live Stripe when opening checkout.

### 4.6 Deploy and smoke-test

1. Deploy with the new **live** env vars.
2. Do a **small real payment** (e.g. cheapest event ticket or one month Pro).
3. Confirm:
   - Checkout completes.
   - Webhook is received (Developers → Webhooks → your endpoint → “Recent events”).
   - Ticket is created or membership is active in your app/DB.
4. Optionally test subscription cancel/update and confirm `customer.subscription.updated` / `customer.subscription.deleted` and `invoice.*` behaviour.

---

## 5. Checklist

- [ ] Stripe Dashboard switched to **live** and live API keys copied.
- [ ] Live **products/prices** created; tier `stripePriceId` in DB points to **live** price IDs.
- [ ] Live **webhook** added: URL `https://<domain>/api/webhooks/stripe`, events listed in section 2, signing secret copied.
- [ ] Production env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (and optionally `STRIPE_PUBLISHABLE_KEY`) set to **live** values.
- [ ] Local .env: test keys commented/removed; live keys (and optional `stripe listen` secret) added if you want local live testing.
- [ ] Expo: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` for production builds.
- [ ] One real payment tested end-to-end (checkout → webhook → ticket/membership).

After this, the site (and mobile app) will use live Stripe for events, subscriptions, and all payment flows. Keep test keys only where you intentionally want test mode (e.g. local dev or a separate staging env).
