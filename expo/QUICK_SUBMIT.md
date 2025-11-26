# Quick Start: Submit to App Store for Internal Testing

## Prerequisites Checklist

- [ ] Apple Developer Account ($99/year)
- [ ] App created in App Store Connect with bundle ID: `com.soulworx.app`
- [ ] EAS CLI installed (✅ you have it)
- [ ] Logged into EAS (✅ you're logged in as `softxinnovations`)

## Quick Commands

### 1. Initialize EAS Project (One-time setup)

```bash
eas init
```

When prompted:
- Create a new project
- Choose your Expo account/organization

This will add the project ID to your config automatically.

### 2. Update Apple Credentials in eas.json

Edit `eas.json` and update the `submit.internal.ios` section:

```json
"internal": {
  "ios": {
    "appleId": "your-apple-id@example.com",
    "ascAppId": "1234567890",
    "appleTeamId": "ABCD123456"
  }
}
```

**Where to find these:**
- `appleId`: Your Apple ID email
- `ascAppId`: App Store Connect → Your App → App Information → Apple ID
- `appleTeamId`: [Apple Developer](https://developer.apple.com/account) → Membership → Team ID

### 3. Build and Submit (One Command)

```bash
eas build --platform ios --profile internal --auto-submit
```

This will:
1. Build your app for App Store distribution (~15 minutes)
2. Automatically submit to App Store Connect
3. Process for TestFlight

### Alternative: Build Then Submit Separately

```bash
# Build first
eas build --platform ios --profile internal

# Then submit (after build completes)
eas submit --platform ios --profile internal
```

## After Submission

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to: **My Apps** → **Soulworx** → **TestFlight**
3. Wait for processing (10-30 minutes)
4. Go to **Internal Testing** section
5. Create/add internal testers group
6. Select your build and enable it for testing

## Troubleshooting

**"EAS project not configured"**
→ Run `eas init` first

**"App not found in App Store Connect"**
→ Create the app in App Store Connect first with bundle ID `com.soulworx.app`

**Build fails**
→ Check logs at [expo.dev](https://expo.dev) → Your Project → Builds

**Submission fails**
→ Verify Apple credentials in `eas.json` are correct

