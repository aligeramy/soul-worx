# Soulworx Expo App - Setup Complete

## Database Setup Complete

Your Expo app is now connected to the live Supabase database and ready to use!

### What Was Configured

1. **Supabase Project Connected**: `soulworx` (icnlrezdpxkjicqcmgbg)
   - Region: ca-central-1
   - Status: ACTIVE_HEALTHY
   - PostgreSQL 17

2. **Environment Variables**: Already configured in `.env`
   - `EXPO_PUBLIC_SUPABASE_URL`: ✓ Set
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: ✓ Set
   - `EXPO_PUBLIC_DATABASE_URL`: ✓ Set

3. **Database Migration Applied**: `program_reminder` table created
   - Stores user to-dos/reminders per program
   - Includes indexes for optimal query performance
   - Properly linked to `program` and `user` tables with CASCADE deletes

### Existing Tables Verified

All tables from your Next.js app are accessible:
- ✓ `user` (8 rows)
- ✓ `program` (4 rows)
- ✓ `event` (6 rows)
- ✓ `community_channel` (4 rows)
- ✓ `video` (35 rows)
- ✓ `membership_tier` (3 rows)
- ✓ `user_membership`
- ✓ `rsvp`
- ✓ `post` (7 rows)
- ✓ `product` (4 rows)
- ✓ **`program_reminder` (NEW)** - Created for mobile app

## How to Run the App

### Start the Development Server

```bash
cd expo
npm start
```

### Run on Device

```bash
# iOS
npm run ios

# Android  
npm run android

# Web (for testing)
npm run web
```

## Real Data Available

Your app will now fetch real data from the database:

### Programs
- 4 published programs with real event data
- Program categories, descriptions, and images
- Event scheduling and location information

### Videos
- 35 videos across 4 channels
- Tier-based access control (Free/Premium/VIP)
- Real video metadata and episode numbers

### Membership Tiers
- Free tier (accessLevel: 1)
- Premium tier (accessLevel: 2)
- VIP tier (accessLevel: 3)

### Mock vs Real

Currently **MOCK**:
- User authentication (using mock user in `UserContext.tsx`)
- Chat messages (sample messages in program chat)

Currently **REAL**:
- All database queries via Supabase
- Programs, events, channels, videos
- Tier-based access control
- Reminders/to-dos (stored in database)

## Next Steps to Make Fully Functional

### 1. Implement Real Authentication

Replace the mock user in `contexts/UserContext.tsx` with Supabase Auth:

```typescript
// Add to lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// User login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### 2. Implement Real-Time Chat

Use Supabase Realtime for the program chat:

```typescript
// Subscribe to chat messages
const channel = supabase.channel('program-chat')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `programId=eq.${programId}`,
    },
    (payload) => {
      // Add new message to state
    }
  )
  .subscribe();
```

You'll need to create a `chat_messages` table for this.

### 3. Add RSVP Functionality

Connect the "Join Program" button to create real RSVPs:

```typescript
const { data, error } = await supabase
  .from('rsvp')
  .insert({
    eventId: event.id,
    userId: user.id,
    status: 'confirmed',
  });
```

### 4. Test Video Playback

Replace mock video URLs with real video hosting:
- Upload videos to Supabase Storage
- Or use video CDN (Mux, Cloudflare Stream, etc.)
- Update `videoUrl` in the `video` table

## Database Schema Summary

### New Table: program_reminder

```sql
CREATE TABLE program_reminder (
  id TEXT PRIMARY KEY,
  "programId" TEXT REFERENCES program(id) ON DELETE CASCADE,
  "userId" TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT now()
);
```

### Queries Available

All queries in `expo/lib/queries.ts` are ready to use:
- `getPrograms()` - Fetch all programs
- `getProgramById(id)` - Get program with events
- `getChannels()` - Fetch video channels
- `getVideosByChannel(channelId)` - Get channel videos
- `getUserMembership(userId)` - Get user's tier
- `getProgramReminders(programId, userId)` - Get to-dos
- `createProgramReminder(...)` - Add reminder
- `toggleReminderCompletion(...)` - Check off reminder

## Testing the App

### 1. Start the App

```bash
cd expo
npm start
```

### 2. Navigate Through Tabs

- **Programs**: See real programs from database
- **Channels**: See real video channels
- **Resources**: Static resources grid
- **Profile**: Mock user profile

### 3. Test Program Detail

- Tap any program
- View Overview, Videos, Reminders, Chat tabs
- Add a reminder (saves to database)
- Chat sends mock messages

### 4. Test Video Access

- Navigate to Channels tab
- Tap a channel
- Videos locked/unlocked based on tier (mock user has Premium)

## Troubleshooting

### App Won't Start

```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database Connection Error

1. Check `.env` file has correct credentials
2. Verify internet connection
3. Check Supabase project status at https://supabase.com

### Videos Won't Play

- Ensure expo-av is installed: `npx expo install expo-av`
- Test with the sample video URL first
- Check video URL format (must be HTTP/HTTPS)

## Production Checklist

Before deploying to App Store/Play Store:

- [ ] Implement real authentication
- [ ] Add real-time chat
- [ ] Connect RSVP functionality
- [ ] Upload real video content
- [ ] Add error boundaries
- [ ] Implement analytics
- [ ] Add crash reporting (Sentry)
- [ ] Test on physical devices
- [ ] Configure app icons and splash screens
- [ ] Set up push notifications
- [ ] Add deep linking
- [ ] Configure app store listings

## Support

For issues:
1. Check Expo docs: https://docs.expo.dev
2. Check Supabase docs: https://supabase.com/docs
3. Review `/expo/README.md` for detailed setup

---

The Soulworx mobile app is ready to run with real database connectivity!

**Database Status**: ✓ Connected  
**Tables**: ✓ All verified  
**Migrations**: ✓ Applied  
**Environment**: ✓ Configured  

Run `npm start` in the `/expo` folder to begin development.

