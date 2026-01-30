# Submitting to App Store for Internal Testing

This guide will help you submit your Expo app to the App Store for internal testing using EAS.

## Prerequisites

1. **Apple Developer Account**: You need an active Apple Developer Program membership ($99/year)
2. **App Store Connect Access**: Your Apple ID must have access to App Store Connect
3. **EAS Account**: You're already logged in as `softxinnovations`

## Step 1: Initialize EAS Project

First, you need to initialize the EAS project. Run:

```bash
eas init
```

When prompted:
- Choose to create a new project (or link to existing if you have one)
- Select your Expo account/organization

## Step 2: Configure App Store Connect

Before building, ensure your app exists in App Store Connect:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to "My Apps" → Click "+" to create a new app
3. Fill in:
   - Platform: iOS
   - Name: Soulworx
   - Primary Language: English (or your preference)
   - Bundle ID: `com.soulworx.app` (must match your app.config.js)
   - SKU: A unique identifier (e.g., `soulworx-001`)
4. Save the app

**Note the App Store Connect App ID** - you'll need this for submission.

## Step 3: Update eas.json with Your Apple Credentials

Edit `eas.json` and update the `submit.internal.ios` section with your actual values:

- `appleId`: Your Apple ID email
- `ascAppId`: The App Store Connect App ID (found in App Store Connect URL or app details)
- `appleTeamId`: Your Apple Team ID (found in Apple Developer account settings)

## Step 4: Build the iOS App

Build the app for App Store distribution:

```bash
eas build --platform ios --profile internal
```

This will:
- Create a production build
- Sign it with your Apple certificates
- Upload it to EAS servers

The build will take 10-20 minutes. You can monitor progress in the terminal or at [expo.dev](https://expo.dev).

## Step 5: Submit to App Store Connect

Once the build completes, submit it to App Store Connect:

```bash
eas submit --platform ios --profile internal
```

This will:
- Upload the build to App Store Connect
- Process it for TestFlight
- Make it available for internal testing

## Step 6: Configure TestFlight Internal Testing

1. Go to App Store Connect → Your App → TestFlight
2. Wait for processing to complete (can take 10-30 minutes)
3. Go to "Internal Testing" section
4. Click "+" to create an internal testing group (or use default "Internal Testers")
5. Add testers (they must be added to your App Store Connect team)
6. Select the build and enable it for testing

## Alternative: One-Step Build and Submit

You can also build and submit in one command:

```bash
eas build --platform ios --profile internal --auto-submit
```

## Troubleshooting

### Missing Certificates
If you get certificate errors, EAS will help you create them. Follow the prompts.

### App Store Connect App Not Found
Make sure:
- The bundle ID matches exactly: `com.soulworx.app`
- The app is created in App Store Connect
- You have the correct App Store Connect App ID

### Build Fails
- Check the build logs at expo.dev
- Ensure all environment variables are set (if needed)
- Verify app.config.js is valid

## Next Steps After Internal Testing

Once internal testing is successful:
1. Fix any issues found
2. Build a new version: `eas build --platform ios --profile production`
3. Submit for App Review: `eas submit --platform ios --profile production`

