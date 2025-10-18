# Authentication Routes - Soulworx

## Auth Routes
- **Sign In**: `/signin` - Main authentication page with OAuth (Google, Discord, Apple)
- **Dashboard**: `/dashboard` - Protected user dashboard (redirects here after auth)
- **Onboarding**: `/onboarding` - New user onboarding flow

## Important Notes
- We use `/signin` NOT `/login` for authentication
- All auth routes are in the `app/(auth)` route group
- Navigation automatically hides on auth pages
- OAuth redirects to `/dashboard` after successful sign in

## Components
- `components/auth/soulworx-login-form.tsx` - Main login form with OAuth buttons
- `components/auth/auth-slideshow.tsx` - Background slideshow for auth pages
- Auth background images: `public/auth/1.jpg`, `public/auth/2.jpg`, `public/auth/3.jpg`

## Auth Providers (configured in auth.ts)
- Google OAuth
- Discord OAuth
- Apple OAuth

All providers redirect to `/dashboard` on successful authentication.

