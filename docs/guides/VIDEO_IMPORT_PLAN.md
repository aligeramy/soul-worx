# Video Import Plan

## Overview
Import 4 channels with ~100 videos from `vids/` directory into Supabase database using CSV structure from `data/episodes-database-structure.csv`.

## Current State Analysis

### CSV Structure (`data/episodes-database-structure.csv`)
- **Total Episodes**: 98 rows (97 episodes + 1 header)
- **Channels**:
  1. **Ball Handling Fundamentals** (`ball-handling-fundamentals`) - 21 episodes
  2. **Shooting Fundamentals** (`shooting-fundamentals`) - 23 episodes  
  3. **Two Ball Dribbling Mastery** (`two-ball-dribbling-mastery`) - 35 episodes
  4. **Advanced Shooting with Rebounder** (`advanced-shooting-rebounder`) - 18 episodes

### Video Files (`vids/videos/`)
- **Total Videos**: 100 MP4 files
- **Cover Arts**: 4 PNG files (`vids/cover-art/1.png` through `4.png`)
- **Organization**:
  - `1-ball-handling-fundamentals/` - 21 videos ✅
  - `2-shooting-fundamentals/` - 23 videos ✅
  - `3-two-ball-dribbling-mastery/` - 35 videos ✅
  - `4-advanced-shooting-rebounder/` - 21 videos ⚠️ (CSV has 18 episodes)

### Discrepancies Found
1. **Advanced Shooting with Rebounder**: 
   - CSV has 18 episodes
   - Video folder has 21 videos
   - Extra videos likely: `19-contested-shot-fun-clip.mp4`, `20-extra-video-1.mp4`, `21-extra-video-2.mp4`
   - **Action**: Need to verify if these should be imported or skipped

## Import Plan

### Phase 1: Validation & Preparation
1. ✅ **Verify CSV structure** - Check all required fields are present
2. ✅ **Match videos to CSV** - Ensure video filenames match CSV "File Name" column
3. ⚠️ **Resolve discrepancies** - Handle extra videos in Advanced Shooting channel
4. ✅ **Verify cover arts** - Ensure 4 cover art images exist and match channels

### Phase 2: Database Import
1. **Create Channels** (4 channels)
   - Use CSV data: Channel Name, Slug, Description, Category
   - Upload cover art from `vids/cover-art/` to Vercel Blob
   - Set status to "published"

2. **Create Sections** (within each channel)
   - Extract unique sections from CSV
   - Map Section Name → `channel_section.title`
   - Use Section Order for `sortOrder`

3. **Create Videos/Episodes** (97-100 videos)
   - Match video files to CSV rows by filename
   - Upload videos to Vercel Blob Storage
   - Create database records with:
     - Channel ID (from created channel)
     - Section ID (from created section)
     - Episode metadata from CSV
     - Video URL (from Vercel Blob upload)
     - Thumbnail URL (generate/upload thumbnails)

### Phase 3: Video Processing
1. **Upload Videos to Vercel Blob**
   - Upload all MP4 files from `vids/videos/`
   - Organize by channel: `videos/{channel-slug}/{filename}`
   - Track upload progress

2. **Generate Thumbnails**
   - Extract thumbnail from each video
   - Upload thumbnails to Vercel Blob: `thumbnails/{channel-slug}/{filename}.jpg`
   - Update video records with thumbnail URLs

### Phase 4: Data Mapping

#### Channel Mapping
| CSV Column | Database Field | Notes |
|------------|---------------|-------|
| Channel Name | `title` | |
| Channel Slug | `slug` | Already in CSV |
| Channel Description | `description` | |
| Channel Category | `category` | Should be "basketball" |

#### Section Mapping
| CSV Column | Database Field | Notes |
|------------|---------------|-------|
| Section Name | `title` | |
| Section Slug | `slug` | Already in CSV |
| Section Order | `sortOrder` | |

#### Video Mapping
| CSV Column | Database Field | Notes |
|------------|---------------|-------|
| Episode Title | `title` | |
| Episode Slug | `slug` | Already in CSV |
| Episode Description | `description` | |
| Episode Number | `episodeNumber` | |
| Season Number | `seasonNumber` | Default: 1 |
| File Name | Used to match video file | |
| Required Tier Level | `requiredTierLevel` | |
| Is First Episode | `isFirstEpisode` | |
| Status | `status` | Should be "published" |
| Tags | `tags` | JSON array |
| Difficulty Level | Store in description or tags | |

## Implementation Steps

### Step 1: Parse CSV
- Read `data/episodes-database-structure.csv`
- Group by Channel → Section → Episode
- Validate all required fields

### Step 2: Create Channels
- For each unique channel in CSV:
  - Create `community_channel` record
  - Upload cover art (`vids/cover-art/{channel-number}.png`)
  - Store cover art URL in `coverImage` field

### Step 3: Create Sections
- For each unique section within each channel:
  - Create `channel_section` record
  - Link to parent channel via `channelId`

### Step 4: Upload Videos & Create Records
- For each episode in CSV:
  - Find matching video file in `vids/videos/{channel-folder}/`
  - Upload video to Vercel Blob
  - Generate thumbnail
  - Upload thumbnail to Vercel Blob
  - Create `video` record with all metadata
  - Link to channel and section

### Step 5: Update Channel Video Counts
- Count videos per channel
- Update `videoCount` field in `community_channel` table

## File Naming Convention

### Videos
- Format: `{episode-number}-{episode-slug}.mp4`
- Example: `01-footwork.mp4`, `02-pound-dribble-control.mp4`

### Cover Arts
- Format: `{channel-number}.png`
- Mapping:
  - `1.png` → Ball Handling Fundamentals
  - `2.png` → Shooting Fundamentals
  - `3.png` → Two Ball Dribbling Mastery
  - `4.png` → Advanced Shooting with Rebounder

## Questions to Resolve

1. **Extra Videos**: What to do with 3 extra videos in Advanced Shooting channel?
   - Option A: Skip them (only import CSV episodes)
   - Option B: Import them as additional episodes
   - Option C: Mark them as "bonus" content

2. **Video Upload Order**: Should videos be uploaded sequentially or in parallel?
   - Recommendation: Parallel batches of 10-20 for speed

3. **Thumbnail Generation**: 
   - Extract from video automatically?
   - Use existing thumbnails if available?
   - Generate at specific timestamp (e.g., 5 seconds)?

4. **Error Handling**:
   - What if a video file is missing?
   - What if upload fails?
   - Should import continue or stop?

## Next Steps

1. ✅ Review this plan
2. ⏳ Resolve discrepancies (extra videos)
3. ⏳ Create import script
4. ⏳ Test with one channel first
5. ⏳ Run full import
6. ⏳ Verify all data imported correctly
