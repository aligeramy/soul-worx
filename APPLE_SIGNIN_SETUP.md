# Complete Apple Sign In Setup Guide

This guide walks you through setting up Sign in with Apple from scratch for your Next.js application.

## Prerequisites

- Apple Developer Account (paid membership required)
- Access to your application's deployment environment (Vercel, etc.)
- Your domain(s) ready for configuration

---

## Part 1: Apple Developer Console Setup

### Step 1: Create an App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** in the sidebar
4. Click the **+** button (top left)
5. Select **App IDs** → Click **Continue**
6. Select **App** → Click **Continue**
7. Fill in the details:
   - **Description**: `Soulworx App`
   - **Bundle ID**: Choose **Explicit** and enter: `com.softx.soulworx.web`
8. Scroll down and check **Sign In with Apple**
9. Click **Continue** → **Register**

**Note**: Save your App ID: `com.softx.soulworx.web`

---

### Step 2: Create a Service ID (Required for Web)

1. In **Identifiers**, click the **+** button again
2. Select **Services IDs** → Click **Continue**
3. Fill in the details:
   - **Description**: `Soulworx Web Service`
   - **Identifier**: `com.softx.soulworx` (this will be your CLIENT_ID)
4. Click **Continue** → **Register**

**Important**: The Service ID is what you'll use as your `APPLE_CLIENT_ID` in your environment variables.

---

### Step 3: Configure the Service ID

1. Click on your newly created Service ID (`com.softx.soulworx`)
2. Check the box next to **Sign In with Apple**
3. Click **Configure** button next to Sign In with Apple
4. In the configuration modal:

   **Primary App ID**: Select `com.softx.soulworx.web` (your App ID from Step 1)

   **Website URLs**:
   
   **Domains and Subdomains**: Enter your domains WITHOUT `http://` or `https://`:
   ```
   localhost, beta.soulworx.ca, soulworx.ca
   ```
   
   **Return URLs**: Enter FULL URLs including protocol:
   ```
   http://localhost:3000/api/auth/callback/apple, https://beta.soulworx.ca/api/auth/callback/apple, https://soulworx.ca/api/auth/callback/apple
   ```

5. Click **Next** → **Done**
6. Click **Continue** (top right)
7. Click **Save** (top right)

**Wait 5-10 minutes for changes to propagate.**

---

### Step 4: Create a Sign In Key

1. In the sidebar, click **Keys**
2. Click the **+** button
3. Fill in the details:
   - **Key Name**: `Soulworx Sign In Key`
4. Check **Sign In with Apple**
5. Click **Configure** next to Sign In with Apple
6. Select your **Primary App ID**: `com.softx.soulworx.web`
7. Click **Save** (in the modal)
8. Click **Continue**
9. Click **Register**
10. **IMPORTANT**: Download the `.p8` file now - you can only download it once!
    - The file will be named something like: `AuthKey_XXXXXXXXXX.p8`
    - Save it securely in your project root

11. Note the **Key ID** (e.g., `W838JBXCVM`) - you'll need this

---

### Step 5: Get Your Team ID

1. Go to **Membership** in the sidebar
2. Find your **Team ID** (e.g., `23MN72U7PA`)
3. Note this down

---

## Part 2: Project Configuration

### Step 6: Place the Key File

1. Copy your downloaded `.p8` file to your project root:
   ```bash
   /Users/realeyes/Desktop/soul/AuthKey_XXXXXXXXXX.p8
   ```

2. **DO NOT** commit this file to git. Add to `.gitignore`:
   ```
   AuthKey_*.p8
   ```

---

### Step 7: Generate Client Secret

Your client secret generator script is already set up. Update the configuration:

1. Edit `scripts/generate-apple-secret.ts`:
   ```typescript
   const TEAM_ID = '23MN72U7PA';           // Your Team ID from Step 5
   const KEY_ID = 'W838JBXCVM';             // Your Key ID from Step 4
   const CLIENT_ID = 'com.softx.soulworx';  // Your Service ID from Step 2
   const PRIVATE_KEY_PATH = join(process.cwd(), 'AuthKey_W838JBXCVM.p8'); // Your .p8 file
   ```

2. Run the generator:
   ```bash
   pnpm exec tsx scripts/generate-apple-secret.ts
   ```

3. Copy the generated client secret (long JWT string)

---

### Step 8: Configure Environment Variables

#### Local Development (`.env`)

```bash
# Apple OAuth
APPLE_TEAM_ID=23MN72U7PA
APPLE_KEY_ID=W838JBXCVM
APPLE_CLIENT_ID=com.softx.soulworx
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgw+f+sF6LqStB3Ycm
j/v8laURC2lQMGhLj8dUvng2XdKgCgYIKoZIzj0DAQehRANCAAQRgzdGAcfkZVH2
7fztZTfHoLPlVcnRuVPIM0VVNolWkB/Gzbb/HDHZoY+2IeOUV0L8QMDC3KA4WmBv
77g2FN25
-----END PRIVATE KEY-----"
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsImtpZCI6Ilc4MzhKQlhDVk0iLCJ0eXAiOiJKV1QifQ...
```

#### Production (Vercel)

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `APPLE_TEAM_ID` = `23MN72U7PA`
   - `APPLE_KEY_ID` = `W838JBXCVM`
   - `APPLE_CLIENT_ID` = `com.softx.soulworx`
   - `APPLE_PRIVATE_KEY` = (paste the full private key with quotes)
   - `APPLE_CLIENT_SECRET` = (paste the generated JWT)

4. Make sure these are set for all environments (Production, Preview, Development)

---

### Step 9: Verify NextAuth Configuration

Your `auth.ts` should have:

```typescript
import Apple from "next-auth/providers/apple"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
    // ... other providers
  ],
  // ... rest of config
})
```

---

## Part 3: Testing

### Step 10: Test Locally

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/signin`

3. Click "Continue with Apple"

4. You should be redirected to Apple's login page

5. Sign in with your Apple ID

6. After approval, you should be redirected back to `/dashboard`

---

### Step 11: Deploy and Test Production

1. Commit your changes (except `.p8` file)
   ```bash
   git add .
   git commit -m "Add Apple Sign In"
   git push
   ```

2. Vercel will auto-deploy

3. Wait for deployment to complete

4. Test on `https://beta.soulworx.ca/signin`

---

## Troubleshooting

### Error: `invalid_client`

**Cause**: Apple doesn't recognize your Client ID or configuration.

**Solutions**:
1. Verify Service ID (`com.softx.soulworx`) is created and configured
2. Ensure Sign In with Apple is enabled on the Service ID
3. Check that domains and return URLs are exactly correct
4. Wait 5-10 minutes for Apple changes to propagate
5. Verify environment variables in production match exactly

---

### Error: `invalid_request`

**Cause**: Client secret is malformed or expired.

**Solutions**:
1. Regenerate client secret using the script
2. Verify the JWT is valid (should be 3 parts separated by dots)
3. Check that Key ID matches your downloaded key
4. Ensure client secret hasn't expired (max 180 days)

---

### Error: Redirect to `/api/auth/error` after successful login

**Cause**: Callback processing failed (database, adapter, or missing data).

**Solutions**:
1. Check Vercel logs for detailed error
2. Verify database connection strings are correct
3. Ensure `DATABASE_URL` and `DIRECT_URL` are set
4. Check if user table/schema supports Apple OAuth
5. Apple may not return email on subsequent logins (this is normal)

---

### Error: `redirect_uri_mismatch`

**Cause**: Return URL doesn't match what's configured in Apple.

**Solutions**:
1. Verify exact match in Apple Developer Console:
   - `http://localhost:3000/api/auth/callback/apple` (local)
   - `https://beta.soulworx.ca/api/auth/callback/apple` (staging)
   - `https://soulworx.ca/api/auth/callback/apple` (production)
2. Check for trailing slashes (shouldn't have any)
3. Verify domain is listed in "Domains and Subdomains"

---

## Configuration Checklist

Before going live, verify:

- [ ] App ID created (`com.softx.soulworx.web`)
- [ ] Service ID created and configured (`com.softx.soulworx`)
- [ ] Sign In with Apple enabled on Service ID
- [ ] Domains added (localhost, beta, production)
- [ ] Return URLs added for all environments
- [ ] Sign In Key created and `.p8` file downloaded
- [ ] Team ID noted
- [ ] Key ID noted
- [ ] Client secret generated and not expired
- [ ] All environment variables set locally
- [ ] All environment variables set in Vercel
- [ ] `.p8` file added to `.gitignore`
- [ ] Tested locally
- [ ] Tested on staging
- [ ] Tested on production

---

## Important Notes

1. **Client Secret Expiration**: Client secrets expire after 180 days (maximum). Set a reminder to regenerate before expiration.

2. **Private Key Security**: Never commit your `.p8` file to version control. If compromised, revoke it immediately and create a new one.

3. **Email Privacy**: Users can choose to hide their email with Apple Sign In. Your app should handle cases where email is not provided or is an Apple relay address (`privaterelay.appleid.com`).

4. **First vs Subsequent Logins**: Apple only returns user name and email on the first login. Store this data immediately. Subsequent logins may only return the user identifier.

5. **Testing**: Apple provides a sandbox environment. Test thoroughly before production release.

---

## Key Identifiers Reference

For easy reference, keep these handy:

```
Team ID:        23MN72U7PA
Key ID:         W838JBXCVM
App ID:         com.softx.soulworx.web
Service ID:     com.softx.soulworx (CLIENT_ID)
Key File:       AuthKey_W838JBXCVM.p8

Domains:
  - localhost
  - beta.soulworx.ca
  - soulworx.ca

Return URLs:
  - http://localhost:3000/api/auth/callback/apple
  - https://beta.soulworx.ca/api/auth/callback/apple
  - https://soulworx.ca/api/auth/callback/apple
```

---

## Regenerating Client Secret

When your client secret expires or needs regeneration:

```bash
# Update the script with your current IDs
# Then run:
pnpm exec tsx scripts/generate-apple-secret.ts

# Copy the output and update:
# 1. .env locally
# 2. Vercel environment variables
# 3. Redeploy
```

---

## Support Resources

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [NextAuth.js Apple Provider](https://next-auth.js.org/providers/apple)
- [Creating a Client Secret](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)

---

**Last Updated**: October 24, 2025

