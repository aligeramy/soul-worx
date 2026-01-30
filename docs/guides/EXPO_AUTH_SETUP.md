# Expo App Authentication Setup

This guide explains how the Expo mobile app handles authentication by redirecting users to the Soulworx website (similar to Spotify's approach).

## Architecture Overview

The Expo app uses **web-based authentication** where:
1. User taps "Sign Up" or "Sign In" in the mobile app
2. App opens an in-app browser to `https://soulworx.com/signup` or `/signin`
3. User completes signup/login on the website
4. Website redirects back to app with auth token via deep link
5. App stores token and uses it for authenticated API requests

## Deep Linking Setup

### 1. Configure Expo Deep Links

In `app.json`:
```json
{
  "expo": {
    "scheme": "soulworx",
    "ios": {
      "bundleIdentifier": "com.soulworx.app"
    },
    "android": {
      "package": "com.soulworx.app"
    }
  }
}
```

### 2. Web Redirect URLs

After successful authentication, the website redirects to:
- **iOS**: `soulworx://auth?token=xxx`
- **Android**: `soulworx://auth?token=xxx`
- **Web fallback**: `https://soulworx.com/auth/callback?token=xxx`

## Implementation Steps

### Step 1: Create Auth Token API Endpoint

Create `/app/api/auth/mobile-token/route.ts` that:
- Validates the session
- Generates a JWT token for mobile app use
- Returns token with expiration

### Step 2: Update Web Signup/Login Pages

Modify `/app/(auth)/signup/page.tsx` and `/app/(auth)/signin/page.tsx` to:
- Detect if request is from mobile app (via query param or user agent)
- After successful auth, redirect to deep link with token
- Format: `soulworx://auth?token=xxx&refreshToken=xxx`

### Step 3: Create Expo Auth Screens

Create mobile screens that:
- Open web browser for signup/login
- Listen for deep link callback
- Store tokens securely (using Expo SecureStore)
- Navigate to app home after successful auth

### Step 4: Create Token Refresh Endpoint

Create `/app/api/auth/refresh/route.ts` for refreshing expired tokens.

## Security Considerations

1. **Token Expiration**: Mobile tokens should expire (e.g., 7 days)
2. **Refresh Tokens**: Store refresh tokens securely for token renewal
3. **Secure Storage**: Use Expo SecureStore for token storage
4. **HTTPS Only**: All API calls must use HTTPS
5. **Token Validation**: Server validates tokens on every request

## User Flow

```
Mobile App                    Website                    API
    |                            |                        |
    |-- Tap "Sign Up"            |                        |
    |-- Open Browser ----------> |                        |
    |                            |-- Show Signup Form     |
    |                            |-- User Fills Form      |
    |                            |-- Submit               |
    |                            |-- Create Account       |
    |                            |-- Generate Token       |
    |<-- Redirect with Token ----|                        |
    |-- Store Token              |                        |
    |-- Close Browser            |                        |
    |-- Navigate to Home         |                        |
    |                            |                        |
    |-- API Request (with token) ------------------------>|
    |                            |                        |-- Validate Token
    |                            |                        |-- Return Data
    |<-- Response ----------------------------------------|
```

## Testing

1. **Development**: Use `exp://localhost:8081` for local testing
2. **Staging**: Use `soulworx-staging://auth` scheme
3. **Production**: Use `soulworx://auth` scheme

## Implementation Status

✅ **Completed:**
1. Mobile token API endpoint (`/api/auth/mobile-token`)
2. Token validation endpoint (`/api/auth/me`)
3. Updated web signup/login forms to detect mobile and redirect with tokens
4. Expo app structure with auth helpers (`expo-app/lib/auth.ts`)
5. API client with automatic token injection (`expo-app/lib/api.ts`)
6. Example auth screen (`expo-app/app/(auth)/signin.tsx`)

## Next Steps

1. **Install Expo dependencies:**
   ```bash
   cd expo-app
   npm install
   ```

2. **Set up environment variables** in `expo-app/.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://soulworx.com/api
   EXPO_PUBLIC_WEB_URL=https://soulworx.com
   EXPO_PUBLIC_DEEP_LINK_SCHEME=soulworx
   ```

3. **Create app screens:**
   - Home screen with personalized programs
   - Program detail screen with checklist
   - Profile screen

4. **Test deep linking:**
   - Run `expo start`
   - Test signup flow on device/simulator
   - Verify deep link redirect works

5. **Handle OAuth redirects:**
   - Update OAuth callback handlers to also redirect mobile users
   - Add mobile detection to OAuth flow

## Testing Deep Links

### iOS Simulator
```bash
xcrun simctl openurl booted "soulworx://auth?token=test&refreshToken=test"
```

### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "soulworx://auth?token=test&refreshToken=test"
```

### Physical Device
- Use Expo Go app
- Scan QR code from `expo start`
- Deep links will work automatically
