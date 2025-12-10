import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"

interface Video {
  title: string
  slug: string
  videoUrl: string
  thumbnailUrl: string
  episodeNumber: number
}

interface Channel {
  channel: {
    slug: string
  }
  videos: Video[]
}

interface ChannelsData {
  channels: Channel[]
}

async function main() {
  console.log("📝 Generating SQL to update video thumbnails...\n")
  
  const jsonPath = join(process.cwd(), "data", "new-channels.json")
  const jsonData: ChannelsData = JSON.parse(readFileSync(jsonPath, "utf-8"))
  
  const sqlStatements: string[] = []
  
  for (const channelData of jsonData.channels) {
    const channel = channelData.channel
    
    for (const video of channelData.videos) {
      if (!video.thumbnailUrl) {
        console.log(`  ⚠️  Skipping ${video.title} - no thumbnailUrl`)
        continue
      }
      
      const sql = `UPDATE video 
SET "thumbnailUrl" = '${video.thumbnailUrl}',
    "updatedAt" = NOW()
WHERE slug = '${video.slug}';`
      
      sqlStatements.push(sql)
    }
  }
  
  const fullSQL = sqlStatements.join("\n\n")
  
  const sqlPath = join(process.cwd(), "scripts", "update-thumbnails.sql")
  require("fs").writeFileSync(sqlPath, fullSQL, "utf-8")
  
  console.log(`✅ Generated SQL file: ${sqlPath}`)
  console.log(`📊 Total videos to update: ${jsonData.channels.reduce((sum, c) => sum + c.videos.filter(v => v.thumbnailUrl).length, 0)}`)
  console.log(`\n💡 Next step: Use Supabase MCP to execute this SQL`)
}

main().catch(console.error)
