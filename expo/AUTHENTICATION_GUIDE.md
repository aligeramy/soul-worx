# Authentication Setup Guide

## How It Works

The Expo app now uses **Supabase Auth** which integrates with your existing `user` table:

```
Supabase Auth → Creates auth.users entry → Syncs to public.user table
```

## Two Options to Sign In

### Option 1: Use Your Existing Account

If you already have an account from the Next.js app (signed in with Google/Discord/Apple), you need to set a password:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/icnlrezdpxkjicqcmgbg
2. Go to Authentication > Users
3. Find your user (ali@softx.ca)
4. Click the user
5. Click "Send password recovery email" or manually set a password
6. Use that password in the Expo app

### Option 2: Create a New Test Account

In the Expo app:
1. Open the app
2. Tap "Create Account"
3. Enter email and password
4. Check your email for verification link
5. Sign in with those credentials

### Option 3: Quick Dev Login (Easiest)

I've added a "Dev: Use Test Account" button on the sign-in screen that pre-fills credentials:

**Email**: `ali@softx.ca`  
**Password**: Set this in Supabase Dashboard first

## Manual User Creation (Alternative)

You can also create a user via SQL:

```sql
-- This creates a user in Supabase Auth that syncs to your user table
-- Run this in Supabase SQL Editor
SELECT auth.create_user(
  jsonb_build_object(
    'email', 'test@soulworx.com',
    'password', 'testpassword123',
    'email_confirm', true
  )
);
```

## Why Supabase Auth?

Your Next.js app uses Auth.js (NextAuth) with OAuth providers. The Expo app needs a simpler auth method:

- **Web App**: Auth.js with Google/Discord/Apple OAuth
- **Mobile App**: Supabase Auth with email/password
- **Shared**: Same `user` table in PostgreSQL

Both systems can coexist because:
1. They both write to the same `user` table
2. Supabase Auth manages its own `auth.users` table
3. You can link accounts later if needed

## Current Flow

1. **App Starts** → Check for existing Supabase session
2. **No Session** → Redirect to `/signin`
3. **User Signs In** → Supabase Auth validates
4. **Success** → Fetch user data from `user` table
5. **Load Tier** → Fetch membership from `user_membership` table
6. **Navigate** → Go to Programs tab with full access

## Testing the Auth Flow

1. **Restart the Expo app**:
   ```bash
   cd expo
   npx expo start --clear
   ```

2. **You'll see the sign-in screen**

3. **Set a password for your account first**:
   - Go to Supabase Dashboard
   - Authentication > Users
   - Find user: ali@softx.ca
   - Reset password or set one manually

4. **Sign in with your credentials**

5. **App loads with real data!**

## What If I See "No Programs Available"?

This means either:
1. Not authenticated (sign in first)
2. No published programs in database
3. Supabase RLS (Row Level Security) is blocking queries

### Fix: Disable RLS for Development

Run this in Supabase SQL Editor:

```sql
-- Disable RLS on all tables for development
ALTER TABLE program DISABLE ROW LEVEL SECURITY;
ALTER TABLE event DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_channel DISABLE ROW LEVEL SECURITY;
ALTER TABLE video DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_tier DISABLE ROW LEVEL SECURITY;
ALTER TABLE program_reminder DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_message DISABLE ROW LEVEL SECURITY;
```

For production, you'll want to enable RLS and create proper policies.

## Next Steps

1. Set password for your existing user in Supabase Dashboard
2. Sign in to the Expo app
3. You should now see all 4 programs, 4 channels, and 35 videos!

## Troubleshooting

### "Invalid login credentials"
- Password not set in Supabase Dashboard
- User doesn't exist in auth.users

### "No data showing"
- RLS is blocking queries (disable it)
- Not signed in
- Check console logs for errors

### "Email not confirmed"
- Go to Supabase Dashboard > Authentication > Users
- Click user > Confirm email manually

