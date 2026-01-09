# Episodes Import Instructions

## Overview

The online channel system now supports **sections/tabs** within each program. Each channel can have multiple sections, and videos are organized within these sections.

## Database Changes

### 1. Migration Applied ✅

The migration `add_sections.sql` creates:
- `channel_section` table for organizing videos into tabs
- `sectionId` column in `video` table

### 2. Data Structure

From `episodes-database-structure.csv`:
- **4 Channels**: Ball Handling, Shooting, Two Ball, Advanced Shooting
- **Multiple Sections per Channel**: No Court, On Court, Two Ball, etc.
- **96+ Episodes** organized by section

## Steps to Import Data

### Step 1: Apply Database Migration

Use Supabase MCP to apply the migration:

```bash
# Read the migration file
cat lib/db/migrations/add_sections.sql

# Apply via Supabase MCP
# Use: mcp_supabase_apply_migration
# - project_id: (your project ID)
# - name: "add_sections"
# - query: (contents of add_sections.sql)
```

### Step 2: Generate SQL from CSV

Run the script to generate insertion SQL:

```bash
tsx scripts/insert-episodes-with-sections.ts
```

This will output SQL statements that:
- Create/update channels
- Create sections for each channel
- Insert videos with section assignments
- Use placeholder Vercel Blob URLs (you'll replace these later)

### Step 3: Execute SQL via Supabase MCP

Copy the generated SQL and execute it:

**Option A: Using Migration**
```bash
# Use: mcp_supabase_apply_migration
# - project_id: (your project ID)
# - name: "insert_channels_sections_episodes"
# - query: (paste generated SQL)
```

**Option B: Direct SQL Execution**
```bash
# Use: mcp_supabase_execute_sql
# - project_id: (your project ID)
# - query: (paste generated SQL)
```

### Step 4: Verify Data

Check that data was inserted correctly:

```sql
-- Check channels
SELECT id, slug, title, "videoCount" FROM community_channel;

-- Check sections
SELECT cs.id, cs.title, cs.slug, cc.title as channel_title
FROM channel_section cs
JOIN community_channel cc ON cs."channelId" = cc.id
ORDER BY cc.title, cs."sortOrder";

-- Check videos with sections
SELECT v.title, v."episodeNumber", cs.title as section_title, cc.title as channel_title
FROM video v
JOIN community_channel cc ON v."channelId" = cc.id
LEFT JOIN channel_section cs ON v."sectionId" = cs.id
ORDER BY cc.title, cs."sortOrder", v."episodeNumber";
```

## UI Updates

### Next.js App ✅
- Channel page displays sections as tabs using Radix UI Tabs
- Videos grouped by selected section
- Backward compatible with videos without sections

### Expo App ✅
- Channel screen displays sections as horizontal scrollable tabs
- Videos filtered by selected section
- Smooth tab switching

## Placeholder Video URLs

The script uses placeholder Vercel Blob URLs:
- Videos: `https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/videos/placeholder-*.mp4`
- Thumbnails: `https://c5ycdc1ptiousqvk.public.blob.vercel-storage.com/thumbnails/placeholder-*.jpg`

**To replace later:**
1. Upload actual videos to Vercel Blob Storage
2. Update video URLs in database:
   ```sql
   UPDATE video 
   SET "videoUrl" = 'new-url-here', "thumbnailUrl" = 'new-thumbnail-url-here'
   WHERE slug = 'episode-slug';
   ```

## Testing

After importing:

1. **Next.js**: Visit `/programs/community/[channel-slug]`
   - Should see tabs for each section
   - Clicking tabs filters videos

2. **Expo**: Navigate to channel screen
   - Should see horizontal tabs at top
   - Tapping tabs filters videos below

## Troubleshooting

### No sections showing?
- Check that sections were created: `SELECT * FROM channel_section;`
- Verify videos have `sectionId` set: `SELECT id, title, "sectionId" FROM video WHERE "sectionId" IS NOT NULL;`

### Videos not filtering?
- Check that `sectionId` matches in videos and sections
- Verify section queries in `expo/lib/queries.ts` and Next.js page

### Migration fails?
- Ensure you have admin permissions
- Check that `channel_section` table doesn't already exist
- Verify foreign key constraints

## Next Steps

1. ✅ Apply migration
2. ✅ Import data via Supabase MCP
3. ⏳ Replace placeholder video URLs with actual videos
4. ⏳ Test in both Next.js and Expo apps
5. ⏳ Add more episodes as needed



