#!/bin/bash

# Script to submit Expo app to App Store for internal testing
# Run this script from the project root directory

set -e

echo "🚀 Starting App Store submission process for internal testing..."
echo ""

# Step 1: Initialize EAS project (if not already done)
echo "Step 1: Checking EAS project configuration..."
if ! eas project:info &>/dev/null; then
    echo "⚠️  EAS project not initialized. Please run: eas init"
    echo "   This will prompt you to create or link a project."
    exit 1
fi

echo "✅ EAS project configured"
echo ""

# Step 2: Build for App Store
echo "Step 2: Building iOS app for App Store distribution..."
echo "   This will take 10-20 minutes..."
eas build --platform ios --profile internal

echo ""
echo "✅ Build completed!"
echo ""

# Step 3: Submit to App Store Connect
echo "Step 3: Submitting to App Store Connect..."
echo "   Make sure you've updated eas.json with your Apple credentials:"
echo "   - appleId"
echo "   - ascAppId (App Store Connect App ID)"
echo "   - appleTeamId"
echo ""

read -p "Have you updated eas.json with your Apple credentials? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Please update eas.json first, then run this script again."
    exit 1
fi

eas submit --platform ios --profile internal

echo ""
echo "✅ Submission completed!"
echo ""
echo "Next steps:"
echo "1. Go to App Store Connect: https://appstoreconnect.apple.com"
echo "2. Navigate to your app → TestFlight"
echo "3. Wait for processing (10-30 minutes)"
echo "4. Set up internal testing group and add testers"
echo "5. Enable the build for internal testing"
echo ""

