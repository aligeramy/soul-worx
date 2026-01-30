# Google Calendar & Meet Setup Guide

This guide will help you set up Google Calendar API and Google Meet integration for coach call bookings.

## Prerequisites

- Google Cloud account
- Access to Google Calendar
- (Optional) [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) installed and authenticated

## Quick Reference: Complete CLI Setup

If you're familiar with gcloud CLI, here's the complete setup in one go:

```bash
# 1. Authenticate (if not already done)
gcloud auth login

# 2. Create project
gcloud projects create soulworx --name="Soulworx"
gcloud config set project soulworx

# 3. Enable Calendar API
gcloud services enable calendar-json.googleapis.com

# 4. Create service account
gcloud iam service-accounts create soulworx-calendar \
  --display-name="Soulworx Calendar Service Account" \
  --description="Service account for coach call calendar bookings"

# 5. Generate key and get email
SERVICE_ACCOUNT_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:soulworx-calendar" \
  --format="value(email)")

gcloud iam service-accounts keys create soulworx-calendar-key.json \
  --iam-account=$SERVICE_ACCOUNT_EMAIL

# 6. Extract values for .env (requires jq)
echo "Service Account Email: $SERVICE_ACCOUNT_EMAIL"
echo "GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=$SERVICE_ACCOUNT_EMAIL" >> .env
echo "GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY='$(cat soulworx-calendar-key.json | jq -c .)'" >> .env
echo "GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com" >> .env

# 7. Share calendar manually (see Step 7 below)
echo "Now share your calendar with: $SERVICE_ACCOUNT_EMAIL"
```

## Setup Methods

You can set up Google Calendar integration using either:
- **Method A: Google Cloud CLI** (recommended, faster and automatable)
- **Method B: Web Console** (manual, step-by-step)

---

## Method A: Using Google Cloud CLI (Recommended)

### Step 1: Install and Authenticate gcloud CLI

If you haven't already:

```bash
# Install gcloud CLI (if not installed)
# macOS:
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set default account (if you have multiple)
gcloud config set account YOUR_EMAIL@gmail.com
```

### Step 2: Create or Select Project

```bash
# Create a new project
gcloud projects create soulworx --name="Soulworx"

# Or use an existing project
gcloud config set project YOUR_PROJECT_ID

# Set the project as default
gcloud config set project soulworx
```

### Step 3: Enable Google Calendar API

```bash
# Enable Calendar API (Google Meet is included automatically)
gcloud services enable calendar-json.googleapis.com
```

### Step 4: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create soulworx-calendar \
  --display-name="Soulworx Calendar Service Account" \
  --description="Service account for coach call calendar bookings"
```

### Step 5: Generate Service Account Key

```bash
# Get the service account email (you'll need this later)
SERVICE_ACCOUNT_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:soulworx-calendar" \
  --format="value(email)")

echo "Service Account Email: $SERVICE_ACCOUNT_EMAIL"

# Generate and download JSON key
gcloud iam service-accounts keys create soulworx-calendar-key.json \
  --iam-account=$SERVICE_ACCOUNT_EMAIL

# Display the key file location
echo "Key saved to: $(pwd)/soulworx-calendar-key.json"
```

**Important**: 
- The JSON key file contains sensitive credentials - keep it secure!
- Add `soulworx-calendar-key.json` to your `.gitignore` if you haven't already

### Step 6: Get Service Account Email

```bash
# Get the service account email for calendar sharing
gcloud iam service-accounts list \
  --filter="displayName:soulworx-calendar" \
  --format="value(email)"
```

Copy this email - you'll need it in Step 7.

---

## Method B: Using Web Console (Manual)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Soulworx" (or your preferred name)
4. Click "Create"

### Step 2: Enable APIs

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and click "Enable"
4. Google Meet is automatically included with Calendar API, no separate API needed

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: `soulworx-calendar`
   - Service account ID: `soulworx-calendar` (auto-generated)
   - Description: "Service account for coach call calendar bookings"
4. Click "Create and Continue"
5. Skip "Grant this service account access to project" (optional)
6. Click "Done"

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create" - this will download a JSON file
6. **IMPORTANT**: Keep this file secure! It contains sensitive credentials.

---

## Step 7: Grant Calendar Permissions (Both Methods)

**Note**: Calendar sharing must be done manually through the Google Calendar web interface. The gcloud CLI cannot automate this step.

1. Get your service account email:
   - **CLI Method**: Use the email from Step 6 above
   - **Web Console Method**: Open the downloaded JSON file and copy the `client_email` value (e.g., `soulworx-calendar@project-id.iam.gserviceaccount.com`)

2. Open Google Calendar
3. Go to Settings → "Settings for my calendars"
4. Select the calendar you want to use for coach calls (or create a new one)
5. Scroll down to "Share with specific people"
6. Click "Add people"
7. Paste the service account email
8. Set permission to "Make changes to events"
9. Click "Send"

## Step 8: Get Calendar ID

1. In Google Calendar settings, scroll to "Integrate calendar"
2. Find "Calendar ID" - it will look like: `your-calendar-id@group.calendar.google.com`
3. Copy this value

## Step 9: Add to Environment Variables

Add these to your `.env` file:

### Option 1: Using JSON Key File (CLI Method)

If you used the CLI method and have `soulworx-calendar-key.json`:

```bash
# Extract values from JSON file
SERVICE_ACCOUNT_EMAIL=$(cat soulworx-calendar-key.json | jq -r '.client_email')
SERVICE_ACCOUNT_KEY=$(cat soulworx-calendar-key.json | jq -c '.')

# Add to .env file
echo "GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=$SERVICE_ACCOUNT_EMAIL" >> .env
echo "GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY='$SERVICE_ACCOUNT_KEY'" >> .env
echo "GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com" >> .env
```

### Option 2: Manual Entry

Add these to your `.env` file manually:

```env
# Google Calendar & Meet
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

**Important Notes:**
- `GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY` should be the **entire JSON file content as a single-line string**
- You can escape it or use a JSON minifier to make it a single line
- If using the CLI method with `jq`, the JSON will be properly formatted
- **Never commit the JSON key file or these credentials to git**

## Step 10: Verify Setup (CLI Method)

If you used the CLI method, verify your setup:

```bash
# Verify project is set
gcloud config get-value project

# Verify Calendar API is enabled
gcloud services list --enabled | grep calendar

# Verify service account exists
gcloud iam service-accounts list --filter="displayName:soulworx-calendar"

# Verify key file exists and is valid JSON
cat soulworx-calendar-key.json | jq '.client_email'
```

## Step 11: Test the Integration

1. Restart your development server
2. Try booking a coach call as a Pro+ user
3. Check your Google Calendar - you should see the event with a Google Meet link

## Troubleshooting

### CLI-Specific Issues

**Error: "Project not found"**
```bash
# List all projects
gcloud projects list

# Set the correct project
gcloud config set project YOUR_PROJECT_ID
```

**Error: "Permission denied"**
```bash
# Check your current account
gcloud auth list

# Re-authenticate if needed
gcloud auth login
```

**Error: "API not enabled"**
```bash
# Enable the API explicitly
gcloud services enable calendar-json.googleapis.com

# Verify it's enabled
gcloud services list --enabled | grep calendar
```

### General Issues

### Error: "Google Calendar credentials not configured"
- Make sure all three environment variables are set
- Check that the JSON key is properly formatted

### Error: "Calendar not found" or "Insufficient permissions"
- Verify the service account email has "Make changes to events" permission on the calendar
- Double-check the Calendar ID is correct

### Error: "Invalid credentials"
- Regenerate the service account key
- Make sure the JSON is valid and properly escaped in .env

## Security Notes

- Never commit the service account JSON key to git
- Add `*.json` (service account keys) to `.gitignore`
- Rotate keys periodically
- Use environment variables, never hardcode credentials
