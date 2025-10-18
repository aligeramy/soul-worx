# Discord Community Setup Guide

This guide will help you set up the Discord-integrated community system with tiered memberships.

## Overview

The system includes:
- **3 Membership Tiers**: Free, Premium, VIP
- **Community Channels**: Organized video content (basketball, career, scholarships, etc.)
- **Discord Integration**: Automatic role assignment and DM access
- **Stripe Payments**: Subscription management
- **Video Access Control**: Tiered content access

---

## Step 1: Discord Bot Setup

### 1.1 Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Soulworx Community Bot"
4. Go to the "Bot" section
5. Click "Add Bot"
6. **Copy the Bot Token** (save it for .env)

### 1.2 Configure Bot Permissions

In the Bot section, enable these Privileged Gateway Intents:
- ✅ Server Members Intent
- ✅ Message Content Intent

Under "Bot Permissions", select:
- ✅ Manage Roles
- ✅ Manage Channels
- ✅ Send Messages
- ✅ Read Messages/View Channels
- ✅ Manage Server

### 1.3 Invite Bot to Your Server

1. Go to OAuth2 → URL Generator
2. Select scopes: `bot`, `applications.commands`
3. Select the permissions above
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### 1.4 Get Server (Guild) ID

1. In Discord, enable Developer Mode (User Settings → Advanced → Developer Mode)
2. Right-click your server icon
3. Click "Copy Server ID"
4. Save this for your .env

---

## Step 2: Create Discord Roles

In your Discord server, create these roles:

1. **Free Member** (for Tier 1)
   - Color: Gray (#95a5a6)
   - No special permissions needed

2. **Premium Member** (for Tier 2)
   - Color: Purple (#9b59b6)
   - Access to premium channels

3. **VIP Member** (for Tier 3)
   - Color: Gold (#f39c12)
   - Access to all channels + DM access

**Get Role IDs:**
- Right-click each role → Copy Role ID
- Save these for database seeding

---

## Step 3: Stripe Setup

### 3.1 Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Complete business verification

### 3.2 Create Products and Prices

#### Free Tier
- No Stripe product needed (free access)

#### Premium Tier
1. Go to Products → Add Product
2. Name: "Premium Membership"
3. Description: "Access to all video content"
4. Pricing: $9.99/month (recurring)
5. **Copy the Price ID** (starts with `price_`)

#### VIP Tier
1. Go to Products → Add Product
2. Name: "VIP Membership"
3. Description: "All videos + DM access to admin"
4. Pricing: $19.99/month (recurring)
5. **Copy the Price ID**

### 3.3 Get API Keys

1. Go to Developers → API Keys
2. Copy:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### 3.4 Set Up Webhooks

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to listen for:
   - ✅ checkout.session.completed
   - ✅ customer.subscription.updated
   - ✅ customer.subscription.deleted
   - ✅ invoice.payment_succeeded
   - ✅ invoice.payment_failed
5. **Copy the Webhook Signing Secret**

---

## Step 4: Update Environment Variables

Update your `.env` file:

```env
# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
DISCORD_WEBHOOK_SECRET=random_secret_for_webhooks

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Step 5: Database Migration

Run the database migration to create new tables:

```bash
pnpm db:generate
pnpm db:push
```

---

## Step 6: Seed Membership Tiers

Create a file `scripts/seed-tiers.ts`:

```typescript
import { db } from "@/lib/db"
import { membershipTiers } from "@/lib/db/schema"

async function seedTiers() {
  console.log("Seeding membership tiers...")

  await db.insert(membershipTiers).values([
    {
      name: "Free",
      slug: "free",
      level: "free",
      description: "Access to first episodes",
      features: [
        "First episode of each channel",
        "Community access",
        "Basic support",
      ],
      accessLevel: 1,
      price: "0",
      billingPeriod: "monthly",
      stripePriceId: null,
      discordRoleId: "YOUR_FREE_ROLE_ID", // Replace with actual role ID
      dmAccessEnabled: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Premium",
      slug: "premium",
      level: "premium",
      description: "Full access to all videos",
      features: [
        "All videos in all channels",
        "Early access to new content",
        "Priority support",
        "Discord community access",
      ],
      accessLevel: 2,
      price: "9.99",
      billingPeriod: "monthly",
      stripePriceId: "price_YOUR_PREMIUM_PRICE_ID", // Replace with actual price ID
      discordRoleId: "YOUR_PREMIUM_ROLE_ID", // Replace with actual role ID
      dmAccessEnabled: false,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "VIP",
      slug: "vip",
      level: "vip",
      description: "All access + DM with admin",
      features: [
        "Everything in Premium",
        "Direct message access to admin",
        "1-on-1 mentorship opportunities",
        "Exclusive VIP channels",
        "Priority event access",
      ],
      accessLevel: 3,
      price: "19.99",
      billingPeriod: "monthly",
      stripePriceId: "price_YOUR_VIP_PRICE_ID", // Replace with actual price ID
      discordRoleId: "YOUR_VIP_ROLE_ID", // Replace with actual role ID
      dmAccessEnabled: true,
      isActive: true,
      sortOrder: 3,
    },
  ])

  console.log("✅ Membership tiers seeded successfully!")
}

seedTiers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding tiers:", error)
    process.exit(1)
  })
```

Run the seed script:

```bash
tsx scripts/seed-tiers.ts
```

---

## Step 7: Test the System

### 7.1 Create a Test Channel

1. Go to `/dashboard/admin/community`
2. Click "Create Channel"
3. Fill in:
   - Title: "Basketball Fundamentals"
   - Slug: "basketball-fundamentals"
   - Category: "basketball"
   - Required Tier Level: 1 (Free)
   - Check "Create Discord channel"
4. Save

### 7.2 Add Test Videos

1. Click "Manage Videos" on the channel
2. Add first episode (mark as "First Episode" for free access)
3. Add more episodes with Tier 2 requirement

### 7.3 Test Subscriptions

1. Create a test user account
2. Visit `/programs/community`
3. Try subscribing to Premium tier
4. Complete Stripe checkout (use test card: 4242 4242 4242 4242)
5. Verify Discord role is assigned

---

## Architecture Overview

### Access Control Logic

| Tier | Access Level | Features |
|------|-------------|----------|
| Free | 1 | First episode of each channel |
| Premium | 2 | All videos |
| VIP | 3 | All videos + DM access |

### Video Access Rules

```typescript
// A user can access a video if:
1. It's marked as "First Episode" (isFirstEpisode = true), OR
2. User's tier accessLevel >= video's requiredTierLevel
```

### Discord Integration

- When a user subscribes, Stripe webhook triggers
- System assigns Discord role based on tier
- VIP members can DM the admin
- Roles are automatically synced/removed on subscription changes

---

## Admin Workflows

### Creating Content

1. **Create Channel** → Set tier requirement
2. **Add Videos** → Mark first episode as free
3. **Publish** → Content appears on public site

### Managing Subscriptions

- View in `/dashboard/admin/community`
- Stripe Dashboard for payment issues
- Discord server for role verification

---

## User Workflows

### Free Users
1. Browse community channels
2. Watch first episodes
3. See "Upgrade to access" on locked content

### Premium/VIP Users
1. Subscribe via Stripe
2. Automatic Discord role assignment
3. Access unlocked content
4. Manage subscription in Stripe portal

---

## Troubleshooting

### Discord Bot Not Working
- Check bot is in your server
- Verify bot token in .env
- Ensure bot has proper permissions

### Stripe Webhooks Failing
- Check webhook URL is correct
- Verify webhook secret in .env
- Check Stripe Dashboard → Developers → Webhooks for errors

### Roles Not Syncing
- User must link Discord account
- Check discordId is stored in user table
- Verify role IDs match in database

---

## Next Steps

1. ✅ Complete Discord setup
2. ✅ Configure Stripe
3. ✅ Seed membership tiers
4. ✅ Create your first channels
5. ✅ Test full flow
6. ✅ Go live!

## Support

For issues, check:
- Stripe Dashboard logs
- Discord bot logs in console
- Database queries for membership records
- Network tab for API errors

---

**🎉 Your Discord Community is ready to go!**

Youth can now access your content, subscribe for premium features, and engage in the Discord community.

