# Quick Start - 2 Minutes to Running App

## Step 1: Create Test User (30 seconds)

Go to your Supabase Dashboard:
https://supabase.com/dashboard/project/icnlrezdpxkjicqcmgbg/sql/new

Copy and paste this SQL:

```sql
SELECT auth.create_user(
  jsonb_build_object(
    'email', 'user@soulworx.ca',
    'password', 'user123',
    'email_confirm', true,
    'user_metadata', jsonb_build_object('name', 'Soulworx User')
  )
);
```

Click "Run" (or press Cmd/Ctrl + Enter)

## Step 2: Start the App (30 seconds)

```bash
cd /Users/realeyes/Projects/soul/expo
npx expo start --clear
```

Press `i` for iOS or `a` for Android

## Step 3: Sign In (30 seconds)

In the app:
- **Email**: `user@soulworx.ca`
- **Password**: `user123`
- Tap "Sign In"

## Done!

You should now see:
- 4 Programs in Programs tab
- 4 Channels with 35 videos in Channels tab
- All real data from your database

## OR: Skip Auth Entirely (For Testing)

The app is already configured to work **without authentication** in dev mode!

Just start the app and it will use a mock user automatically. You'll see all data immediately.

If you want to require authentication, open:
`expo/contexts/UserContext.tsx`

And uncomment this line:
```typescript
// router.replace('/signin');
```

## Credentials

**Test User**:
- Email: `user@soulworx.ca`
- Password: `user123`

**Your Account**:
- Email: `ali@softx.ca`  
- Password: (set in Supabase Dashboard > Authentication > Users)

## Next Steps

1. Test all 4 tabs
2. Tap a program to see nested tabs
3. Add reminders (saves to database)
4. Send chat messages (real-time via Supabase)
5. Watch videos (tier-based access)

That's it! Your Soulworx mobile app is running with real data.

