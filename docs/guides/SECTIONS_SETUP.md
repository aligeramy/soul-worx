# Channel Sections Setup Guide

This guide explains how to set up the new sections/tabs feature for online channels.

## Database Migration

### Step 1: Apply the Migration

Use Supabase MCP to apply the migration:

```sql
-- Run this via Supabase MCP: mcp_supabase_apply_migration
-- Name: add_sections
-- Query: (see lib/db/migrations/add_sections.sql)
```

Or manually execute the SQL from `lib/db/migrations/add_sections.sql` via Supabase dashboard.

## Inserting Data

### Step 2: Generate SQL from CSV

Run the script to generate SQL:

```bash
tsx scripts/insert-episodes-with-sections.ts
```

This will output SQL statements that you can execute via Supabase MCP.

### Step 3: Execute SQL via Supabase MCP

Use the Supabase MCP tool to execute the generated SQL:

1. Copy the SQL output from the script
2. Use `mcp_supabase_apply_migration` with:
   - `name`: "insert_channels_sections_episodes"
   - `query`: (paste the generated SQL)

Or use `mcp_supabase_execute_sql` to run the SQL directly.

## What's Been Updated

### Database Schema
- ✅ Added `channel_section` table
- ✅ Added `sectionId` column to `video` table
- ✅ Updated relations in schema

### Next.js App
- ✅ Channel page now displays sections as tabs
- ✅ Videos are grouped by sections
- ✅ Tabs component integrated

### Expo App
- ✅ Channel screen displays sections as horizontal tabs
- ✅ Videos filtered by selected section
- ✅ Updated queries to support sections

## Structure

Each channel can now have multiple sections (tabs):
- **Ball Handling Fundamentals** → Sections: "No Court"
- **Shooting Fundamentals** → Sections: "On Court", "Stretching", "Explanation"
- **Two Ball Dribbling Mastery** → Sections: "Two Ball"
- **Advanced Shooting with Rebounder** → Sections: "On Court + Rebounder"

Videos are organized within sections, maintaining episode numbers within each section.

## Next Steps

1. Apply the migration via Supabase MCP
2. Run the insertion script to generate SQL
3. Execute the SQL via Supabase MCP
4. Test the UI in both Next.js and Expo apps
5. Replace placeholder video URLs with actual Vercel Blob URLs



