# Create Test User - Quick Guide

The Supabase MCP is timing out, so here's the manual method:

## Step 1: Go to Supabase SQL Editor

Open this URL:
https://supabase.com/dashboard/project/icnlrezdpxkjicqcmgbg/sql/new

## Step 2: Copy & Paste This SQL

```sql
-- Create test user in Supabase Auth
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'user@soulworx.ca',
  crypt('user123', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Soulworx User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) RETURNING id, email;
```

## Step 3: Sync to public.user Table

```sql
-- Sync to public.user table
INSERT INTO "user" (id, name, email, role, "createdAt", "updatedAt")
SELECT 
  id, 
  raw_user_meta_data->>'name' as name,
  email, 
  'user' as role,
  NOW(), 
  NOW()
FROM auth.users
WHERE email = 'user@soulworx.ca'
ON CONFLICT (email) DO NOTHING
RETURNING *;
```

## Step 4: Test in App

Now in the Expo app sign in with:
- **Email**: `user@soulworx.ca`
- **Password**: `user123`

## OR: Continue with Mock User (No Auth Needed)

The app is already configured to work without authentication!

Just reload and it will use the mock user. You'll see all data immediately.

Press `r` in the Expo terminal to reload.

