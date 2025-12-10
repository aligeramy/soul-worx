import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"

interface Video {
  title: string
  slug: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number | null
  episodeNumber: number
  seasonNumber: number
  isFirstEpisode: boolean
  requiredTierLevel: number
  status: string
  tags: string[]
  metaTitle: string
  metaDescription: string
}

interface Channel {
  channel: {
    title: string
    slug: string
    description: string
    longDescription: string
    category: string
    status: string
    coverImage: string
    thumbnailImage: string
    requiredTierLevel: number
    isFeatured: boolean
    tags: string[]
    metaTitle: string
    metaDescription: string
    sortOrder: number
  }
  videos: Video[]
}

interface ChannelsData {
  channels: Channel[]
}

// This script will generate SQL that you can run via Supabase MCP
async function main() {
  console.log("📝 Generating SQL for channels and videos insertion...\n")
  
  // Read the JSON file
  const jsonPath = join(process.cwd(), "data", "new-channels.json")
  const jsonData: ChannelsData = JSON.parse(readFileSync(jsonPath, "utf-8"))
  
  // First, get admin user ID - we'll need to query this
  console.log("Step 1: Get admin user ID")
  console.log("Run this SQL first to get admin user ID:")
  console.log("SELECT id FROM \"user\" WHERE role = 'admin' LIMIT 1;\n")
  
  const sqlStatements: string[] = []
  
  // Insert channels
  for (const channelData of jsonData.channels) {
    const channel = channelData.channel
    const now = new Date().toISOString()
    
    // Check if channel exists
    const checkChannelSQL = `
-- Check if channel '${channel.slug}' exists
SELECT id FROM community_channel WHERE slug = '${channel.slug}';
`
    
    // Insert channel
    const insertChannelSQL = `
-- Insert channel: ${channel.title}
INSERT INTO community_channel (
  id, slug, title, description, "longDescription", category, status,
  "coverImage", "thumbnailImage", "requiredTierLevel", "isFeatured",
  tags, "videoCount", "metaTitle", "metaDescription", "sortOrder",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  '${channel.slug}',
  '${channel.title.replace(/'/g, "''")}',
  '${channel.description.replace(/'/g, "''")}',
  '${channel.longDescription.replace(/'/g, "''")}',
  '${channel.category}',
  '${channel.status}',
  '${channel.coverImage}',
  '${channel.thumbnailImage}',
  ${channel.requiredTierLevel},
  ${channel.isFeatured},
  '${JSON.stringify(channel.tags)}'::jsonb,
  0,
  '${channel.metaTitle.replace(/'/g, "''")}',
  '${channel.metaDescription.replace(/'/g, "''")}',
  ${channel.sortOrder},
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '${now}',
  '${now}',
  ${channel.status === 'published' ? `'${now}'` : 'NULL'}
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "longDescription" = EXCLUDED."longDescription",
  "updatedAt" = '${now}'
RETURNING id;
`
    
    sqlStatements.push(insertChannelSQL)
    
    // Insert videos for this channel
    for (const video of channelData.videos) {
      const insertVideoSQL = `
-- Insert video: ${video.title} (Episode ${video.episodeNumber})
INSERT INTO video (
  id, "channelId", slug, title, description, "videoUrl", "thumbnailUrl",
  duration, "isFirstEpisode", "episodeNumber", "seasonNumber",
  "requiredTierLevel", status, "viewCount", tags, "metaTitle", "metaDescription",
  "createdBy", "createdAt", "updatedAt", "publishedAt"
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1),
  '${video.slug}',
  '${video.title.replace(/'/g, "''")}',
  '${video.description.replace(/'/g, "''")}',
  '${video.videoUrl}',
  ${video.thumbnailUrl ? `'${video.thumbnailUrl}'` : 'NULL'},
  ${video.duration || 'NULL'},
  ${video.isFirstEpisode},
  ${video.episodeNumber},
  ${video.seasonNumber},
  ${video.requiredTierLevel},
  '${video.status}',
  0,
  '${JSON.stringify(video.tags)}'::jsonb,
  '${video.metaTitle.replace(/'/g, "''")}',
  '${video.metaDescription.replace(/'/g, "''")}',
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  '${now}',
  '${now}',
  ${video.status === 'published' ? `'${now}'` : 'NULL'}
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = '${now}';
`
      
      sqlStatements.push(insertVideoSQL)
    }
    
    // Update video count
    const updateVideoCountSQL = `
-- Update video count for channel: ${channel.title}
UPDATE community_channel
SET "videoCount" = (
  SELECT COUNT(*) FROM video WHERE "channelId" = (
    SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1
  )
)
WHERE slug = '${channel.slug}';
`
    
    sqlStatements.push(updateVideoCountSQL)
  }
  
  // Write SQL to file
  const sqlPath = join(process.cwd(), "scripts", "insert-channels-videos.sql")
  const fullSQL = sqlStatements.join("\n\n")
  
  require("fs").writeFileSync(sqlPath, fullSQL, "utf-8")
  
  console.log(`✅ Generated SQL file: ${sqlPath}`)
  console.log(`\n📊 Summary:`)
  console.log(`  Channels: ${jsonData.channels.length}`)
  console.log(`  Total Videos: ${jsonData.channels.reduce((sum, c) => sum + c.videos.length, 0)}`)
  console.log(`\n💡 Next step: Use Supabase MCP to execute this SQL`)
}

main().catch(console.error)
