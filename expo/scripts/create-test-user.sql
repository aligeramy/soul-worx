-- Create Test User for Expo App
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Create user in Supabase Auth
-- This creates both auth.users and syncs to public.user table
SELECT auth.create_user(
  jsonb_build_object(
    'email', 'user@soulworx.ca',
    'password', 'user123',
    'email_confirm', true,
    'user_metadata', jsonb_build_object(
      'name', 'Soulworx User'
    )
  )
);

-- Step 2: Verify user was created
SELECT id, email, raw_user_meta_data->>'name' as name 
FROM auth.users 
WHERE email = 'user@soulworx.ca';

-- Step 3: Check if user was synced to public.user table
SELECT id, name, email, role 
FROM "user" 
WHERE email = 'user@soulworx.ca';

-- If user wasn't auto-synced to public.user, manually create:
-- INSERT INTO "user" (id, name, email, role, "createdAt", "updatedAt")
-- SELECT id, raw_user_meta_data->>'name', email, 'user', NOW(), NOW()
-- FROM auth.users
-- WHERE email = 'user@soulworx.ca'
-- ON CONFLICT (email) DO NOTHING;

