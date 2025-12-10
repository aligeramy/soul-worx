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
  }
  videos: Video[]
}

interface ChannelsData {
  channels: Channel[]
}

async function main() {
  console.log("📝 Generating SQL to insert all videos...\n")
  
  const jsonPath = join(process.cwd(), "data", "new-channels.json")
  const jsonData: ChannelsData = JSON.parse(readFileSync(jsonPath, "utf-8"))
  
  const sqlStatements: string[] = []
  
  for (const channelData of jsonData.channels) {
    const channel = channelData.channel
    
    console.log(`Processing ${channel.title} (${channelData.videos.length} videos)...`)
    
    for (const video of channelData.videos) {
      if (!video.videoUrl) {
        console.log(`  ⚠️  Skipping ${video.title} - no videoUrl`)
        continue
      }
      
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
      
      sqlStatements.push(sql)
    }
    
    // Update video count
    sqlStatements.push(`UPDATE community_channel SET "videoCount" = (SELECT COUNT(*) FROM video WHERE "channelId" = (SELECT id FROM community_channel WHERE slug = '${channel.slug}' LIMIT 1)) WHERE slug = '${channel.slug}';`)
  }
  
  const fullSQL = sqlStatements.join("\n\n")
  
  const sqlPath = join(process.cwd(), "scripts", "insert-all-videos.sql")
  require("fs").writeFileSync(sqlPath, fullSQL, "utf-8")
  
  console.log(`\n✅ Generated SQL file: ${sqlPath}`)
  console.log(`📊 Total videos to insert: ${jsonData.channels.reduce((sum, c) => sum + c.videos.filter(v => v.videoUrl).length, 0)}`)
}

main().catch(console.error)
