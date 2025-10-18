# Soul - Modern Authentication System

A professional authentication system built with **Next.js 15**, **Auth.js**, **React 19**, and **Tailwind CSS**. Features OAuth authentication with Google, Discord, and Apple, complete with user onboarding flow.

## ✨ Features

- 🔐 **OAuth Authentication** - Sign in with Google, Discord, or Apple
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🚀 **Next.js 15** - Latest features including Server Actions
- ⚡ **React 19** - Cutting-edge React features
- 🛡️ **Type Safe** - Full TypeScript support
- 📱 **Responsive** - Mobile-first design
- 🔄 **Onboarding Flow** - Seamless user profile setup
- 🖼️ **OAuth Profile Pictures** - Automatically imported from providers
- 🛣️ **Route Groups** - Organized folder structure with (public), (auth), and (dashboard)

## 📁 Project Structure

```
soul/
├── app/
│   ├── (public)/          # Public pages (landing page)
│   ├── (auth)/            # Authentication pages (sign in)
│   ├── (dashboard)/       # Protected pages (dashboard, onboarding)
│   ├── actions/           # Server actions
│   ├── api/auth/          # Auth.js API routes
│   └── ...
├── components/ui/         # shadcn/ui components
├── lib/                   # Utility functions
├── auth.ts                # Auth.js configuration
├── middleware.ts          # Route protection
└── .env.local.example     # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (e.g., Supabase, Neon, Railway)
- OAuth credentials from Google, Discord, and/or Apple

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd soul
npm install
```

### 2. Set Up Database

This project uses Drizzle ORM with PostgreSQL. You can use any PostgreSQL provider:
- [Supabase](https://supabase.com/) (Free tier available)
- [Neon](https://neon.tech/) (Serverless PostgreSQL)
- [Railway](https://railway.app/) (Easy deployment)
- [Vercel Postgres](https://vercel.com/storage/postgres)

After creating your database, you'll get a connection string. Keep it for the next step.

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Generate an auth secret:

```bash
openssl rand -base64 32
```

Update `.env.local` with your credentials:

```env
AUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/database"

# Add your OAuth credentials
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
DISCORD_CLIENT_ID="..."
DISCORD_CLIENT_SECRET="..."
APPLE_CLIENT_ID="..."
APPLE_CLIENT_SECRET="..."
```

### 4. Push Database Schema

Run the following command to create the database tables:

```bash
npm run db:push
```

This will create all the necessary tables for Auth.js (users, accounts, sessions, etc.).

### 5. Set Up OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

#### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret to `.env.local`

#### Apple OAuth

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/serviceId)
2. Create a Services ID
3. Configure Sign in with Apple
4. Add redirect URI: `http://localhost:3000/api/auth/callback/apple`
5. Copy Service ID and generate a client secret
6. Add to `.env.local`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📖 How It Works

### Authentication Flow

1. **Sign In** - User visits `/signin` and chooses an OAuth provider
2. **OAuth Redirect** - User is redirected to provider for authentication
3. **Callback** - Provider redirects back with authentication data
4. **Profile Check** - System checks if user needs onboarding
5. **Onboarding** - New users complete profile setup at `/onboarding`
6. **Dashboard** - Authenticated users access protected `/dashboard` routes

### Route Protection

The `middleware.ts` file protects routes based on authentication status:

- **Public routes** (`/`) - Accessible to everyone
- **Auth routes** (`/signin`) - Redirect to dashboard if logged in
- **Dashboard routes** (`/dashboard/*`) - Require authentication
- **Onboarding** (`/onboarding`) - Required for new users

### Server Actions

Modern server-side mutations are used for:

- Profile updates (`/app/actions/profile.ts`)
- Sign in/sign out operations
- Form submissions

### Session Management

Auth.js handles sessions with:

- JWT strategy for stateless authentication
- Database persistence via Drizzle adapter
- Automatic session refresh
- Secure cookie management
- Type-safe session data

### Database Schema

The app uses the following tables:

- **users** - User accounts
- **accounts** - OAuth provider connections
- **sessions** - Active user sessions
- **verificationTokens** - Email verification tokens
- **authenticators** - WebAuthn credentials

### Database Commands

```bash
npm run db:generate  # Generate migrations from schema
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🎨 Customization

### Adding New OAuth Providers

1. Install the provider package (if needed)
2. Add provider to `auth.ts`:

```typescript
import NewProvider from "next-auth/providers/newprovider"

providers: [
  // ... existing providers
  NewProvider({
    clientId: process.env.AUTH_NEWPROVIDER_ID,
    clientSecret: process.env.AUTH_NEWPROVIDER_SECRET,
  }),
]
```

3. Add credentials to `.env.local`
4. Add sign-in button to `/app/(auth)/signin/page.tsx`

### Styling

This project uses Tailwind CSS and shadcn/ui components. Customize:

- **Colors**: Edit `app/globals.css` CSS variables
- **Components**: Modify files in `components/ui/`
- **Layout**: Update layout files in route groups

## 🧪 Building for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Update these in your deployment platform:

- Set `NEXTAUTH_URL` to your production domain
- Update OAuth redirect URIs in provider dashboards
- Keep `AUTH_SECRET` secure and unique per environment

## 📚 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **React**: [React 19](https://react.dev/)
- **Authentication**: [Auth.js](https://authjs.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **TypeScript**: Full type safety
- **Icons**: Inline SVG

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
