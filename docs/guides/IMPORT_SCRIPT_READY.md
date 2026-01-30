# Import Script Ready ✅

## Script Created
`scripts/import-episodes-from-csv.ts`

## What It Does

1. **Parses CSV** - Reads `data/episodes-database-structure.csv`
2. **Uploads Cover Arts** - Uploads 4 PNG files from `vids/cover-art/` to Vercel Blob
3. **Creates Channels** - Creates 4 channels in Supabase database
4. **Creates Sections** - Creates sections within each channel
5. **Uploads Videos** - Uploads all 97 MP4 files to Vercel Blob
6. **Generates Thumbnails** - Uses ffmpeg to extract thumbnails from videos
7. **Uploads Thumbnails** - Uploads thumbnails to Vercel Blob
8. **Creates Video Records** - Creates all episode records in database

## Prerequisites

1. **ffmpeg installed**: `brew install ffmpeg`
2. **Environment variables**:
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
   - `DATABASE_URL` - Supabase connection string
3. **Admin user exists** in database (role: 'admin' or 'super_admin')

## How to Run

```bash
npx tsx scripts/import-episodes-from-csv.ts
```

## What Gets Imported

### Channels (4)
1. Ball Handling Fundamentals - 21 episodes
2. Shooting Fundamentals - 23 episodes  
3. Two Ball Dribbling Mastery - 35 episodes
4. Advanced Shooting with Rebounder - 18 episodes

### Total: 97 episodes

## File Structure Expected

```
vids/
├── cover-art/
│   ├── 1.png (Ball Handling)
│   ├── 2.png (Shooting)
│   ├── 3.png (Two Ball)
│   └── 4.png (Advanced Shooting)
└── videos/
    ├── 1-ball-handling-fundamentals/
    │   ├── 01-footwork.mp4
    │   ├── 02-pound-dribble-control.mp4
    │   └── ...
    ├── 2-shooting-fundamentals/
    ├── 3-two-ball-dribbling-mastery/
    └── 4-advanced-shooting-rebounder/
```

## Video File Matching

The script matches videos by:
1. Episode number + episode slug pattern: `{episodeNumber}-{episodeSlug}.mp4`
2. Falls back to CSV "File Name" if pattern doesn't match

## Database Structure

- **Channels** → `community_channel` table
- **Sections** → `channel_section` table  
- **Videos** → `video` table

All linked properly with foreign keys.

## Notes

- Videos are uploaded to: `videos/{channel-slug}/{episode-slug}.mp4`
- Thumbnails are uploaded to: `thumbnails/{channel-slug}/{episode-slug}.jpg`
- Cover arts are uploaded to: `cover-arts/{channel-slug}.png`
- All videos set to `status: "published"`
- First episodes marked with `isFirstEpisode: true`
- Tier levels set from CSV `Required Tier Level` column
