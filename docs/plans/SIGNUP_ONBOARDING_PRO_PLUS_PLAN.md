# Signup, Onboarding & Pro+ Personalized Programs - Complete Implementation Plan

## Overview
This document outlines the complete implementation plan for a dynamic signup/onboarding flow with tier selection, Pro+ personalized programs, calendar booking, and Google Meet integration for both Next.js web app and Expo mobile app.

---

## Phase 1: Database Schema Updates

### 1.1 User Profile Extensions
- [x] Add `username` field to `user` table (unique, indexed)
- [x] Add `password` field to `user` table (hashed, nullable for OAuth users)
- [x] Add `onboardingCompleted` boolean to `user` table
- [x] Add `onboardingData` jsonb field to `user` table (stores all onboarding answers)
- [x] Add `primaryInterest` field to `user` table (sports_basketball, poetry_arts, life_coaching)
- [x] Add `age` field to `user` table (integer, nullable)
- [x] Add `pushToken` field to `user` table (for Expo push notifications)

### 1.2 Membership Tiers Restructure
- [x] Update `membership_tier` table:
  - [x] Rename tiers: `free` → Free, `premium` → Pro ($20/mo), `vip` → Pro+ ($25/mo)
  - [ ] Update `stripePriceId` for Pro tier (create new $20/mo price in Stripe) - **TODO: Create Stripe prices**
  - [ ] Update `stripePriceId` for Pro+ tier (create new $25/mo price in Stripe) - **TODO: Create Stripe prices**
  - [x] Add `features` jsonb array with detailed feature list per tier
  - [x] Add `interestType` field (null for all, or specific to basketball/poetry/etc)

### 1.3 Pro+ Questionnaire Data
- [x] Create `pro_plus_questionnaire` table:
  - [ ] `id` (uuid, primary key)
  - [ ] `userId` (foreign key to user)
  - [ ] `age` (integer)
  - [ ] `skillLevel` (text: beginner, advanced, pro)
  - [ ] `gameDescription` (text)
  - [ ] `position` (text: PG, SG, SF, PF, C)
  - [ ] `yearsPlaying` (text)
  - [ ] `currentGoalsYearly` (text)
  - [ ] `currentGoalsOverall` (text)
  - [ ] `improvementRankings` (jsonb: {ballHandling: 1-5, defence: 1-5, finishing: 1-5, shooting: 1-5, passing: 1-5, other: {text: string, rank: 1-5}})
  - [ ] `weight` (decimal)
  - [ ] `height` (text)
  - [ ] `currentInjuries` (text, nullable)
  - [ ] `seeingPhysiotherapy` (boolean)
  - [ ] `weightTrains` (boolean)
  - [ ] `stretches` (boolean)
  - [ ] `currentTeam` (text: No Team, Elementary, Middle School, Highschool, College, Pro)
  - [ ] `outsideSchoolTeams` (text: AAU, Prep, No team)
  - [ ] `inSeason` (boolean)
  - [ ] `basketballWatching` (text: Your own film, NBA/Pro/College, Both, None)
  - [ ] `equipmentAccess` (text: Full gym, Half gym, Driveway, Park)
  - [ ] `trainingDays` (jsonb array: ["Monday", "Wednesday", "Friday"])
  - [ ] `averageSessionLength` (integer: 30, 45, 60)
  - [ ] `biggestStruggle` (text)
  - [ ] `confidenceLevel` (integer: 1-5)
  - [ ] `mentalChallenge` (text: Fear of failure, Consistency, Pressure, Motivation, Other)
  - [ ] `mentalChallengeOther` (text, nullable)
  - [ ] `coachability` (integer: 1-5)
  - [ ] `preferredCoachingStyle` (text: Direct, Encouraging, Accountability, Driven, Mix, Other)
  - [ ] `coachingStyleOther` (text, nullable)
  - [ ] `gameFilmUrl` (text, nullable) - Link to uploaded video
  - [ ] `workoutVideos` (jsonb array of video URLs)
  - [x] `completedAt` (timestamp)
  - [x] `createdAt` (timestamp)
  - [x] `updatedAt` (timestamp)

### 1.4 Coach Call Booking System
- [x] Create `coach_calls` table:
  - [ ] `id` (uuid, primary key)
  - [ ] `userId` (foreign key to user)
  - [ ] `adminId` (foreign key to user, nullable - assigned admin)
  - [ ] `scheduledAt` (timestamp) - Date and time of call
  - [ ] `duration` (integer, default 60) - Minutes
  - [ ] `status` (text: scheduled, completed, cancelled, rescheduled)
  - [ ] `googleMeetLink` (text) - Generated meeting URL
  - [ ] `meetingId` (text) - Google Calendar event ID
  - [ ] `questionnaireCompleted` (boolean, default false)
  - [ ] `videoUploaded` (boolean, default false)
  - [ ] `notes` (text, nullable) - Admin notes after call
  - [x] `createdAt` (timestamp)
  - [x] `updatedAt` (timestamp)
  - [x] Unique constraint on `scheduledAt` date (only 1 appointment per day) - **Using uniqueIndex on DATE()**

### 1.5 Personalized Programs
- [x] Create `personalized_programs` table:
  - [ ] `id` (uuid, primary key)
  - [ ] `userId` (foreign key to user) - Pro+ user
  - [ ] `createdBy` (foreign key to user) - Admin who created it
  - [ ] `title` (text)
  - [ ] `description` (text)
  - [ ] `videoUrl` (text) - Uploaded training video
  - [ ] `thumbnailUrl` (text, nullable)
  - [ ] `trainingDays` (jsonb array: ["Monday", "Wednesday"])
  - [ ] `startDate` (date)
  - [ ] `endDate` (date)
  - [ ] `status` (text: active, completed, paused)
  - [x] `createdAt` (timestamp)
  - [x] `updatedAt` (timestamp)

### 1.6 Program Checklists & Completion Tracking
- [x] Create `program_checklist_items` table:
  - [ ] `id` (uuid, primary key)
  - [ ] `programId` (foreign key to personalized_programs)
  - [ ] `dueDate` (date) - Specific date this workout is due
  - [ ] `completed` (boolean, default false)
  - [ ] `completedAt` (timestamp, nullable) - When user checked it off
  - [ ] `enjoymentRating` (integer, nullable, 1-5)
  - [ ] `difficultyRating` (integer, nullable, 1-5)
  - [ ] `daysLate` (integer, default 0) - Calculated: completedAt - dueDate
  - [x] `createdAt` (timestamp)
  - [x] `updatedAt` (timestamp)
  - [x] Unique constraint on (programId, dueDate) - **Using uniqueIndex**

### 1.7 Video Uploads
- [x] Create `user_video_uploads` table:
  - [ ] `id` (uuid, primary key)
  - [ ] `userId` (foreign key to user)
  - [ ] `type` (text: questionnaire_game_film, questionnaire_workout, program_workout)
  - [ ] `relatedId` (text, nullable) - ID of related questionnaire/program
  - [ ] `videoUrl` (text) - Vercel Blob Storage URL
  - [ ] `thumbnailUrl` (text, nullable)
  - [x] `uploadedAt` (timestamp)
  - [x] `createdAt` (timestamp)

### 1.8 Apply Database Migration
- [x] Generate migration file (`0007_add_onboarding_tables.sql`)
- [x] Apply migration to Supabase database (via Supabase MCP)
- [x] Verify all tables created successfully

---

## Phase 2: Authentication & Signup Flow

### 2.1 Signup Page (Web & Expo)
- [x] Create `/signup` page (web)
- [ ] Create signup screen (Expo) - **TODO: Expo app**
- [x] Form fields:
  - [x] Email (required, validated)
  - [x] Name (required)
  - [x] Password (required, min 8 chars, show/hide toggle)
  - [x] Username (required, unique check, @username format)
  - [x] Confirm password (required, must match)
- [x] Real-time username availability check (debounced API call)
- [x] Password strength indicator
- [x] Terms & conditions checkbox (in OAuth section)
- [x] "Sign up" button (disabled until all fields valid)
- [x] Link to sign in page
- [x] Error handling and display

### 2.2 Password Authentication
- [x] Update `auth.ts` to support credentials provider
- [x] Add password hashing (bcryptjs)
- [x] Create `/api/auth/signup` endpoint:
  - [x] Validate all fields
  - [x] Check username uniqueness
  - [x] Check email uniqueness
  - [x] Hash password
  - [x] Create user account
  - [x] Auto sign-in after signup
  - [x] Return success
- [x] Create `/api/auth/check-username` endpoint for real-time checking
- [x] Update sign-in page to support email/password
- [x] Keep OAuth providers (Google, Discord, Apple) working

### 2.3 Onboarding Flow - Step 1: Interest Selection
- [x] Create `/onboarding/interest` page (web)
- [ ] Create onboarding interest screen (Expo) - **TODO: Expo app**
- [x] Show 3 large cards with icons:
  - [x] Sports / Basketball (basketball icon)
  - [x] Poetry / The Arts (pen/art icon)
  - [x] Life Coaching / Assistance (coaching icon)
- [x] User selects one
- [x] Save to `user.primaryInterest`
- [x] Navigate to next step
- [x] Create `/api/onboarding/interest` endpoint

### 2.4 Onboarding Flow - Step 2: Basic Questions
- [x] Create `/onboarding/questions` page (web)
- [ ] Create onboarding questions screen (Expo) - **TODO: Expo app**
- [x] Dynamic questions based on interest:
  - [x] **All interests**: Age (number input)
  - [x] **All interests**: "What do you hope to accomplish?" (text area, optional)
- [x] Save answers to `user.onboardingData` jsonb
- [x] Update `user.age` field
- [x] Show progress indicator (Step 2 of 3 or 4)
- [x] Create `/api/onboarding/questions` endpoint
- [x] Create `/api/onboarding/user-data` endpoint

### 2.5 Onboarding Flow - Step 3: Tier Selection (Basketball Only)
- [x] Create `/onboarding/tiers` page (web) - Only show if basketball selected
- [ ] Create onboarding tiers screen (Expo) - **TODO: Expo app**
- [x] Display 3 tier cards with features:

#### Free Tier Card
- [x] Icon: Unlock/open lock
- [x] Title: "Free"
- [x] Features list:
  - [x] First 2 videos
  - [x] Rotate per month
  - [x] Journal
  - [x] Public Discord channel
- [x] "Get Started" button

#### Pro Tier Card ($20/month)
- [x] Icon: Star/Pro badge
- [x] Title: "Pro"
- [x] Price: "$20/month"
- [x] Features list:
  - [x] Access to all videos right away
  - [x] 1-2 specific programs per month (Not tailored to player, just general)
  - [x] Soulworx AI assistant
  - [x] Journal
  - [x] Discord Community (VIP + public)
- [x] "Get Started" button (triggers Stripe checkout) - **TODO: Stripe integration**

#### Pro+ Tier Card ($25/month)
- [x] Icon: Crown/VIP badge (using Sparkles icon)
- [x] Title: "Pro+"
- [x] Price: "$25/month"
- [x] Features list:
  - [x] Access to all videos right away
  - [x] Ability to upload videos for review and coaching
  - [x] Personalized programs
  - [x] 1-2 specific programs per month (Not tailored to player, just general)
  - [x] Soulworx AI assistant
  - [x] Journal
  - [x] Discord Community (private channel + VIP + public)
- [x] "Get Started" button (triggers Stripe checkout) - **TODO: Stripe integration**

- [x] If Free selected: Complete onboarding, redirect to dashboard
- [ ] If Pro/Pro+ selected: Create Stripe checkout session, redirect to Stripe - **TODO: Stripe integration**
- [x] After Pro+ selection: Continue to Pro+ questionnaire
- [x] Create `/api/onboarding/tier` endpoint

### 2.6 Onboarding Flow - Step 4: Pro+ Questionnaire (Pro+ Only)
- [ ] Create `/onboarding/pro-plus-questionnaire` page (web)
- [ ] Create pro+ questionnaire screen (Expo)
- [ ] Multi-step form with sections:

#### Section 1: Basic Info
- [ ] Age (pre-filled from Step 2, editable)
- [ ] Skill level: Radio buttons (Beginner, Advanced, Pro)
- [ ] Describe what your game is like (text area)

#### Section 2: Position & Experience
- [ ] Position: Select/Picker (PG, SG, SF, PF, C)
- [ ] Years playing basketball or other sports (text input)

#### Section 3: Goals
- [ ] Current goals - Yearly (text area)
- [ ] Current goals - Overall (text area)

#### Section 4: Improvement Rankings (1-5 scale)
- [ ] Ball handling (1-5 slider/buttons)
- [ ] Defence (1-5 slider/buttons)
- [ ] Finishing (1-5 slider/buttons)
- [ ] Shooting (1-5 slider/buttons)
- [ ] Passing (1-5 slider/buttons)
- [ ] Other (text input + 1-5 ranking)

#### Section 5: Physical Stats
- [ ] Current Weight (number input, lbs/kg toggle)
- [ ] Current Height (feet/inches or cm)
- [ ] Current injuries (text area, optional)

#### Section 6: Training & Health
- [ ] Are you seeing physiotherapy? (Yes/No toggle)
- [ ] Do you weight train? (Yes/No toggle)
- [ ] Do you stretch? (Yes/No toggle)

#### Section 7: Team & Competition
- [ ] Current Teams: Select (No Team, Elementary, Middle School, Highschool, College, Pro)
- [ ] Outside of school teams: Select (AAU, Prep, No team)
- [ ] In season or off season? (Toggle)

#### Section 8: Basketball Watching
- [ ] How much basketball do you watch? (Multi-select: Your own film, NBA/Pro/College, Both, None)

#### Section 9: Equipment & Availability
- [ ] Access to equipment: Select (Full gym, Half gym, Driveway, Park)
- [ ] Days you can train: Multi-select checkboxes (Monday-Sunday)
- [ ] Average session length: Select (30, 45, 60 minutes)

#### Section 10: Mental & Coaching
- [ ] Biggest in-game struggle right now? (text area)
- [ ] Confidence Level: 1-5 slider
- [ ] Biggest mental challenge: Select (Fear of failure, Consistency, Pressure, Motivation, Other)
- [ ] If Other selected: Text input
- [ ] How coachable are you? 1-5 slider
- [ ] Preferred coaching style: Select (Direct, Encouraging, Accountability, Driven, Mix, Other)
- [ ] If Other selected: Text input

#### Section 11: Video Upload (Optional)
- [ ] "Upload Game Film" button
- [ ] Video picker/uploader
- [ ] Progress indicator
- [ ] Preview uploaded video
- [ ] "Skip" option

#### Section 12: Workout Videos Upload (Optional)
- [ ] "Upload Workout Videos" button
- [ ] Multiple video upload support
- [ ] Progress indicators
- [ ] Preview uploaded videos
- [ ] "Skip" option

- [ ] Save progress as user goes (auto-save)
- [ ] "Complete Questionnaire" button at end
- [ ] On submit: Save to `pro_plus_questionnaire` table
- [ ] Redirect to calendar booking

### 2.7 Onboarding Flow - Step 5: Calendar Booking (Pro+ Only)
- [x] Create `/onboarding/book-call` page (web)
- [ ] Create book call screen (Expo) - **TODO: Expo app**
- [x] Calendar view showing available dates
- [x] Time slots: 12pm-5pm (hourly: 12pm, 1pm, 2pm, 3pm, 4pm, 5pm)
- [x] Show unavailable dates (already booked)
- [x] Date picker/calendar component
- [x] Time slot selector
- [x] "Book Coach Call" button
- [x] On booking:
  - [x] Create `coach_calls` record
  - [x] Generate Google Meet link (via Google Calendar API)
  - [x] Create Google Calendar event
  - [ ] Send confirmation email/notification - **TODO: Email integration**
- [x] Show success message with meeting details
- [x] Redirect to dashboard (or coach calls page)
- [x] Create `/dashboard/coach-calls` page for viewing scheduled calls

---

## Phase 3: AI Assistant Access Control

### 3.1 AI Assistant Component Updates
- [x] Find existing AI assistant component/page (created new)
- [x] Add tier check before allowing access (`getUserTier` function)
- [x] If Free tier: Show upgrade prompt component
- [x] Upgrade prompt:
  - [x] "Upgrade to Pro or Pro+ to access AI Assistant"
  - [x] Show Pro and Pro+ tier cards
  - [x] "Upgrade to Pro" button → redirects to upgrade page
  - [x] "Upgrade to Pro+" button → redirects to upgrade page
  - [x] Smooth UI/UX
- [x] If Pro/Pro+ tier: Allow access normally (AI Assistant component)
- [x] Create `/dashboard/ai-assistant` page
- [x] Create `UpgradePrompt` component
- [x] Create `AIAssistant` component (placeholder for now)

### 3.2 Upgrade Flow
- [x] Create `/upgrade` page (web)
- [ ] Create upgrade screen (Expo) - **TODO: Expo app**
- [x] Show current tier
- [x] Show available upgrade options
- [ ] Handle subscription upgrades:
  - [ ] Free → Pro: Create new subscription (Stripe integration needed)
  - [ ] Free → Pro+: Create new subscription (Stripe integration needed)
  - [ ] Pro → Pro+: Update existing subscription (prorate) (Stripe integration needed)
- [x] After upgrade: Redirects to community page where Stripe checkout exists
- [x] Create `UpgradePage` component

---

## Phase 4: Google Calendar & Meet Integration

### 4.1 Google Cloud Setup
- [x] Create Google Cloud Project (or use existing) - **TODO: User needs to set up**
- [x] Enable Google Calendar API - **TODO: User needs to enable**
- [x] Enable Google Meet API (if separate) - **TODO: User needs to enable** (Meet is included with Calendar API)
- [x] Create Service Account - **TODO: User needs to create**
- [x] Generate service account JSON key - **TODO: User needs to generate**
- [x] Add to `.env`:
  - [x] `GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL` - **TODO: User needs to add**
  - [x] `GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY` (JSON string or file path) - **TODO: User needs to add**
  - [x] `GOOGLE_CALENDAR_ID` (Calendar ID for coach calls) - **TODO: User needs to add**

### 4.2 Google Calendar API Integration
- [x] Install `googleapis` package
- [x] Create `lib/google-calendar.ts`:
  - [x] `createCalendarEvent()` - Creates event with Google Meet link
  - [x] `generateMeetLink()` - Generates Google Meet URL (via conferenceData)
  - [x] `checkAvailability()` - Checks if date/time is available
  - [x] `listBookedDates()` - Gets all booked dates
  - [x] `cancelEvent()` - Cancels a booking
  - [x] `getEvent()` - Get event details
- [ ] Test calendar integration - **TODO: After Google Cloud setup**

### 4.3 Calendar Booking API
- [x] Create `POST /api/coach-calls/book` endpoint:
  - [x] Validate user is Pro+
  - [x] Check date/time availability
  - [x] Create Google Calendar event (if configured)
  - [x] Generate Google Meet link (if configured)
  - [x] Save to `coach_calls` table
  - [x] Return meeting details
- [x] Create `GET /api/coach-calls/availability` endpoint:
  - [x] Returns available dates/times
  - [x] Excludes already booked dates

### 4.4 Calendar Booking UI
- [x] Create `/onboarding/book-call` page
- [x] Create `BookCoachCall` component:
  - [x] Calendar view showing available dates
  - [x] Time slots: 12pm-5pm (hourly)
  - [x] Show unavailable dates (already booked)
  - [x] Date picker/calendar component
  - [x] Time slot selector
  - [x] "Book Coach Call" button
  - [x] Success message with meeting details
- [x] Create `/dashboard/coach-calls` page for viewing scheduled calls
- [ ] Create book call screen (Expo) - **TODO: Expo app**

---

## Phase 5: Admin - Personalized Programs Management

### 5.1 Admin Programs List (Web)
- [x] Create "Personal Programs" section in admin dashboard (`/dashboard/admin/personalized-programs`)
- [x] List all Pro+ users who have completed questionnaire
- [x] Show user name, email, subscription status
- [x] Show if they have existing programs
- [x] "View User" button → User detail screen
- [ ] Create "Personal Programs" section in admin dashboard (Expo App) - **TODO: Expo app**

### 5.2 Admin User Detail Screen (Web)
- [x] Show user info
- [x] Show questionnaire answers (read-only, scrollable) (`/dashboard/admin/personalized-programs/[userId]/questionnaire`)
- [x] Show existing programs for this user
- [x] "+" button → Create new program
- [ ] Create user detail screen (Expo App) - **TODO: Expo app**

### 5.3 Admin Create Program Screen (Web)
- [x] Form fields:
  - [x] Program Title (text input)
  - [x] Description (text area)
  - [x] Upload Video (video picker, upload to Vercel Blob)
  - [x] Training Days: Multi-select checkboxes (Monday-Sunday)
  - [x] Start Date: Date picker
  - [x] End Date: Date picker
- [x] Validation:
  - [x] End date must be after start date
  - [x] At least one training day selected
  - [x] Video required
- [x] "Create Program" button
- [x] On create:
  - [x] Save to `personalized_programs` table
  - [x] Generate checklist items for all dates between start/end dates that match training days
  - [x] Save all checklist items to `program_checklist_items` table
  - [ ] Send notification to user - **TODO: Push notifications (Phase 8)**
  - [x] Redirect back to user detail
- [ ] Create program screen (Expo App) - **TODO: Expo app**

### 5.4 Admin Program List View (Web)
- [x] Show all programs for selected user
- [x] Each program card shows:
  - [x] Title
  - [x] Video thumbnail
  - [x] Training days
  - [x] Date range
  - [x] Completion stats (X/Y completed)
  - [x] "View Details" button
- [ ] Create program list view (Expo App) - **TODO: Expo app**

### 5.5 Admin Program Details View (Web)
- [x] Show program details
- [x] Show checklist with all dates
- [x] For each checklist item:
  - [x] Due date
  - [x] Completed status (checkmark if done)
  - [x] Completion date
  - [x] Days late indicator (red if late, green if on time)
  - [x] Enjoyment rating (if completed)
  - [x] Difficulty rating (if completed)
- [x] Sort by date (ascending)
- [ ] Create program details view (Expo App) - **TODO: Expo app**

---

## Phase 6: User - Personalized Programs View

### 6.1 User Dashboard - Programs Card (Web)
- [x] Add "Your Personal Programs" card at top of dashboard (Pro+ only)
- [x] Show count of active programs
- [x] Show next due date
- [x] "View Programs" button → Programs list screen
- [ ] Create programs card (Expo App) - **TODO: Expo app**

### 6.2 User Programs List Screen (Web)
- [x] Show all active programs assigned to user (`/dashboard/personalized-programs`)
- [x] Each program card shows:
  - [x] Title
  - [x] Video thumbnail
  - [x] Training days
  - [x] Progress indicator (X/Y completed)
  - [x] Next due date
  - [x] "View Program" button
- [ ] Create programs list screen (Expo App) - **TODO: Expo app**

### 6.3 User Program Detail Screen (Web)
- [x] Show program title and description
- [x] Video player (same as channel videos)
- [x] Checklist section:
  - [x] Show all checklist items
  - [x] Show chronologically (sorted by date)
  - [x] For each item:
    - [x] Due date
    - [x] Checkbox (disabled if date hasn't arrived yet)
    - [x] If due today: Highlighted, show "Due Today" badge
    - [x] If past due: Red indicator, show "X days late"
    - [x] If completed: Checkmark, show completion date
- [x] "Check Off" button (only enabled if date has arrived)
- [x] On check off:
  - [x] Show rating modal (enjoyment + difficulty)
  - [x] Save ratings
  - [x] Update checklist item
  - [x] Show success toast notification
- [ ] Create program detail screen (Expo App) - **TODO: Expo app**

### 6.4 Rating Modal (Web)
- [x] Modal after checking off workout
- [x] "How much did you enjoy it?" section:
  - [x] 5 emoji/icons (😞 😕 😐 😊 😄)
  - [x] Click to select (1-5)
- [x] "How difficult was it?" section:
  - [x] 5 labels (Very Easy → Very Hard)
  - [x] Click to select (1-5)
- [x] "Submit" button
- [x] Save ratings to checklist item
- [x] Close modal with animation
- [ ] Create rating modal (Expo App) - **TODO: Expo app**

---

## Phase 7: Push Notifications

### 7.1 Push Notification Setup (Expo)
- [ ] Set up Expo Push Notifications
- [ ] Request notification permissions
- [ ] Store push token in database (`user.pushToken` field)
- [ ] Create notification service

### 7.2 Workout Reminder Notifications
- [ ] Create scheduled job/cron:
  - [ ] Runs daily at 8am (or configurable time)
  - [ ] Finds all Pro+ users with workouts due today
  - [ ] Sends push notification: "You have a workout due today: [Program Title]"
- [ ] Notification includes:
  - [ ] Program title
  - [ ] Due date
  - [ ] Deep link to program detail screen

### 7.3 Notification Handling (Expo App)
- [ ] Handle notification tap
- [ ] Navigate to program detail screen
- [ ] Highlight the due workout

---

## Phase 8: UI/UX Polish

### 8.1 Design System
- [ ] Use consistent icons (Lucide React for web, Expo Icons for mobile)
- [ ] Consistent color scheme
- [ ] Smooth animations and transitions
- [ ] Loading states for all async operations
- [ ] Error states with helpful messages
- [ ] Empty states with illustrations

### 8.2 Onboarding Flow Polish
- [ ] Progress indicators (Step X of Y)
- [ ] Smooth page transitions
- [ ] Back button support
- [ ] Save progress (don't lose data on refresh)
- [ ] Validation with helpful error messages
- [ ] Icons for each question/section
- [ ] Clean, modern card-based layouts

### 8.3 Program Views Polish
- [ ] Video player with consistent styling
- [ ] Checklist with visual feedback
- [ ] Completion animations
- [ ] Progress bars/circles
- [ ] Date formatting (relative: "Today", "Tomorrow", "In 3 days")
- [ ] Color coding (green for on-time, red for late, gray for upcoming)

---

## Phase 9: Testing & Edge Cases

### 9.1 Signup & Onboarding Testing
- [ ] Test username uniqueness
- [ ] Test email uniqueness
- [ ] Test password validation
- [ ] Test OAuth signup still works
- [ ] Test onboarding flow for each interest type
- [ ] Test tier selection and Stripe checkout
- [ ] Test Pro+ questionnaire completion
- [ ] Test calendar booking

### 9.2 Program Management Testing
- [ ] Test program creation by admin
- [ ] Test checklist generation (all dates between start/end matching training days)
- [ ] Test checking off workouts (only on/after due date)
- [ ] Test rating submission
- [ ] Test late completion tracking
- [ ] Test program completion

### 9.3 Edge Cases
- [ ] User upgrades from Pro to Pro+ mid-cycle
- [ ] User cancels subscription (what happens to programs?)
- [ ] Admin deletes a program (what happens to checklist?)
- [ ] Multiple programs with overlapping dates
- [ ] Timezone handling for dates
- [ ] Calendar booking conflicts
- [ ] Video upload failures
- [ ] Google Meet link generation failures

---

## Phase 10: Documentation

### 10.1 API Documentation
- [ ] Document all new API endpoints
- [ ] Document request/response formats
- [ ] Document error codes

### 10.2 User Documentation
- [ ] Create user guide for signup/onboarding
- [ ] Create guide for Pro+ features
- [ ] Create guide for personalized programs

### 10.3 Admin Documentation
- [ ] Create admin guide for creating programs
- [ ] Create guide for viewing completion stats

---

## Environment Variables Needed

Add to `.env`:
```
# Google Calendar & Meet
GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CALENDAR_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com

# Stripe (update prices)
STRIPE_PRO_PRICE_ID=price_xxx (new $20/mo price)
STRIPE_PRO_PLUS_PRICE_ID=price_xxx (new $25/mo price)

# Push Notifications (Expo)
EXPO_PUSH_NOTIFICATION_KEY=your-expo-push-key
```

---

## Implementation Order

1. **Database Schema** (Phase 1) - Foundation
2. **Signup & Authentication** (Phase 2.1-2.2) - Core auth
3. **Onboarding Flow** (Phase 2.3-2.7) - User journey
4. **AI Assistant Access Control** (Phase 3) - Quick win
5. **Google Calendar Integration** (Phase 4) - Calendar booking
6. **Admin Programs** (Phase 5) - Admin tools
7. **User Programs** (Phase 6) - User experience
8. **Push Notifications** (Phase 7) - Engagement
9. **UI/UX Polish** (Phase 8) - Refinement
10. **Testing** (Phase 9) - Quality assurance

---

## Notes

- All dates should be stored in UTC, displayed in user's timezone
- Video uploads go to Vercel Blob Storage
- Stripe webhooks handle subscription changes
- Push notifications require Expo setup
- Google Calendar requires service account setup
- All forms should have auto-save where possible
- Mobile-first design for Expo app
- Responsive design for web app
