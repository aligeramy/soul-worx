# Soulworx Mobile App

A luxury mobile experience for the Soulworx platform built with Expo 53 and React Native.

## Features

- **4 Main Tabs**: Programs, Channels, Resources, Profile
- **Program Management**: Browse and join programs, RSVP to events
- **Video Content**: Access tier-based video channels with lock/unlock functionality
- **Reminders**: Create and manage program-specific to-dos
- **Chat**: Real-time chat for program participants (mock implementation)
- **Elegant Design**: Soft beige luxury palette matching the web experience

## Setup Instructions

### 1. Install Dependencies

   ```bash
cd expo
   npm install
   ```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the values:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_DATABASE_URL=your_postgres_connection_string
```

**Important**: You need to set up Supabase to connect to your existing PostgreSQL database:

1. Create a Supabase project at https://supabase.com
2. Go to Project Settings > Database
3. Use the same PostgreSQL database that your Next.js app uses
4. Copy the connection string and API keys to your `.env` file

### 3. Run the App

   ```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Architecture

### Shared Logic

The Expo app connects to the **same PostgreSQL database** as the Next.js web app using Supabase as the client:

- **Database**: Shared PostgreSQL (via Supabase in Expo, Drizzle in Next.js)
- **Types**: Copied from root `lib/db/schema.ts` to `expo/lib/types.ts`
- **Access Control**: Same tier-based video access logic
- **Design System**: Matching Soulworx brand colors and components

### Key Directories

```
expo/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── programs.tsx   # Programs list
│   │   ├── channels.tsx   # Video channels hub
│   │   ├── resources.tsx  # Resources grid
│   │   └── profile.tsx    # User profile
│   ├── program/[id]/      # Program detail with nested tabs
│   │   ├── overview.tsx   # Program info
│   │   ├── videos.tsx     # Program videos
│   │   ├── reminders.tsx  # To-do checklist
│   │   └── chat.tsx       # Program chat
│   ├── channel/[slug].tsx # Channel detail
│   └── video/[id].tsx     # Video player
├── components/            # Reusable UI components
├── hooks/                 # Data fetching hooks
├── lib/                   # Supabase client, queries, utilities
├── constants/             # Colors, theme, images
└── contexts/              # User context (mock auth)

## Design System

### Colors
- **Beige**: `#F5F1E8` (background)
- **Gold**: `#D4AF37` (primary accent)
- **Charcoal**: `#2C2C2C` (text)
- **White**: `#FFFFFF` (cards)

### Typography
- **Headers**: 28-48px, bold
- **Body**: 14-16px, regular
- **Captions**: 12-14px

### Spacing
- **Base**: 8px increments (8, 16, 24, 32, 48, 64)

### Border Radius
- **Cards**: 24-32px
- **Buttons**: 8-16px

## Authentication

Currently using **mock authentication** for development:

```typescript
// Mock user in contexts/UserContext.tsx
const MOCK_USER = {
  id: 'mock-user-1',
  name: 'Test User',
  email: 'test@soulworx.com',
  tier: 2, // Premium access
};
```

To implement real authentication:
1. Add Supabase Auth to `lib/supabase.ts`
2. Replace `UserContext` with real auth flow
3. Add sign-in/sign-up screens

## Database Tables Used

The app queries these tables from your PostgreSQL database:

- `program` - Programs list
- `event` - Program events
- `rsvp` - User enrollments
- `community_channel` - Video channels
- `video` - Channel videos
- `membership_tier` - User tiers
- `user_membership` - User subscriptions
- `program_reminder` - User to-dos per program

### New Table Required

Create this table for the reminders feature:

```sql
CREATE TABLE program_reminder (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id TEXT REFERENCES program(id),
  user_id TEXT REFERENCES "user"(id),
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Key Features

### Tier-Based Access

Videos and channels are locked/unlocked based on user's membership tier:

- **Tier 1 (Free)**: First episode of each channel
- **Tier 2 (Premium)**: All videos
- **Tier 3 (VIP)**: All videos + DM access

The access logic is shared with the web app:

```typescript
export function canAccessVideo(video: Video, userTierLevel: number): boolean {
  if (video.isFirstEpisode) return true;
  return userTierLevel >= video.requiredTierLevel;
}
```

### Program Flow

1. User browses programs in **Programs** tab
2. Taps program to see details
3. Joins program (creates RSVP)
4. Accesses program tabs: Overview, Videos, Reminders, Chat
5. Can add reminders and chat with other members

### Video Flow

1. User browses channels in **Channels** tab
2. Taps channel to see video list
3. Locked videos show lock overlay with tier requirement
4. Unlocked videos play in video player

## Mock Data

The app includes mock data for demonstration:

- **Mock User**: Pre-configured user with Premium tier access
- **Mock Chat**: Sample chat messages in program chat
- **Mock Videos**: Sample videos with different tier requirements

Replace with real data by connecting to your Supabase database.

## Customization

### Update Images

Replace placeholder images in `constants/images.ts`:

```typescript
export const Images = {
  logo: require('./assets/images/logo.png'),
  quickNav: {
    poetry: require('./assets/images/poetry.jpg'),
    // ... etc
  },
};
```

Copy images from root `/public` folder to `expo/assets/images/`.

### Update Colors

Modify `constants/colors.ts` to adjust the brand palette.

### Update API URL

If hosting the web app, you can also create API endpoints and call them from the Expo app instead of using Supabase directly.

## Troubleshooting

### Supabase Connection Issues

If you get connection errors:
1. Check your `.env` file has correct Supabase credentials
2. Verify Supabase project is pointing to correct database
3. Check database connection string format

### Video Player Issues

If videos don't play:
1. Ensure `expo-av` is installed
2. Test with the sample video URL first
3. Check video URL format (must be accessible via HTTP/HTTPS)

### Navigation Issues

If routes don't work:
1. Clear Metro bundler cache: `npx expo start -c`
2. Restart the development server
3. Check route names match file structure

## Production Deployment

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

See [Expo EAS docs](https://docs.expo.dev/eas/) for complete deployment guide.

## Tech Stack

- **Expo 53** - React Native framework
- **Expo Router** - File-based routing
- **Supabase** - Database client
- **Expo AV** - Video playback
- **React Navigation** - Tab and stack navigation
- **TypeScript** - Type safety

## Support

For issues or questions:
1. Check Expo docs: https://docs.expo.dev
2. Check Supabase docs: https://supabase.com/docs
3. Review the plan in `/expo-s.plan.md`

---

Built with luxury and care for the Soulworx community.
