import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"

// This script shows how to use Supabase MCP to insert data
// Since MCP doesn't support programmatic calls from scripts,
// we'll generate the SQL and you can execute it via MCP

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

async function main() {
  console.log("📝 Preparing SQL for Supabase MCP execution...\n")
  
  const jsonPath = join(process.cwd(), "data", "new-channels.json")
  const jsonData: ChannelsData = JSON.parse(readFileSync(jsonPath, "utf-8"))
  
  // Generate SQL for all videos
  const videoInserts: string[] = []
  
  for (const channelData of jsonData.channels) {
    const channel = channelData.channel
    
    for (const video of channelData.videos) {
      const sql = `INSERT INTO video (
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
  NOW(),
  NOW(),
  ${video.status === 'published' ? 'NOW()' : 'NULL'}
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "videoUrl" = EXCLUDED."videoUrl",
  "thumbnailUrl" = EXCLUDED."thumbnailUrl",
  "updatedAt" = NOW();`
      
      videoInserts.push(sql)
    }
    
    // Add video count update
    videoInserts.push(`UPDATE community_channel SET "videoCount" = (SELECT COUNT(*) FROM video WHERE "channelId" = (SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1)) WHERE slug = '${channel.slug}';`)
  }
  
  const fullSQL = videoInserts.join("\n\n")
  
  console.log("✅ Generated SQL for all videos")
  console.log(`📊 Total videos: ${jsonData.channels.reduce((sum, c) => sum + c.videos.length, 0)}`)
  console.log("\n💡 Copy the SQL from insert-channels-videos.sql and execute via Supabase MCP")
  console.log("   Or use: mcp_user-supabase_execute_sql with the full SQL")
}

main().catch(console.error)


